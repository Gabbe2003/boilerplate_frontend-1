// types.ts
import { Post } from '@/lib/types';
// featured_image_utils.ts

import FEATURED_IMAGE from '../../../public/next.svg';
const FEATURED_ALT = 'Default featured image';

// import type { NodeImage, Post } from '../types';

/**
 * Normalize a "flat" post object (with a string or falsy featuredImage field)
 */
export function normalizeFlatFeaturedImage<T extends { featuredImage?: string | false | null | undefined }>(post: T): T & { featuredImage: string } {
  const updated = { ...post };

  if (
    !updated.featuredImage ||                  // falsy (false, null, undefined, empty string)
    updated.featuredImage === '' ||
    (typeof updated.featuredImage === 'string' && updated.featuredImage.includes('fallback'))
  ) {
    return {
      ...updated,
      featuredImage: FEATURED_IMAGE as string,
    };
  }
  return updated as T & { featuredImage: string };
}

/**
 * Normalize an array or a single flat post object
 */
export function normalizeFlatImages<T extends { featuredImage?: string | false | null | undefined }>(input: T[]): Array<T & { featuredImage: string }> {
  return input.map(normalizeFlatFeaturedImage);
}


/**
 * Normalize a post object with nested featuredImage.node
 */
export function normalizeFeaturedImage(post: Post): Post {
  const updated: Post = { ...post };

  const fi = updated.featuredImage;

  if (
    !fi ||
    typeof fi !== 'object' ||
    !('node' in fi) ||
    !fi.node ||
    typeof fi.node !== 'object' ||
    !fi.node.sourceUrl ||
    fi.node.sourceUrl === '' ||
    fi.node.sourceUrl.includes('fallback')
  ) {
    // Set to default
    updated.featuredImage = {
      node: {
        sourceUrl: FEATURED_IMAGE as string,
        altText: FEATURED_ALT,
      },
    };
  } else {
    // If altText is missing, patch it too (optional)
    updated.featuredImage = {
      node: {
        ...fi.node,
        altText: fi.node.altText || FEATURED_ALT,
      },
    };
  }

  return updated;
}

/**
 * Normalize an array or single post with nested featuredImage.node
 */
export function normalizeImages<T extends Post | Post[]>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(normalizeFeaturedImage) as T;
  }
  return normalizeFeaturedImage(input) as T;
}
