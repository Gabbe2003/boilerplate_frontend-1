import { getPostsPage, POSTS_PER_PAGE } from "@/app/(pages)/archive/actions/wpClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const after = searchParams.get("after");
  const firstParam = searchParams.get("first");
  const first = firstParam ? parseInt(firstParam, 10) : POSTS_PER_PAGE;
  
  try {
    const page = await getPostsPage(first, after);
    return NextResponse.json(page);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
