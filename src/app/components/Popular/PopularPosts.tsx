import { getViews } from "@/lib/graph_queries/getPostByPeriod";
import PopularNews from "./PopularPostsGrid";
import { Ad, ADS } from "../ads/adsContent";
import { Post } from '@/lib/types';

// --- Feed item discriminated union types ---
type AdItem = {
  type: 'ad';
  adIndex: number;
  id: string | number;
};
type PostItem = Post & { type: 'post' };
type FeedItem = AdItem | PostItem;

// --- Helper utilities ---
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
  const posts = await getViews('week');

  if (!posts.length) return <div>No fun posts!</div>;

  const mainPosts: PostItem[] = posts.slice(0, 7).map((p) => ({ ...p, type: 'post' }));
  const [adIndex1, adIndex2] = pickTwoUniqueAds(ADS);
  const ad1: AdItem = { type: 'ad', adIndex: adIndex1, id: `ad-${adIndex1}` };
  const ad2: AdItem = { type: 'ad', adIndex: adIndex2, id: `ad-${adIndex2}` };
  const mixed: FeedItem[] = shuffleArray([...mainPosts, ad1, ad2]);

  return <PopularNews items={mixed} />;
}
