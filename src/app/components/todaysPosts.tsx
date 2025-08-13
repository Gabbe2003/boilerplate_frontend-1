// lib/rest_queries/getTodaysPosts.ts
'use server';

const HOST_URL = process.env.NEXT_PUBLIC_HOST_URL!;

export async function getTodaysPosts(limit: number = 5) {
  const url = `${HOST_URL}/wp-json/hpv/v1/today-posts`;

  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 60 * 60 }, 
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch today's posts: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data.slice(0, limit);
}
