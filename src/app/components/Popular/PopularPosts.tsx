// Server Component (no 'use client')
import { getPostByPeriod } from '@/lib/graph_queries/getPost';
import PopularNews from './PopularPostsGrid';
import { Ad, ADS } from '../ads/adsContent';
import { Post } from '@/lib/types';
import { getSiteTagline } from '@/lib/graph_queries/getSiteTagline';

type AdItem = { type: 'ad'; adIndex: number; id: string | number };
type PostItem = Post & { type: 'post' };
type FeedItem = AdItem | PostItem;

type TickerItem = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  author_name?: string;
  featuredImage?: string | { node?: { sourceUrl?: string } };
};

function pickTwoUniqueAds(adsArray: Ad[]): [number, number] {
  if (adsArray.length < 2) return [0, 0];
  const first = Math.floor(Math.random() * adsArray.length);
  let second = Math.floor(Math.random() * adsArray.length);
  while (second === first && adsArray.length > 1) {
    second = Math.floor(Math.random() * adsArray.length);
  }
  return [first, second];
}

function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default async function PopularPosts() {
  const [posts, tagline] = await Promise.all([
    getPostByPeriod('week'),
    getSiteTagline(),
  ]);

  if (!posts?.length) return <div>No fun posts!</div>;

  // Build main posts
  const mainPosts: PostItem[] = posts.slice(0, 7).map((p) => ({ ...p, type: 'post' }));

  // Pick ads
  const [adIndex1, adIndex2] = pickTwoUniqueAds(ADS);
  const ad1: AdItem = { type: 'ad', adIndex: adIndex1, id: `ad-${adIndex1}` };
  const ad2: AdItem = { type: 'ad', adIndex: adIndex2, id: `ad-${adIndex2}` };

  // Shuffle posts + ads
  let mixed: FeedItem[] = shuffleArray([...mainPosts, ad1, ad2]);

  // 🔑 Simple fix: ensure ads are not adjacent
  let safety = 0;
  while (safety < 20) {
    let hasAdjacentAds = false;
    for (let i = 0; i < mixed.length - 1; i++) {
      if (mixed[i].type === 'ad' && mixed[i + 1].type === 'ad') {
        hasAdjacentAds = true;
        break;
      }
    }
    if (!hasAdjacentAds) break;
    mixed = shuffleArray([...mainPosts, ad1, ad2]); // reshuffle
    safety++;
  }

  // Ticker items (pure posts)
  const tickerItems: TickerItem[] = posts.slice(0, 12).map((p) => ({
    id: String(p.id),
    slug: p.slug,
    title: p.title,
    date: p.date,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    author_name: (p as any).author_name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    featuredImage: (p as any).featuredImage,
  }));

  return <PopularNews items={mixed} tickerItems={tickerItems} tagline={tagline} />;
}
