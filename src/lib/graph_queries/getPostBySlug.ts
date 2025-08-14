import "server-only"; 


import { GraphQLError, Post } from '../types';

const GRAPHQL_URL: string = process.env.WP_GRAPHQL_URL!;
// import { loggedFetch } from '../logged-fetch';
import { normalizeImages } from '../helper_functions/featured_image';

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
      next: { revalidate: 300, tags: [`post-${slug}`]},
    });

  

    const json = (await res.json()) as {
      data?: { postBy?: Post };
      errors?: GraphQLError;
    };

    const post = json.data?.postBy;
    if (!post) return null;

    const normalized = normalizeImages(post);
    if (Array.isArray(normalized)) return null; // Defensive, shouldn't happen

    return normalized; // Is a Post
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}
