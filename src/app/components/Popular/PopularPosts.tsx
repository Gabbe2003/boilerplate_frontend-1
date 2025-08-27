// Serverkomponent (ingen 'use client')
import { getPostByPeriod, getAllPosts } from '@/lib/graph_queries/getPost';
import PopularNews from './PopularPostsGrid';
import { Post } from '@/lib/types';
import { getSiteTagline } from '@/lib/graph_queries/getSiteTagline';

type TickerItem = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  category?: string;
  featuredImage?: string | { node?: { sourceUrl?: string } };
};

export default async function PopularPosts() {
  const taglinePromise = getSiteTagline();

  // Try week → month → all
  let posts = await getPostByPeriod('week');

  if (!posts?.length) {
    posts = await getPostByPeriod('month');
  }

  if (!posts?.length) {
    posts = await getAllPosts();
  }

  const tagline = await taglinePromise;

  if (!posts?.length) return <div>Inga roliga inlägg!</div>;

  // Use only posts (no ads). Keep up to 9 items to match the grid layout.
  const items: Post[] = posts.slice(0, 9);

  // Ticker items (pure posts) — replace author with category
  const tickerItems: TickerItem[] = posts.slice(0, 12).map((p) => ({
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    date: p.date,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    category: (p as any).category,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    featuredImage: (p as any).featuredImage,
  }));

  return <PopularNews items={items} tickerItems={tickerItems} tagline={tagline} />;
}
