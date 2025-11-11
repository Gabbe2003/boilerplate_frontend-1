import { getAllPosts } from "@/lib/graphql_queries/getPost";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const amount = Number(searchParams.get("amount")) || 10;

    const posts = await getAllPosts(amount); 

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch posts" }, { status: 500 });
  }
}
