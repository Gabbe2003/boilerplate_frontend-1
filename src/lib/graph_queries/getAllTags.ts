import "server-only"; 

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
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
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
