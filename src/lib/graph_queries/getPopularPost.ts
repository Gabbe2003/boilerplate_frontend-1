'use server';

import { Post } from '../types';

const POPULAR_POST = process.env.POPULAR_POST!;

// import { loggedFetch } from "../logged-fetch";
import { normalizeFlatImages } from '../helper_functions/featured_image';

export async function get_popular_post(): Promise<Post[]> {
  try {
    const res = await fetch(`${POPULAR_POST}`, {
      cache: 'force-cache',
      next: { revalidate: 1800 },
    });
    console.log('Fetching popular posts from:', POPULAR_POST);

    // const res = await loggedFetch(`${POPULAR_POST}`, {
    //   context: "getPopularPost",
    // });

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
