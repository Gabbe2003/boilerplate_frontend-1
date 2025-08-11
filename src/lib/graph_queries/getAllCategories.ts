// lib/graph_queries/getAllCategories.ts
'use server';

import { revalidateTag } from 'next/cache';

export type Category = { id: string; name: string; slug: string }; // export type

// Include databaseId (optional) if you want numeric ids
const CATEGORY_QUERY = `
  query AllCategories(
    $first: Int!
    $after: String
    $hideEmpty: Boolean!
    $orderby: TermObjectsConnectionOrderbyEnum!
    $order: OrderEnum!
  ) {
    categories(
      first: $first
      after: $after
      where: { hideEmpty: $hideEmpty, orderby: $orderby, order: $order }
    ) {
      nodes {
        id
        # databaseId
        name
        slug
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

// Legacy shape used by some WPGraphQL versions (fallback only)
const CATEGORY_QUERY_LEGACY = `
  query AllCategoriesLegacy(
    $first: Int!
    $after: String
    $hideEmpty: Boolean!
    $orderby: TermObjectsConnectionOrderbyEnum!
    $order: OrderEnum!
  ) {
    categories(
      first: $first
      after: $after
      where: { hideEmpty: $hideEmpty, orderby: { field: $orderby, order: $order } }
    ) {
      nodes { id name slug }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

export async function getAllCategories({
  pageSize = 100,           // use the common cap
  hideEmpty = true,
  orderby = 'NAME',
  order = 'ASC',
}: {
  pageSize?: number;
  hideEmpty?: boolean;
  orderby?: 'NAME' | 'COUNT' | 'TERM_ORDER' | 'SLUG';
  order?: 'ASC' | 'DESC';
} = {}): Promise<Category[]> {
  const size = Math.max(1, Math.min(pageSize, 100));
  let after: string | null = null;
  const all: Category[] = [];
  const seen = new Set<string>();

  async function page(query: string) {
    const res = await fetch(process.env.WP_GRAPHQL_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        query,
        variables: { first: size, after, hideEmpty, orderby, order },
      }),
      next: { revalidate: 86400, tags: ['categories'] },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res.json();
  }

  try {
    let useLegacy = false;

    do {
      let json = await page(useLegacy ? CATEGORY_QUERY_LEGACY : CATEGORY_QUERY);

      // If we hit the enum/object error, retry once with legacy shape
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!useLegacy && json?.errors?.some((e: any) =>
        String(e.message).includes('TermObjectsConnectionOrderbyEnum') &&
        String(e.message).includes('cannot represent non-enum value')
      )) {
        useLegacy = true;
        json = await page(CATEGORY_QUERY_LEGACY);
      }

      if (json.errors?.length) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const msg = json.errors.map((e: any) => e.message).join(' | ');
        throw new Error(`GraphQL error(s): ${msg}`);
      }

      const nodes = json?.data?.categories?.nodes ?? [];
      const pageInfo = json?.data?.categories?.pageInfo;

      for (const n of nodes) {
        if (n?.id && n?.name && n?.slug && !seen.has(n.id)) {
          seen.add(n.id);
          all.push({ id: n.id, name: n.name, slug: n.slug });
        }
      }
      after = pageInfo?.hasNextPage ? pageInfo?.endCursor ?? null : null;
    } while (after);

    // Optional: ensure stable ordering
    all.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    return all;
  } catch (err) {
    console.error('Error fetching categories:', err);
    throw new Error('Failed to fetch categories');
  }
}

export async function revalidateCategoriesTag() {
  revalidateTag('categories');
}
