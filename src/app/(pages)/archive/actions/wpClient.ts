import "server-only";
import { PostsPage } from "@/lib/types";
import { wpGraphQLCached } from "@/lib/WpCachedResponse";

const ALL_POSTS_MINIMAL = `
  query AllPostsMinimal($first: Int!, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        id
        slug
        title(format: RENDERED)
        excerpt(format: RENDERED)
        date
        featuredImage {
          node {
            id
            altText
            sourceUrl
            mediaDetails {
              width
              height
              sizes {
                name
                sourceUrl
                width
                height
              }
            }
          }
        }
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        category: categories {
          nodes {
            id
            name
            slug
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;

export const POSTS_PER_PAGE = 8;

export async function getPostsPage(
  first: number = POSTS_PER_PAGE,
  after?: string | null
): Promise<PostsPage> {
  const data: any = await wpGraphQLCached(ALL_POSTS_MINIMAL, {
    first,
    after: after ?? null,
  });

  const postsData = data?.data?.posts;

  if (!postsData) {
    return {
      posts: [],
      endCursor: null,
      hasNextPage: false,
    };
  }

  const { nodes, pageInfo } = postsData;

  return {
    posts: nodes ?? [],
    endCursor: pageInfo?.endCursor ?? null,
    hasNextPage: pageInfo?.hasNextPage ?? false,
  };
}
