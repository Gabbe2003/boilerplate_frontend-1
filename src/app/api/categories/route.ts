import { NextRequest, NextResponse } from 'next/server';
import { getAllCategories, getCategoryBySlug } from '@/lib/graph_queries/getCategory';

// ✅ Helper to set both CDN + browser caching
function setCache(
  res: NextResponse,
  {
    ttl,
    swr = 60,
    browserMaxAge = 0,
  }: { ttl: number; swr?: number; browserMaxAge?: number }
) {
  if (ttl <= 0) {
    res.headers.set('Cache-Control', 'no-store');
    res.headers.set('CDN-Cache-Control', 'no-store');
    return res;
  }

  const cdn = `public, s-maxage=${ttl}, stale-while-revalidate=${swr}`;
  const browser = `public, max-age=${browserMaxAge}`;

  res.headers.set('Cache-Control', `${browser}, ${cdn}`);
  res.headers.set('CDN-Cache-Control', cdn);

  return res;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug')?.trim() || null;
  const after = searchParams.get('after') || undefined;

  try {
    // ✅ Case 1: Fetch posts for a specific category
    if (slug) {
      const category = await getCategoryBySlug(slug, after);

      if (!category) {
        // Return 404 without caching
        return NextResponse.json(
          { error: 'Category not found' },
          {
            status: 404,
            headers: {
              'Cache-Control': 'no-store',
              'CDN-Cache-Control': 'no-store',
            },
          }
        );
      }

      const posts = category.posts?.nodes ?? [];
      const pageInfo = category.posts?.pageInfo ?? {
        hasNextPage: false,
        endCursor: null,
      };

      const res = NextResponse.json({ posts, pageInfo }, { status: 200 });

      // ✅ Do NOT cache paginated pages
      if (after) {
        res.headers.set('Cache-Control', 'no-store');
        res.headers.set('CDN-Cache-Control', 'no-store');
      } else {
        // ✅ Cache first page for 5 minutes at CDN, 0 min browser
        setCache(res, {
          ttl: 300,          // 5 min at CDN
          swr: 60,           // Serve stale cache for 1 min while revalidating
          browserMaxAge: 0,  // Always fetch fresh in browser, rely on CDN cache
        });
      }
      return res;
    }

    // ✅ Case 2: Fetch all categories (list)
    const categories = await getAllCategories();
    const res = NextResponse.json(categories, { status: 200 });

    // ✅ Cache category list for 1 day on CDN, 5 min in browser
    setCache(res, {
      ttl: 86400,          // 1 day CDN cache
      swr: 3600,           // Serve stale cache for 1 hour while revalidating
      browserMaxAge: 300,  // 5 min browser cache
    });

    return res;
  } catch (err) {
    console.error('GET /api/categories error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
          'CDN-Cache-Control': 'no-store',
        },
      }
    );
  }
}
