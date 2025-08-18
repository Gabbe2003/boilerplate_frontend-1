import "server-only"; 

const GRAPHQL_URL: string = process.env.WP_GRAPHQL_URL!;
import { GraphQLError, Post } from '@/lib/types';
import { signedFetch } from "../security/signedFetch";

export async function getPosts(): Promise<Post[]> {
  
  const query = `
    {
      posts(first: 100) {
        nodes {
          id
          title
          slug
          excerpt
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `;

  try {
    
    const res = await signedFetch(process.env.WP_GRAPHQL_URL!, {
      method: 'POST',
      json: { query },
      next: { revalidate: 604800, tags: ['recommendation'] },
    });

    const json = (await res.json()) as {
      data?: { posts?: { nodes: Post[] } };
      errors?: GraphQLError;
    };

    
    return json.data?.posts?.nodes ?? [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}
