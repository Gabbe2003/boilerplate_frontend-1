export async function getTagBySlug(slug: string, after?: string) {
  const query = `
    query TagBySlug($slug: ID!, $after: String) {
      tag(id: $slug, idType: SLUG) {
        id
        name
        slug
        description
        count
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
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`Network response was not ok: ${res.statusText}`);
    }

    const json = await res.json();


    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      throw new Error(json.errors[0]?.message || 'GraphQL error');
    }

    // Check for the right field!
    if (!json.data || typeof json.data.tag === 'undefined') {
      return null;
    }

    return json.data.tag;
  } catch (error) {
    console.error('Error fetching tag:', error);
    throw new Error('Failed to fetch tag');
  }
}
