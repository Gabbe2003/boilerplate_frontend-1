// lib/getViews.ts
"use server"
const VIEW_POPULAR_PERIOD_POST = process.env.VIEW_POPULAR_PERIOD_POST!;
// import { loggedFetch } from '../logged-fetch';

interface FeaturedImageObject {
  node?: {
    sourceUrl?: string;
  };
}

interface RawView {
  id: string | number;
  title: string;
  slug: string;
  featuredImage: string | FeaturedImageObject | null | undefined;
  date: string;
  author_name: string;
  excerpt?: string;
}

export async function getViews(
  period: "week" | "month"
): Promise<
   Array<{
  id: string;
  title: string;
  slug: string;
  featuredImage?: { node: { sourceUrl: string } };
  date: string;
  author_name: string;
  excerpt?: string;
}>
> {
  try {
    
    const res = await fetch(`${VIEW_POPULAR_PERIOD_POST}=${period}`, { cache: 'force-cache', next: { revalidate: 10 }});
    // const res = await loggedFetch(`${VIEW_POPULAR_PERIOD_POST}=${period}`, {context: 'getViews'});

    if (!res.ok) {
      console.error('[getViews] non-OK response:', await res.text());
      return [];
    }
    
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error('[getViews] payload is not an array:', data);
      return [];
    }
    const raw = data as RawView[];

    // Single-pass mapping and normalization
return raw.map((item) => {
  let normalizedImage: string | undefined;
  if (typeof item.featuredImage === "string" && item.featuredImage) {
    normalizedImage = item.featuredImage;
  } else if (item.featuredImage && typeof item.featuredImage === "object" && typeof item.featuredImage.node?.sourceUrl === "string") {
    normalizedImage = item.featuredImage.node.sourceUrl;
  } else {
    normalizedImage = undefined;
  }
  
  return {
    id: String(item.id),
    title: item.title?.trim() ?? "",
    slug: item.slug,
    featuredImage: normalizedImage ? { node: { sourceUrl: normalizedImage } } : undefined,
    date: item.date,
    author_name: item.author_name,
    excerpt: item.excerpt ?? "",
    type: 'post',
  };
});



   
  } catch (err) {
    console.error('[getViews] fetch failed:', err);
    return [];
  }
}
