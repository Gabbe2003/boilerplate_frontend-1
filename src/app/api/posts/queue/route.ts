import { NextResponse } from "next/server";
import { getPosts } from "@/lib/graph_queries/getRecommendationPost";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const exclude = searchParams.getAll("exclude");

  const posts = await getPosts();
  const slugs = Array.from(new Set(posts.map((p) => p.slug))).filter(
    (s) => !exclude.includes(s)
  );

  return NextResponse.json({ slugs });
}
