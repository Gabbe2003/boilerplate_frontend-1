// lib/graph_queries/getSiteTagline.ts
import 'server-only';

export async function getSiteTagline(): Promise<string> {
  const endpoint = process.env.WP_GRAPHQL_URL; 
  if (!endpoint) {
    console.error('WP_GRAPHQL_URL is not set');
    return '';
  }

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        query: `query { generalSettings { description } }`,
      }),
      next: { revalidate: 300 }, // cache on the server for 5 minutes
    });

    if (!res.ok) return '';
    const json = await res.json();
    return json?.data?.generalSettings?.description ?? '';
  } catch (e) {
    console.error('getSiteTagline error:', e);
    return '';
  }
}
