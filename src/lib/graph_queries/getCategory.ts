import "server-only"; 

import { signedFetch } from "../security/signedFetch";

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
  pageSize = 15,      
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
    const res = await signedFetch(process.env.WP_GRAPHQL_URL!, {
      method: 'POST',
      json: { query, variables: { first: size, after, hideEmpty, orderby, order } },
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
    console.error('Error fetching categories:', err.message);
    throw new Error('Failed to fetch categories');
  }
}

export async function getCategoryBySlug(slug: string, after?: string) {
  const query = `
    query CategoryBySlug($slug: ID!, $after: String) {
      category(id: $slug, idType: SLUG) {
        id
        name
        slug
        description
        count
        parent {
          node {
            id
            name
            slug
          }
        }
        posts(first: 6, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            slug
            excerpt
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                id
                name
                slug
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await signedFetch(process.env.WP_GRAPHQL_URL!, {
      method: 'POST',
      json: { query, variables: { slug, after } },
      next: { revalidate: 15 * 60 },
    });

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const json = await res.json();

    // Check for errors in GraphQL response
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL error');
    }

    if (!json.data || typeof json.data.category === 'undefined') {
      return null;
    }

    return json.data.category;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error('Failed to fetch category');
  }
}

export async function getCategoryPosts(slug: string, after?: string) {
  const query = `
    query CategoryPosts($slug: ID!, $after: String) {
      category(id: $slug, idType: SLUG) {
        posts(first: 6, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            slug
            excerpt
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                id
                name
                slug
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await signedFetch(process.env.WP_GRAPHQL_URL!, {
      method: 'POST',
      json: { query, variables: { slug, after } },
      next: { revalidate: 15 * 60 },
    });

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const json = await res.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL error');
    }

    const posts = json.data?.category?.posts;
    if (!posts) return { nodes: [], pageInfo: { hasNextPage: false, endCursor: '' } };
    return posts;
  } catch (error) {
    console.error('Error fetching category posts:', error);
    throw new Error('Failed to fetch category posts');
  }
}




