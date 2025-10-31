import "server-only"

import { AllPostsMinimalResponse, Post, TodayPost } from "../types";
import { pickBucket, wpGraphQLCached, wpGraphQLRaw, wpRestCached } from "../WpCachedResponse";


export async function getPostsByPeriod(period: 'week' | 'month') {
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/wp-json/hpv/v1/top-posts?period=${period}`;
  return wpRestCached(url, { revalidate: 3600, tags: ['views'] });
}


export async function getTodaysPosts(limit: number = 5) {
  if(process.env.NEXT_PUBLIC_HOSTNAME!.includes('boilerplate.local')){
    return []
  }
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/wp-json/hpv/v1/today-posts`;
  const data = await wpRestCached<TodayPost[]>(url, { revalidate: 3600, tags: ['today-posts'] });
  return Array.isArray(data) ? data.slice(0, limit) : [];
}


type GetAllPostsOpts = {
  disableCache?: boolean;   // force uncached fetch
  buckets?: number[];       // default: [2, 10, 100]
  revalidate?: number;      // ISR seconds; default 300
};

// ---- Query (hoisted so the cache key stays stable) ----
const QUERY = `
  query AllPostsMinimal($first: Int) {
    posts(first: $first) {
      nodes {
        id
        slug
        title(format: RENDERED)
        excerpt(format: RENDERED)
        date
        featuredImage {
          node {
            id
            altText
            sourceUrl
            mediaDetails {
              width
              height
              sizes { name sourceUrl width height }
            }
          }
        }
        category: categories {
          nodes { id name slug }
        }
      }
    }
  }
`;

// ---- Overloads ----
export async function getAllPosts(): Promise<Post[]>;
export async function getAllPosts(first: number, opts?: GetAllPostsOpts): Promise<Post[]>;
export async function getAllPosts(
  start: number,
  end: number,
  opts?: GetAllPostsOpts
): Promise<Post[]>;

// ---- Impl ----
export async function getAllPosts(
  a?: number,
  b?: number | GetAllPostsOpts,
  c?: GetAllPostsOpts
): Promise<Post[]> {
  // Parse params: support (), (first, opts), (start, end), (start, end, opts)
  const isNumberB = typeof b === 'number';
  const opts: GetAllPostsOpts = (isNumberB ? c : (b as GetAllPostsOpts)) ?? {};

  // Default range is 0..10
  let start = 0;
  let end = 10;

  if (typeof a === 'number' && isNumberB) {
    start = Math.floor(a);
    end   = Math.floor(b as number);
  } else if (typeof a === 'number') {
    start = 0;
    end   = Math.floor(a);
  }

  // ---- Validation ----
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    console.error('start/end must be finite numbers');
  }
  if (start < 0 || end < 0) {
    console.error('start/end must be >= 0');
  }
  if (end < start) {
    console.error(`"start" (${start}) cannot be greater than "end" (${end}).`);
  }
  if (end === start) return [];

  // We need at least `end` posts to slice [start, end)
  const needFirst = end;

  const buckets = (opts.buckets ?? [2, 10, 100]).slice().sort((a, b) => a - b);
  const maxBucket = buckets[buckets.length - 1];
  const canonicalFirst = pickBucket(needFirst, buckets);

  const canUseCache = !opts.disableCache && needFirst <= maxBucket;

  const variablesForCachedFetch = { first: canonicalFirst };

  const data = canUseCache
    ? await wpGraphQLCached<AllPostsMinimalResponse>(
        QUERY,
        variablesForCachedFetch,
        {
          revalidate: opts.revalidate ?? 300,
          tags: ['posts'], // one tag to invalidate all list caches at once
        }
      )
    : // Above max bucket (or cache disabled): do a one-off uncached fetch.
      await wpGraphQLRaw<AllPostsMinimalResponse>(QUERY, { first: needFirst });

  const nodes = data?.data.posts?.nodes ?? [];

  // Return exactly the requested window [start, end)
  return nodes.slice(start, end);
}
