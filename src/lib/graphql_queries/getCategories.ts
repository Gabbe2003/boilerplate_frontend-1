import "server-only"; 
import type { CategoryName, CategoryWithPosts } from "@/lib/types";
import { wpGraphQLCached, wpGraphQLRaw } from "../WpCachedResponse";



// Overloads keep existing callers happy
export async function get_all_categories_by_name(): Promise<CategoryName[]>;
export async function get_all_categories_by_name(
  with_excerpt: true
): Promise<CategoryWithPosts[] >;
export async function get_all_categories_by_name(
  with_excerpt?: boolean
): Promise<CategoryName[] | CategoryWithPosts[]  > {
  const QUERY = with_excerpt
    ? `
      query NewQuery {
        categories {
          edges {
            node {
              name
              count
              posts(first: 4, where: { status: PUBLISH }) {
                nodes {
                  databaseId
                  slug
                  title
                  excerpt
                  featuredImage { node { sourceUrl } }
                }
              }
            }
          }
        }
      }
    `
    : `
      query NewQuery {
        categories {
          edges {
            node {
              name
              count
            }
          }
        }
      }
    `;

  const data = await wpGraphQLCached<any>(QUERY);

  const cats = (data?.data?.categories?.edges ?? [])
    .map((e: any) => e?.node)
    .filter(
      (n: any): n is { name: string; count: number } =>
        !!n && typeof n.count === "number" && n.count > 0
    );

  if (!with_excerpt) {
    return cats.map((n: any) => ({ name: n.name, count: n.count }));
  }

  return cats.map((n: any) => {
    const posts: CategoryWithPosts[] =
      n?.posts?.nodes?.map((p: any) => ({
        id: String(p?.databaseId ?? ""),
        slug: p?.slug ?? "",
        title: p?.title ?? "",
        excerpt: p?.excerpt ?? undefined,
        featuredImageUrl: p?.featuredImage?.node?.sourceUrl ?? undefined,
      })) ?? [];

    return { name: n.name, count: n.count, posts };
  });
}



export async function getCategoryBySlug(
  slug: string,
  opts?: { take?: number; after?: string | [] }
): Promise<CategoryWithPosts | null> {
  const take = Math.max(1, opts?.take ?? 9); // 1 + 4 + 4
  const after = opts?.after ?? null; // we’ll pass null from the client for grow-by-count

  const QUERY = /* GraphQL */ `
    query CategoryBySlug($slug: ID!, $first: Int!, $after: String) {
      category(id: $slug, idType: SLUG) {
        id
        name
        slug
        description
        count
        parent { node { id name slug } }
        posts(
          first: $first
          after: $after
          where: {
            status: PUBLISH
            orderby: { field: DATE, order: DESC }
          }
        ) {
          pageInfo { hasNextPage endCursor }
          nodes {
            id
            databaseId
            slug
            title
            excerpt
            featuredImage { node { sourceUrl altText } }
            date
          }
        }
      }
    }
  `;

  // cached is fine because the cache key will vary with `first: take`
  const data = await wpGraphQLCached<any>(QUERY, { slug, first: take, after });
    
  const c = data?.data?.category;
  if (!c) return null;

  return {
    id: String(c.id),
    name: c.name,
    slug: c.slug,
    description: c.description ?? null,
    count: typeof c.count === "number" ? c.count : null,
    parent: c.parent ?? null,
    posts: {
      pageInfo: {
        hasNextPage: !!c.posts?.pageInfo?.hasNextPage,
        endCursor: c.posts?.pageInfo?.endCursor ?? null,
      },
      nodes: c.posts?.nodes ?? [],
    },
  };
}

