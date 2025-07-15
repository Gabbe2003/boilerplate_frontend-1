// lib/getViews.ts
"use server"
const VIEW_POPULAR_PERIOD_POST = process.env.VIEW_POPULAR_PERIOD_POST!;
import FEATURED_IMAGE from '../../../public/next.svg';

interface RawView {
  id: string | number;
  title: string;
  slug: string;
  featured_image: string;
  publish_date: string;
  author_name: string;
}
export async function getViews(  period: "week" | "month" ): Promise<Array<{
    id: number;
    title: string;
    slug: string;
    featuredImage: string;
    date: string;
    author_name: string;
  }>> {
  try {
      console.log(`${VIEW_POPULAR_PERIOD_POST}=${period}`);
      const res = await fetch(`${VIEW_POPULAR_PERIOD_POST}=${period}`);
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
    
    function getFeaturedImageUrl(featured_image: unknown): string {
      if (typeof featured_image === 'string' && featured_image) {
        return featured_image;
      }
      if (
        featured_image &&
        typeof featured_image === 'object' &&
        'node' in featured_image &&
        typeof (featured_image as any).node?.sourceUrl === 'string' &&
        (featured_image as any).node.sourceUrl
      ) {
        return (featured_image as any).node.sourceUrl;
      }
      // If no valid image found, return fallback
      return FEATURED_IMAGE;
    }

  return raw.map((post) => ({
    id: Number(post.id),
    title: post.title.trim(),
    slug: post.slug,
    featuredImage: getFeaturedImageUrl(post.featured_image),
    date: post.publish_date,
    author_name: post.author_name,
  }));

  } catch (err) {
    console.error('[getViews] fetch failed:', err);
    return [];
  }
}
