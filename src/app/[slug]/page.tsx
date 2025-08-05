import { getPostBySlug } from '@/lib/graph_queries/getPostBySlug';
import { load } from 'cheerio';
import type { ITOCItem, Post } from '@/lib/types';
import { SinglePost } from './components/SinglePost';
import NotFound from '../NotFound';

export const dynamicParams = false;

async function extractHeadings(html: string): Promise<{ updatedHtml: string; toc: ITOCItem[] }> {
  const $ = load(html);
  const toc: ITOCItem[] = [];

  // Find all heading tags, generate IDs, and build TOC
  $('h2, h3, h4, h5, h6').each((_, el) => {
    const $el = $(el);
    const tag = el.tagName.toLowerCase(); // e.g. "h2"
    const level = parseInt(tag.charAt(1), 10); // heading level
    const text = $el.text().trim();

    // generate or reuse ID
    const id =
      $el.attr('id') ||
      text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

    $el.attr('id', id);
    toc.push({ text, id, level });
  });

  // Get back the updated <body> HTML for dangerouslySetInnerHTML
  const updatedHtml = $('body').html() ?? $.root().html() ?? '';

  return { updatedHtml, toc };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post: Post | null = await getPostBySlug(slug);
  if (!post) {
    return {
      title: `Not found - ${process.env.HOSTNAME}`,
      description: 'Sorry, this post was not found.',
    };
  }
  // Optionally, extract plain text from excerpt/content for meta description
  const description = post.excerpt
    ? post.excerpt.replace(/<[^>]+>/g, '').trim()
    : '';

  return {
    title: post.title,
    description: description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const post: Post | null = await getPostBySlug(slug);
    if (!post) return;
    const { updatedHtml, toc } = await extractHeadings(String(post.content));

    return <SinglePost initialPost={{ ...post, updatedHtml, toc }} />;
  } catch (e) {
    console.error('Error in PostPage:', e);
    return <NotFound />;
  }
}
