// app/api/revalidate/route.ts
import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { verifyIncomingSignature } from '@/lib/security/signedFetch';
import { seenNonce } from '@/lib/security/nonceStore';

export const runtime = 'nodejs';

type Payload = {
  type:
    | 'post.updated'
    | 'post.published'
    | 'post.unpublished'
    | 'post.slug_changed'
    | 'term.created'
    | 'term.updated'
    | 'term.deleted'
    | 'term.slug_changed'
    | 'author.updated'
    | 'author.slug_changed'
    | 'options.updated'
    | 'popular.updated';
  slug?: string;
  oldSlug?: string;
  taxonomy?: 'category' | 'post_tag';
  relatedSlugs?: string[];
  period?: string;
};

export async function POST(req: Request) {
  const verify = await verifyIncomingSignature(req, { seenNonce });
  if (!verify.ok) {
    return NextResponse.json({ message: `Unauthorized: ${verify.reason}` }, { status: 401 });
  }

  const body = (verify.json ?? {}) as Payload;

  const add = new Set<string>();
  const bumpPostsLists = () => add.add('posts');
  const bumpCategoriesList = () => add.add('categories');
  const bumpTagsList = () => add.add('tags');
  const bumpAuthorsList = () => add.add('authors');

  // helpers to avoid ternary statements
  const bumpTermList = () => {
    if (body.taxonomy === 'category') {
      bumpCategoriesList();
    } else {
      bumpTagsList();
    }
  };

  const addTermSlugs = (slug: string) => {
    if (body.taxonomy === 'category') {
      add.add(`category-${slug}`);
    } else {
      add.add(`tag-${slug}`);
    }
  };

  switch (body.type) {
    case 'post.updated': {
      if (body.slug) add.add(`post-${body.slug}`);
      bumpPostsLists();
      for (const s of body.relatedSlugs ?? []) {
        add.add(`category-${s}`); add.add(`category-posts-${s}`);
        add.add(`tag-${s}`);      add.add(`tag-posts-${s}`);
        add.add(`author-${s}`);   add.add(`author-posts-${s}`);
      }
      add.add('recommendation');
      break;
    }

    case 'post.published':
    case 'post.unpublished': {
      if (body.slug) add.add(`post-${body.slug}`);
      bumpPostsLists();
      for (const s of body.relatedSlugs ?? []) {
        add.add(`category-${s}`); add.add(`category-posts-${s}`);
        add.add(`tag-${s}`);      add.add(`tag-posts-${s}`);
        add.add(`author-${s}`);   add.add(`author-posts-${s}`);
      }
      break;
    }

    case 'post.slug_changed': {
      if (body.oldSlug) add.add(`post-${body.oldSlug}`);
      if (body.slug) add.add(`post-${body.slug}`);
      bumpPostsLists();
      break;
    }

    case 'term.created':
    case 'term.deleted': {
      bumpTermList(); // replaces: body.taxonomy === 'category' ? bumpCategoriesList() : bumpTagsList();
      break;
    }

    case 'term.updated': {
      if (body.slug) {
        addTermSlugs(body.slug); // replaces the ternary statement
        bumpTermList();
      }
      break;
    }

    case 'term.slug_changed': {
      if (body.oldSlug) addTermSlugs(body.oldSlug); // replaces ternary
      if (body.slug) addTermSlugs(body.slug);       // replaces ternary
      break;
    }

    case 'author.updated': {
      if (body.slug) add.add(`author-${body.slug}`);
      bumpAuthorsList();
      break;
    }

    case 'author.slug_changed': {
      if (body.oldSlug) add.add(`author-${body.oldSlug}`);
      if (body.slug) add.add(`author-${body.slug}`);
      bumpAuthorsList();
      break;
    }

    case 'options.updated': {
      add.add('site-logo');
      break;
    }

    case 'popular.updated': {
      add.add('popular');
      if (body.period) add.add(`popular-${body.period}`);
      break;
    }

    default:
      return NextResponse.json({ message: 'Unknown type' }, { status: 400 });
  }

  for (const t of add) revalidateTag(t);
  return NextResponse.json({ revalidated: true, tags: Array.from(add), now: Date.now() });
}
