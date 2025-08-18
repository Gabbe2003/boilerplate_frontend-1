import "server-only"; 
import { signedFetch } from "../security/signedFetch";

const GRAPHQL_URL: string = process.env.WP_GRAPHQL_URL!;

export async function getAllTags() {
  const query = `
    query AllTags {
      tags {
        nodes {
          id
          name
          slug
          description
          count
        }
      }
    }
  `;
  try {
   const res = await signedFetch(process.env.WP_GRAPHQL_URL!, {
    method: 'POST',
    json: { query },
    next: { revalidate: 86400 },
  });

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const data = await res.json();
    return data.data.tags.nodes;
  } catch (error) {
    console.error('Error fetching tags:', error);
    throw new Error('Failed to fetch tags');
  }
}
