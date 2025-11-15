import { getAllPosts } from "@/lib/graphql_queries/getPost";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const start = Number(searchParams.get("start")) || 0;
    const end = Number(searchParams.get("end")) || 8;

    const posts = await getAllPosts(start, end);

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
