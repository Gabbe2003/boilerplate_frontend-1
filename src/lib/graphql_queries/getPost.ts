import "server-only"

import { AllPostSlugsResponse, AllPostsMinimalResponse, GetAllPostsOpts, GetPostSlugsOpts, GQLResp, Post, PostBySlugResult, PostsQueryData, PostTitleSlug, TodayPost, WpGraphQLResponse } from "../types";
import { pickBucket, wpGraphQLCached, wpGraphQLRaw, wpRestCached } from "../WpCachedResponse";
import { decodeHTML, extractHeadings } from "../globals/actions";


export async function getPostsByPeriod(period: 'week' | 'month') {
  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/wp-json/hpv/v1/top-posts?period=${period}`;
  return wpRestCached(url, { revalidate: 3600, tags: ['views'] });
}

export async function getTodaysPosts(limit: number = 5): Promise<TodayPost[]> {
  if (process.env.NEXT_PUBLIC_HOSTNAME?.includes("boilerplate.local")) {
    return [];
  }

  const url = `${process.env.NEXT_PUBLIC_HOST_URL}/wp-json/hpv/v1/today-posts`;

  try {
    const data = await wpRestCached<TodayPost[]>(
      url,
      { revalidate: 3600, tags: ["today-posts"]}
    );

    // Defensive: verify data is array
    if (!Array.isArray(data)) return [];

    // Decode title + excerpt safely
    return data.slice(0, limit).map((post) => ({
      ...post,
      title: decodeHTML(
        typeof post.title === "string"
          ? post.title
          : post.title?.rendered ?? ""
      ),
      excerpt: decodeHTML(
        typeof post.excerpt === "string"
          ? post.excerpt
          : post.excerpt?.rendered ?? ""
      ),
    }));
  } catch (err) {
    console.error("[getTodaysPosts] Failed to fetch posts:", err);
    return [];
  }
}

export async function getAllPosts(): Promise<Post[]>;
export async function getAllPosts(first: number, opts?: GetAllPostsOpts): Promise<Post[]>;
export async function getAllPosts(
  start: number,
  end: number,
  opts?: GetAllPostsOpts
): Promise<Post[]>;

export async function getAllPosts(
  a?: number,
  b?: number | GetAllPostsOpts,
  c?: GetAllPostsOpts
): Promise<Post[]> {
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

  const isNumberB = typeof b === "number";
  const opts: GetAllPostsOpts = (isNumberB ? c : (b as GetAllPostsOpts)) ?? {};

  let start = 0;
  let end = 10;

  if (typeof a === "number" && isNumberB) {
    start = Math.floor(a);
    end = Math.floor(b as number);
  } else if (typeof a === "number") {
    end = Math.floor(a);
  }

  // ---- Validation ----
  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
    console.error("[getAllPosts] Invalid range:", { start, end });
    return [];
  }

  const needFirst = end;
  const buckets = (opts.buckets ?? [2, 10, 100]).slice().sort((a, b) => a - b);
  const maxBucket = buckets[buckets.length - 1];
  const canonicalFirst = pickBucket(needFirst, buckets);
  const canUseCache = !opts.disableCache && needFirst <= maxBucket;

  const variables = { first: canonicalFirst };

  const data = canUseCache
    ? await wpGraphQLCached<AllPostsMinimalResponse>(QUERY, variables, {
        revalidate: opts.revalidate ?? 300,
        tags: ["posts"],
      })
    : await wpGraphQLRaw<AllPostsMinimalResponse>(QUERY, { first: needFirst });

  const nodes = data?.data?.posts?.nodes ?? [];

  // ---- Normalize and Decode ----
  return nodes.slice(start, end).map((post : Post) => ({
    ...post,
    title: decodeHTML(typeof post.title === "string" ? post.title : ""),
    excerpt: decodeHTML(typeof post.excerpt === "string" ? post.excerpt : ""),
  }));
}
 
export async function getPostBySlug(slug: string): Promise<PostBySlugResult | null> {
  const query = `
    query GetPostBySlug($slug: String!) {
      postBy(slug: $slug) {
        databaseId
        title(format: RENDERED)
        content(format: RENDERED)
        excerpt(format: RENDERED)
        slug
        date
        modified
        uri
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails { width height }
          }
        }
        author { node { name avatar { url } } }
        categories { nodes { name } }
        tags { nodes { name } }
        seo {
          breadcrumbs { text url }
          title
        }
      }
    }
  `;

  try {
    const variables = { slug };
    const res = await wpGraphQLCached<{ data: { postBy: Post } }>(
      query,
      variables,
      {
        revalidate: 31 * 24 * 60 * 60,
        tags: [`post-${slug}`],
      }
    );

    const post = res?.data?.postBy;
    if (!post) return null;

    // --- Normalize title/excerpt/content ---
    const normalizedPost: Post = {
      ...post,
      title: decodeHTML(typeof post.title === "string" ? post.title : ""),
      excerpt: decodeHTML(typeof post.excerpt === "string" ? post.excerpt : ""),
      content: decodeHTML(typeof post.content === "string" ? post.content : ""),
    };

    const { updatedHtml, toc } = extractHeadings(normalizedPost.content ?? "");
    
    return {
      post: normalizedPost,
      updatedHtml,
      toc,
    };
  } catch (error) {
    console.error(`[getPostBySlug] Failed for slug "${slug}":`, error);
    return null;
  }
}


// ---- Overloads ----
export async function getPostSlugs(): Promise<string[]>;
export async function getPostSlugs(end: number, opts?: GetPostSlugsOpts): Promise<string[]>;
export async function getPostSlugs(
  start: number,
  end: number,
  opts?: GetPostSlugsOpts
): Promise<string[]>;

// ---- Impl ----
export async function getPostSlugs(
  a?: number,
  b?: number | GetPostSlugsOpts,
  c?: GetPostSlugsOpts
): Promise<string[]> {
  const isNumberB = typeof b === "number";
  const opts: GetPostSlugsOpts = (isNumberB ? c : (b as GetPostSlugsOpts)) ?? {};

  let start = 0;
  let end = 10;

  if (typeof a === "number" && isNumberB) {
    start = Math.floor(a);
    end = Math.floor(b as number);
  } else if (typeof a === "number") {
    start = 0;
    end = Math.floor(a);
  }

  // validation / fast exits
  if (!Number.isFinite(start) || !Number.isFinite(end)) return [];
  if (start < 0 || end < 0) return [];
  if (end <= start) return [];

  const needFirst = end;
  
  const ALL_POST_SLUGS = /* GraphQL */ `
    query AllPostSlugs($first: Int!) {
      posts(first: $first) {
        nodes {
          slug
        }
      }
    }
  `;

  const run = opts.disableCache
    ? () => wpGraphQLRaw<AllPostSlugsResponse>(ALL_POST_SLUGS, { first: needFirst })
    : () =>
        wpGraphQLCached<AllPostSlugsResponse>(
          ALL_POST_SLUGS,
          { first: needFirst },
          { revalidate: opts.revalidate ?? 300, tags: ["posts:slugs", ...(opts.tags ?? [])] }
        );

  const data = await run();
  const nodes = data?.data?.posts?.nodes ?? [];

  return nodes
    .slice(start, end)
    .map((n) => n?.slug ?? null)
    .filter((s): s is string => !!s && typeof s === "string");
}



function pickRandom<T>(arr: T[], n: number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}
export async function getRecommendation(opts?: {
  excludeSlug?: string;
  count?: number;
  poolSize?: number;
  revalidate?: number;
}): Promise<Post[]> {
  const count = Math.max(0, Math.min(opts?.count ?? 6, 12));
  const poolSize = Math.max(count, opts?.poolSize ?? 100);

  const RECOMMEND_QUERY = `
    query RecPosts($first: Int!) {
      posts(first: $first, where: { status: PUBLISH }) {
        nodes {
          id
          slug
          title
          featuredImage {
            node { sourceUrl altText }
          }
        }
      }
    }
  `;

  try {
    const data = await wpGraphQLCached<GQLResp>(
      RECOMMEND_QUERY,
      { first: poolSize },
      { revalidate: opts?.revalidate ?? 300, tags: ["posts", "recommendations"] }
    );

    const nodes = (data?.data?.posts?.nodes ?? []).filter(Boolean) as Post[];
    const filtered = opts?.excludeSlug?.length
      ? nodes.filter(p => p.slug && !opts!.excludeSlug!.includes(p.slug))
      : nodes;

    return pickRandom(filtered, count);
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return [];
  }
}
// add near your types
export type PostCard = {
  title: string;
  slug: string;
  date?: string;
  excerpt?: string;
  authorName?: string;
  featuredImage?: { url: string; alt?: string; width?: number; height?: number };
  author?: {
    node:{
      name?: string; 
      
    }
  }
};

// overloads
export function getAllPostsByTitle(): Promise<PostTitleSlug[]>;
export function getAllPostsByTitle(opts: { render_post: true }): Promise<PostCard[]>;

// implementation
export async function getAllPostsByTitle(
  opts?: { render_post?: boolean }
): Promise<PostTitleSlug[] | PostCard[]> {
  const render = !!opts?.render_post;

  const query = render
    ? `
      query PostsByTitleFull {
        posts(first: 100) {
          nodes {
            title
            slug
            date
            excerpt
             author { node { name avatar { url } } }
            featuredImage {
              node {
                sourceUrl
                altText
                mediaDetails { width height }
              }
            }
          }
        }
      }
    `
    : `
      query PostsByTitleLite {
        posts(first: 100) {
          nodes { title slug }
        }
      }
    `;

  try {
    const json = (await wpGraphQLRaw(query)) as WpGraphQLResponse<PostsQueryData> | null;
    const nodes = json?.data?.posts?.nodes ?? [];

    if (!render) {
      // lite
      return nodes
        .filter((n): n is { title: string; slug: string } => !!n?.title && !!n?.slug)
        .map((n) => ({ title: n.title, slug: n.slug }))
        .slice(0, 100);
    }

    // full (for rendering cards)
    return nodes
      .filter((n): n is any => !!n?.title && !!n?.slug)
      .map((n) => ({
        title: n.title,
        slug: n.slug,
        date: n.date ?? undefined,
        excerpt: n.excerpt ?? undefined,
        author: n.author,
        authorName: n?.author?.node?.name ?? undefined,
        featuredImage: n?.featuredImage?.node?.sourceUrl
          ? {
              url: n.featuredImage.node.sourceUrl,
              alt: n.featuredImage.node.altText ?? undefined,
              width: n.featuredImage.node.mediaDetails?.width ?? undefined,
              height: n.featuredImage.node.mediaDetails?.height ?? undefined,
            }
          : undefined,
      }))
      .slice(0, 100);
  } catch (err) {
    console.error("getAllPostsByTitle failed:", err);
    return [];
  }
}
