'use server';

import { Post, GraphQLError } from '@/lib/types';
// import { loggedFetch } from '../logged-fetch';
import { normalizeImages } from '../helper_functions/featured_image';

const GRAPHQL_URL: string = process.env.WP_GRAPHQL_URL!;
export async function getAllPosts({
  first = 100,
  after,
  last,
  before,
}: {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
} = {}): Promise<Post[]> {
  const query = `
  query AllPostsFull(
  $first:  Int
  $after:  String
  $last:   Int
  $before: String
) {
  posts(first: $first, after: $after, last: $last, before: $before) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      ...PostFull
    }
  }
}

fragment MediaFields on MediaItem {
  id
  altText
  sourceUrl
  mimeType
  mediaDetails {
    width
    height
    file
    sizes {
      name
      sourceUrl
      width
      height
    }
  }
}

fragment TermFields on TermNode {
  id
  name
  slug
  uri
  description
}

fragment AuthorFields on User {
  id
  name
  slug
  uri
  avatar {
    url
    width
    height
  }
}

fragment PostFull on Post {
  id
  databaseId
  slug
  uri
  status
  isSticky
  title(format: RENDERED)
  excerpt(format: RENDERED)
  content(format: RENDERED)
  date
  modified

  featuredImage {
    node { ...MediaFields }
  }

  author { node { ...AuthorFields } }
  categories { nodes { ...TermFields } }
  tags       { nodes { ...TermFields } }

  # — SEO removed until plugin exposes matching fields —
}

    
  `;

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { first, after, last, before },
      }),
     next: { revalidate: 300}, // We should adjust based on the script in make
      cache: 'force-cache',
    });

    const json = (await res.json()) as {
      data?: { posts?: { nodes: Post[] } };
      errors?: GraphQLError[];
    };

    if (json.errors) {
      console.error('getAllPosts errors:', json.errors);
      return [];
    }

    const rawPosts = json.data?.posts?.nodes ?? [];
    const posts = normalizeImages(rawPosts);
    const firstAuthorSlug = posts[0].author?.node?.slug;

    if (firstAuthorSlug) { 
      await fetch(`${process.env.NEXT_PUBLIC_HOST_URL}/api/update_author_cache/${firstAuthorSlug}`, { method: "POST" });
    }
    // Revalidate the author cache for the first post's author
    
    return posts;

  } catch (error) {
    console.error('getAllPosts failed:', error);
    return [];
  }
}
