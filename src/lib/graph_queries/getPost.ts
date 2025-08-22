import "server-only"; 

import { Post, GraphQLError } from '@/lib/types';
import { normalizeImages, normalizeFlatImages } from '../helper_functions/featured_image';
import { signedFetch } from "../security/signedFetch";

export async function getAllPosts({
  first = 100,
  after,
  last,
  before,
}: {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
} = {}): Promise<Post[]> {
  const query = `
  query AllPostsFull(
  $first:  Int
  $after:  String
  $last:   Int
  $before: String
) {
  posts(first: $first, after: $after, last: $last, before: $before) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    nodes {
      ...PostFull
    }
  }
}

fragment MediaFields on MediaItem {
  id
  altText
  sourceUrl
  mimeType
  mediaDetails {
    width
    height
    file
    sizes {
      name
      sourceUrl
      width
      height
    }
  }
}

fragment TermFields on TermNode {
  id
  name
  slug
  uri
  description
}

fragment AuthorFields on User {
  id
  name
  slug
  uri
  avatar {
    url
    width
    height
  }
}

fragment PostFull on Post {
  id
  databaseId
  slug
  uri
  status
  isSticky
  title(format: RENDERED)
  excerpt(format: RENDERED)
  content(format: RENDERED)
  date
  modified

  featuredImage {
    node { ...MediaFields }
  }

  author { node { ...AuthorFields } }
  categories { nodes { ...TermFields } }
  tags       { nodes { ...TermFields } }

  # — SEO removed until plugin exposes matching fields —
}

    
  `;

  try {
    const res = await signedFetch(process.env.WP_GRAPHQL_URL!, {
      method: 'POST',
      json: { query,  variables: { first, after, last, before } },
      next: { revalidate: 300, tags: ['posts'] },
    });

    const json = (await res.json()) as {
      data?: { posts?: { nodes: Post[] } };
      errors?: GraphQLError[];
    };

    if (json.errors) {
      console.error('getAllPosts errors:', json.errors);
      return [];
    }

    const rawPosts = json.data?.posts?.nodes ?? [];
    const posts = normalizeImages(rawPosts);
   
    return posts;
  } catch (error) {
    console.error('getAllPosts failed:', error);
    return [];
  }
}

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


interface FeaturedImageObject {
  node?: {
    sourceUrl?: string;
  };
}

interface RawView {
  id: string | number;
  title: string;
  slug: string;
  featuredImage: string | FeaturedImageObject | null | undefined;
  date: string;
  author_name: string;
  excerpt?: string;
}

export async function getPostByPeriod(
  period: "week" | "month"
): Promise<
   Array<{
  id: string;
  title: string;
  slug: string;
  featuredImage?: { node: { sourceUrl: string } };
  date: string;
  author_name: string;
  excerpt?: string;
}>
> {
  try {
    
    const url = `${process.env.NEXT_PUBLIC_HOST_URL}/wp-json/hpv/v1/top-posts?period=${period}`;
    const res = await signedFetch(url, {
      cache: 'force-cache',
      next: { revalidate: 400 },
    });

    if (!res.ok) {
      console.error('[getViews] non-OK response:', await res.text());
      return [];
    }
    
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error('[getViews] payload is not an array:', data);
      return [];
    }
    const raw = data as RawView[];

    // Single-pass mapping and normalization
    return raw.map((item) => {
    let normalizedImage: string | undefined;
    if (typeof item.featuredImage === "string" && item.featuredImage) {
        normalizedImage = item.featuredImage;
    } else if (item.featuredImage && typeof item.featuredImage === "object" && typeof item.featuredImage.node?.sourceUrl === "string") {
        normalizedImage = item.featuredImage.node.sourceUrl;
    } else {
        normalizedImage = undefined;
    }

    return {
        id: String(item.id),
        title: item.title?.trim() ?? "",
        slug: item.slug,
        featuredImage: normalizedImage ? { node: { sourceUrl: normalizedImage } } : undefined,
        date: item.date,
        author_name: item.author_name,
        excerpt: item.excerpt ?? "",
        type: 'post',
    };
    });

   
  } catch (err) {
    console.error('[getViews] fetch failed:', err);
    return [];
  }
}




export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `
    query GetPostBySlug($slug: String!) {
      postBy(slug: $slug) {
        databaseId
        title
        content
        excerpt
        slug
        date
        modified
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        author {
      node {
        name
        description
        avatar {
          url
        }
      }
}
        categories {
          nodes {
            name
          }
        }
        tags {
          nodes {
            name
          }
        }
      }
    }
  `;

  try {
    const res = await signedFetch(process.env.WP_GRAPHQL_URL!, {
      method: 'POST',
      json: { query, variables: { slug } },
      next: { revalidate: 300, tags: [`post-${slug}`] },
    });


    const json = (await res.json()) as {
      data?: { postBy?: Post };
      errors?: GraphQLError;
    };

    const post = json.data?.postBy;
    if (!post) return null;

    const normalized = normalizeImages(post);
    if (Array.isArray(normalized)) return null; // Defensive, shouldn't happen

    return normalized; // Is a Post
  } catch (error) {
    console.error('Failed to fetch post:', error);
    return null;
  }
}

export async function getRecommendation(): Promise<Post[]> {  
  const query = `
    {
      posts(first: 100) {
        nodes {
          id
          title
          slug
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
  `;

  try {
    
    const res = await signedFetch(process.env.WP_GRAPHQL_URL!, {
      method: 'POST',
      json: { query },
      next: { revalidate: 604800, tags: ['recommendation'] },
    });

    const json = (await res.json()) as {
      data?: { posts?: { nodes: Post[] } };
      errors?: GraphQLError;
    };

    
    return json.data?.posts?.nodes ?? [];
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return [];
  }
}


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
