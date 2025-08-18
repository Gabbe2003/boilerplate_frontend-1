'use server';

import { signedFetch } from "../security/signedFetch";

export async function getAllAuthors() {
  const query = `
        query AllAuthors {
            users {
                nodes {
                id
                name
                slug
                description
                avatar {
                    url
                }
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
    return data.data.users.nodes;
  } catch (error) {
    console.error('Error fetching authors:', error);
    throw new Error('Failed to fetch authors');
  }
}
