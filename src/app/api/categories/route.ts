// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getCategoryBySlug } from '@/lib/graph_queries/getCategoryBySlug';
import { getAllCategories } from '@/lib/graph_queries/getAllCategories';

// optional: faster cold starts / lower latency
export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const after = searchParams.get('after') || undefined;

  try {
    // If slug is present, return posts for that category
    if (slug) {
      const category = await getCategoryBySlug(slug, after);

      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      const posts = category.posts?.nodes ?? [];
      const pageInfo = category.posts?.pageInfo ?? {
        hasNextPage: false,
        endCursor: null,
      };

      return NextResponse.json({ posts, pageInfo }, { status: 200 });
    }

    // Otherwise, return the list of categories for the header (cached by getAllCategories)
    const categories = await getAllCategories();
    return NextResponse.json(categories, { status: 200 });
  } catch (err) {
    console.error('GET /api/categories error:', err);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
