import "server-only"; 
const GRAPHQL_URL: string = process.env.WP_GRAPHQL_URL!;

export async function getAuthorBySlug(slug: string) {
  const query = `
    query GetAuthorBySlug($slug: ID!) {
      user(id: $slug, idType: SLUG) {
        name
        description
        avatar {
          url
        }
        posts(first: 20) {
          nodes {
            id
            title
            slug
            date
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
    }
  `;

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { slug } }),
      next: { revalidate: 600, tags: [`author-${slug}`] },
    });

    if (!res.ok) throw new Error(`Network error: ${res.status}`);

    const { data, errors } = await res.json();
    if (errors) throw new Error(JSON.stringify(errors));

    return data.user;
  } catch (error) {
    console.error('Error occurred in getAuthorBySlug:', error);
    throw error;
  }
}
