// src/app/api/getPostBySlug/route.ts
import { getPostBySlug } from "@/lib/graphql_queries/getPost";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Missing `slug` query param" },
        { status: 400 }
      );
    }

    const result = await getPostBySlug(slug);
    if (!result) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const { post, updatedHtml, toc } = result;
    return NextResponse.json({ success: true, post, updatedHtml, toc }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
