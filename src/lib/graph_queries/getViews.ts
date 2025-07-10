// lib/getViews.ts
"use server"
const VIEWS_ENDPOINT = process.env.VIEWS_ENDPOINT!;

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
  featured_image: string;
  publish_date: string;
  author_name: string;
}>> {
  try {
    const res = await fetch(`${VIEWS_ENDPOINT}=${period}`);
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
    return raw.map((post) => ({
      id: Number(post.id),
      title: post.title.trim(),
      slug: post.slug,
      featured_image: post.featured_image,
      publish_date: post.publish_date,
      author_name: post.author_name,
    }));
  } catch (err) {
    console.error('[getViews] fetch failed:', err);
    return [];
  }
}
