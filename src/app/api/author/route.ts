import { handleSpecielChar } from "@/lib/globals/actions";
import { getAuthorBySlug } from "@/lib/graphql_queries/getAuthor";
import { NextRequest, NextResponse } from "next/server";

 
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("slug") ?? "";
    const amount = Number(searchParams.get("take")) ?? 19;
    if (!raw) {
      return NextResponse.json(
        { error: "Missing author." },
        { status: 400 }
      );
    }

    const slug = handleSpecielChar(raw);
    const authorBySlug = await getAuthorBySlug(slug, {take: amount});

    if (!authorBySlug) {
      return NextResponse.json(
        { error: `Author not found for author '${slug}'.` },
        { status: 404 }
      );
    }

    return NextResponse.json(authorBySlug);
  } catch (err) {
    console.error("GET /api/author error:", err);
    return NextResponse.json(
      { error: "Failed to fetch author." },
      { status: 500 }
    );
  }
}
