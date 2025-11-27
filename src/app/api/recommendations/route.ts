// app/api/recommendations/route.ts
import { NextResponse } from "next/server";
import { getRecommendation } from "@/lib/graphql_queries/getPost";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const count = Math.max(1, Number(searchParams.get("count") ?? 8));
    const excludeSlug = searchParams.get("slug") ?? ""

    const posts = await getRecommendation({ count, excludeSlug });

    return NextResponse.json({ success: true, posts });
  } catch (err) {
    console.error("[/api/recommendations] error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to load recommendations" },
      { status: 500 }
    );
  }
}
