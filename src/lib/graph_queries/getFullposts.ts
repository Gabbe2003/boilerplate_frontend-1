'use server';

import { Post, GraphQLError } from '@/lib/types';
import FEATURED_IMAGE from '../../../public/next.svg';

const GRAPHQL_URL: string = process.env.WP_GRAPHQL_URL!;
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

fragment CommentFields on Comment {
  id
  date
  content
  parentId
  author {
    node {
      name
      url
    }
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
  commentCount

  featuredImage {
    node { ...MediaFields }
  }

  author { node { ...AuthorFields } }
  categories { nodes { ...TermFields } }
  tags       { nodes { ...TermFields } }
  comments(first: 5) { nodes { ...CommentFields } }

  # — SEO removed until plugin exposes matching fields —
}

    
  `;

  try {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables: { first, after, last, before },
      }),
    });

    //  const res = await loggedFetch(GRAPHQL_URL, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     query,
    //     variables: { first, after, last, before },
    //   }),
    //   context: 'getAllPosts',
    // });

    const json = (await res.json()) as {
      data?: { posts?: { nodes: Post[] } };
      errors?: GraphQLError[];
    };

    if (json.errors) {
      console.error('getAllPosts errors:', json.errors);
      return [];
    }

    const rawPosts = json.data?.posts?.nodes ?? [];
    const posts = rawPosts.map((post) => {
      if (!post.featuredImage?.node?.sourceUrl) {
        post.featuredImage = {
          node: {
            sourceUrl: FEATURED_IMAGE,
            altText: 'Default featured image'
          }
        };
      } else if (post.featuredImage.node.sourceUrl.includes('fallback')) {
        post.featuredImage.node.sourceUrl = FEATURED_IMAGE;
        post.featuredImage.node.altText = post.featuredImage.node.altText || 'Default featured image';
      }
      return post;
    });
    return posts;
  } catch (error) {
    console.error('getAllPosts failed:', error);
    return [];
  }
}
