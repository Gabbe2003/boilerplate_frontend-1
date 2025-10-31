import { handleSpecielChar } from "@/lib/globals/actions";
import { getCategoryBySlug } from "@/lib/graphql_queries/getCategories";
import { NextRequest, NextResponse } from "next/server";

 
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const raw = searchParams.get("category") ?? "";
    if (!raw) {
      return NextResponse.json(
        { error: "Missing 'category' query parameter." },
        { status: 400 }
      );
    }

    const slug = handleSpecielChar(raw);
    const categoryBySlug = await getCategoryBySlug(slug);

    if (!categoryBySlug) {
      return NextResponse.json(
        { error: `Category not found for slug '${slug}'.` },
        { status: 404 }
      );
    }

    return NextResponse.json({ categoryBySlug });
  } catch (err) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json(
      { error: "Failed to fetch category." },
      { status: 500 }
    );
  }
}
