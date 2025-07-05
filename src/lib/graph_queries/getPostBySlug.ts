import { GraphQLError } from "../types";

const GRAPHQL_URL: string = process.env.WP_GRAPHQL_URL!;
import FEATURED_IMAGE from '../../../public/next.svg'


// Define types for posts and logo
export type Post = {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  date: string;
  modified?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText?: string;
    };
  };
  author?: {
    node: {
      name: string;
      url?: string;
    };
  };
  categories?: {
    nodes: { name: string }[];
  };
  tags?: {
    nodes: { name: string }[];
  };
};

export type Logo = {
  sourceUrl: string;
  altText?: string;
};

// Ensure the env var is defined


// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const query = `
    query GetPostBySlug($slug: String!) {
      postBy(slug: $slug) {
        id
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
            url
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
    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { slug } }),
      next: { revalidate: 60 },
    });
    const json = (await res.json()) as {
      data?: { postBy?: Post };
      errors?: GraphQLError;
    };
 
    const post = json.data?.postBy ?? null;
    if (post && post.featuredImage?.node.sourceUrl) {
      if (post.featuredImage.node.sourceUrl.includes("fallback")) {
        post.featuredImage.node.sourceUrl = FEATURED_IMAGE;
        post.featuredImage.node.altText =
          post.featuredImage.node.altText || "Default featured image";
      }
    }

    return post;
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}
