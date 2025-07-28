// lib/getViews.ts
"use server"
const VIEW_POPULAR_PERIOD_POST = process.env.VIEW_POPULAR_PERIOD_POST!;
import FEATURED_IMAGE from '../../../public/next.svg';
import { normalizeFlatImages } from '../helper_functions/featured_image';
import { loggedFetch } from '../logged-fetch';

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
}

export async function getViews(
  period: "week" | "month"
): Promise<
  Array<{
    id: number;
    title: string;
    slug: string;
    featuredImage: string;
    date: string;
    author_name: string;
  }>
> {
  try {
    // const res = await fetch(`${VIEW_POPULAR_PERIOD_POST}=${period}`, { cache: 'force-cache', next: { revalidate: 3600 } });
    const res = await loggedFetch(`${VIEW_POPULAR_PERIOD_POST}=${period}`, {context: 'getViews'});

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

    // Normalize all images FIRST
    const normalized = normalizeFlatImages(raw);

    // Map as you need (if you want to trim title, ensure ids are numbers, etc)
    return normalized.map((post) => ({
      id: Number(post.id),
      title: post.title?.trim() ?? '',
      slug: post.slug,
      featuredImage: typeof post.featuredImage === "string"
        ? post.featuredImage
        : typeof post.featuredImage?.node?.sourceUrl === "string"
          ? post.featuredImage.node.sourceUrl
          : FEATURED_IMAGE,
            date: post.date,
      author_name: post.author_name,
    }));


  } catch (err) {
    console.error('[getViews] fetch failed:', err);
    return [];
  }
}
