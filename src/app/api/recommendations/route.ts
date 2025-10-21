import { getRecommendation } from "@/lib/graph_queries/getPost";
import { NextResponse } from "next/server";
import type { Post } from "@/lib/types";

export const revalidate = 1800; 

export async function GET(): Promise<NextResponse<Post[] | { error: string }>> {
  try {
    const posts = await getRecommendation();

    return NextResponse.json<Post[]>(Array.isArray(posts) ? posts : [], {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=60",
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export function POST() {
  return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
}
