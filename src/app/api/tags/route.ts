import { NextResponse } from 'next/server';
import { getAllTags } from '@/lib/graph_queries/getAllTags';

export async function GET() {
  try {
    const tags = await getAllTags();
    return NextResponse.json({ tags });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error:any) {
    console.log(error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}
