import { GraphQLError, Post } from '../types';

const GRAPHQL_URL: string = process.env.WP_GRAPHQL_URL!;
import FEATURED_IMAGE from '../../../public/next.svg';

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
   const query = `
    query GetPostBySlug($slug: String!) {
      postBy(slug: $slug) {
        databaseId
        title
        content
        excerpt
        slug
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
          node {
            name
            url
            avatar {
              url
            }
          }
        }
        categories {
          nodes {
            name
          }
        }
        tags {
          nodes {
            name
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { slug } }),
      next: { revalidate: 60 },
    });

// const res = await loggedFetch(GRAPHQL_URL, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ query, variables: { slug } }),
//       next: { revalidate: 60 },
//       context: 'getPostBySlug',
//     });


    const json = (await res.json()) as {
      data?: { postBy?: Post };
      errors?: GraphQLError;
    };

    const post = json.data?.postBy ?? null;
    if (post && post.featured_image?.node.sourceUrl) {
      if (post.featured_image.node.sourceUrl.includes('fallback')) {
        post.featured_image.node.sourceUrl = FEATURED_IMAGE;
        post.featured_image.node.altText =
          post.featured_image.node.altText || 'Default featured image';
      }
    }

    return post;
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}
