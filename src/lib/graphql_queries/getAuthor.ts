import "server-only"
import { wpGraphQLRaw } from "../WpCachedResponse";
import { AllAuthorsData, Author, GqlResponse, Post, SeoBasic } from "../types";

export async function getAllAuthors(): Promise<Author[]> {
  const query = `
    query AllAuthors {
      users {
        nodes {
          id
          name
          slug
          description
          avatar { url }
          posts(first: 4) {
            nodes {
              title
              slug
              excerpt
              featuredImage { node { altText sourceUrl } }
              seo {
                breadcrumbs { text url }
                title
              }
            }
          }
        }
      }
    }
  `;
 
  try {
  const json = await wpGraphQLRaw<GqlResponse<AllAuthorsData>>(query);
    const nodes = json?.data?.users?.nodes ?? [];

    const authors: Author[] = nodes.map((a: any) => {
      const posts: { nodes: Post[] } = {
        nodes: (a?.posts?.nodes ?? []) as Post[],
      };

      return {
        id: a.id,
        name: a.name,
        slug: a.slug,
        description: a?.description ?? null,
        avatar: a?.avatar ?? null,
        posts
      };
    });

    return authors;
  } catch (err: any) {
    console.error(err?.message ?? err);
    return [];
  }
}





export async function getAuthorBySlug(
  slug: string,
  opts?: { take?: number; after?: string | null }
): Promise<Author | null> {
  const take = Math.max(1, opts?.take ?? 9);
  const after = opts?.after ?? null;

  const QUERY = /* GraphQL */ `
    query AuthorBySlug($slug: ID!, $first: Int!, $after: String) {
      user(id: $slug, idType: SLUG) {
        id
        name
        slug
        description
        avatar { url }
        posts(
          first: $first
          after: $after
          where: { status: PUBLISH, orderby: { field: DATE, order: DESC } }
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

  const json = await wpGraphQLRaw<GqlResponse<{ user?: Author | null }>>(QUERY, {
    slug,
    first: take,
    after,
  });
  
  const u = json?.data?.user;
  if (!u) return null;

  const nodes = (u.posts?.nodes ?? []) as Post[];

  const author: Author = {
    id: u.id,
    name: u.name,
    slug: u.slug,
    description: u.description ?? null,
    avatar: u.avatar ?? null,
    posts: {
      pageInfo: u.posts.pageInfo,
      nodes,
    },
    postCount: nodes.length,   // equals `take` unless fewer available
  };

  return author;
}

