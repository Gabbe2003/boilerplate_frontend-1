import { getCategoryPosts } from "@/lib/graph_queries/getCategory";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const after = searchParams.get("after") || undefined;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const posts = await getCategoryPosts(slug, after);
    return NextResponse.json({
      posts: posts.nodes,
      pageInfo: posts.pageInfo,
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err:any) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}
