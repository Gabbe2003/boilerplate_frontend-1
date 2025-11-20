import "server-only"
import { wpGraphQLRaw } from "../WpCachedResponse";
import {  Author, GqlResponse, Post } from "../types";


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

