import "server-only"; 

export async function getCategoryBySlug(slug: string, after?: string) {
  const query = `
    query CategoryBySlug($slug: ID!, $after: String) {
      category(id: $slug, idType: SLUG) {
        id
        name
        slug
        description
        count
        parent {
          node {
            id
            name
            slug
          }
        }
        posts(first: 6, after: $after) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
            id
            title
            slug
            excerpt
            date
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
            author {
              node {
                id
                name
                slug
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch(process.env.WP_GRAPHQL_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { slug, after } }),
      next: { revalidate: 15 * 60 },
    });

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const json = await res.json();

    // Check for errors in GraphQL response
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL error');
    }

    if (!json.data || typeof json.data.category === 'undefined') {
      return null;
    }

    return json.data.category;
  } catch (error) {
    console.error('Error fetching category:', error);
    throw new Error('Failed to fetch category');
  }
}
