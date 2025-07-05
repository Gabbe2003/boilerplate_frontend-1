// lib/getViews.ts
"use server"
import { PostItem } from "../types"    // <-- make sure this matches your PostItem definition
const VIEWS_ENDPOINT = process.env.VIEWS_ENDPOINT!;

export async function getViews(
  period: "week" | "month"
): Promise<PostItem[]> {
  try {
    const res = await fetch(`${VIEWS_ENDPOINT}=${period}`);
    if (!res.ok) {
      console.error("[getViews] non-OK response:", await res.text());
      return [];
    }
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error("[getViews] payload is not an array:", data);
      return [];
    }
    return data.map((post: any) => ({
      id:             Number(post.id),
      title:          String(post.title).trim(),
      slug:           String(post.slug),
      featured_image: String(post.featured_image),
      publish_date:   String(post.publish_date),
      author_name:    String(post.author_name),
    }));
  } catch (err) {
    console.error("[getViews] fetch failed:", err);
    return [];
  }
}