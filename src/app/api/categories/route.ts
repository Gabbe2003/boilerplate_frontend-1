import { handleSpecielChar } from "@/lib/globals/actions";
import { getCategoryBySlug } from "@/lib/graphql_queries/getCategories";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const rawCategory = searchParams.get("category") ?? "";
    if (!rawCategory) {
      return NextResponse.json(
        { error: "Missing 'category' query parameter." },
        { status: 400 }
      );
    }

    const startParam = searchParams.get("start");
    const endParam = searchParams.get("end");
    const takeParam = searchParams.get("take");

    // Convert numeric params
    const start = startParam !== null ? Number(startParam) : undefined;
    const end = endParam !== null ? Number(endParam) : undefined;
    const take = takeParam !== null ? Number(takeParam) : undefined;

    const slug = handleSpecielChar(rawCategory);

    let options: any = {};

    //
    // --- RANGE LOGIC ---
    //
    if (end !== undefined) {
      // start defaults to 0 if missing
      options.start = start ?? 0;
      options.end = end;
    } else {
      // fallback to take logic
      if (take) {
        options.take = take;
      }
    }

    
    
    const categoryBySlug = await getCategoryBySlug(slug, options);
    
    if (!categoryBySlug) {
      return NextResponse.json(
        { error: `Category not found for slug '${slug}'.` },
        { status: 404 }
      );
    }

    return NextResponse.json(categoryBySlug);
  } catch (err) {
    console.error("GET /api/categories error:", err);
    return NextResponse.json(
      { error: "Failed to fetch category." },
      { status: 500 }
    );
  }
}
