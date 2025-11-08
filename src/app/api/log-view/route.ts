// app/api/log-view/route.ts
import { updateViewedPost } from "@/lib/graphql_queries/updated_view";
import { NextResponse } from "next/server";

export const revalidate = 0;
export const dynamic = "force-dynamic"; 

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    const isJSON = ct.includes("application/json");
    const body = isJSON ? await req.json() : Object.fromEntries(new URL(req.url).searchParams);
    const id = body?.databaseId;
    
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    await updateViewedPost(id);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    console.error("[log-view] error:", e);
    return NextResponse.json({ error: "Failed to log view" }, { status: 500 });
  }
}
