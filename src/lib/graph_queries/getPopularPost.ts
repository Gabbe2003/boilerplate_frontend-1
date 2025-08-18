import "server-only"; 

import { Post } from '../types';
import { normalizeFlatImages } from '../helper_functions/featured_image';
import { signedFetch } from "../security/signedFetch";

export async function get_popular_post(): Promise<Post[]> {
  try {
    const url = `${process.env.NEXT_PUBLIC_HOST_URL}/wp-json/hpv/v1/top-posts?popular`;
    const res = await signedFetch(url, {
      cache: 'force-cache',
      next: { revalidate: 1800, tags: ['popular'] },
    });
    const json = await res.json();
    const rawPosts = Array.isArray(json)
      ? json
      : (json.data?.posts?.nodes ?? []);

    const normalizedList = normalizeFlatImages(rawPosts);
    return normalizedList ?? [];
  } catch (error) {
    console.log('An error occured', error);
    return [];
  }
}
