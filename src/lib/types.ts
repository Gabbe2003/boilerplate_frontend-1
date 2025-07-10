export type PostItem = {
  id: number;
  title: string;
  slug: string;
  link: string;
  src: string;
  featured_image: string;
  publish_date: string;
  author_name: string;
  categories: string[];
};

export interface MediaDetailsSize {
  name: string;
  sourceUrl: string;
  width: number;
  height: number;
}

export interface MediaDetails {
  width: number;
  height: number;
  file: string;
  sizes: MediaDetailsSize[];
}

export interface MediaItemNode {
  id?: string;
  altText?: string;
  sourceUrl: string;
  mimeType?: string;
  mediaDetails?: MediaDetails;
}

export interface PostWithTOC extends Post {
  updatedHtml: string;
  toc: TOCItem[];
  featuredImage?: { node: MediaItemNode };
}

/** --- Author / User --- */
export interface AuthorAvatar {
  url: string;
  width?: number;
  height?: number;
}

export interface AuthorNode {
  id: string;
  name: string;
  slug?: string;
  uri?: string;
  avatar?: AuthorAvatar;
}

/** --- Terms (categories, tags) --- */
export interface TermNode {
  id: string;
  name: string;
  slug?: string;
  uri?: string;
  description?: string;
}

/** --- Comments --- */
export interface CommentAuthorNode {
  name: string;
  url?: string;
}

export interface Comment {
  id: string;
  date: string;
  content: string;
  parentId?: number;
  author?: {
    node: CommentAuthorNode;
  };
}

/** --- SEO / Open Graph --- */
export interface OpenGraphImage {
  secureUrl: string;
}

export interface OpenGraph {
  title?: string;
  description?: string;
  url?: string;
  type?: string;
  image?: OpenGraphImage;
}

export interface SEO {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  openGraph?: OpenGraph;
}

/** --- The Post interface --- */
export interface Post {
  id: string;
  databaseId?: number;
  slug: string;
  uri?: string;
  status?: string;
  isSticky?: boolean;

  title: string; // rendered title
  excerpt: string; // rendered excerpt
  content: string; // rendered content

  date: string; // published date
  modified?: string;

  commentCount?: number;

  featuredImage?: {
    node: MediaItemNode;
  };

  author?: {
    node: AuthorNode;
  };

  categories?: {
    nodes: TermNode[];
  };

  tags?: {
    nodes: TermNode[];
  };

  comments?: {
    nodes: Comment[];
  };

  seo?: SEO;
}
export interface GraphQLError {
  message: string;
  locations?: { line: number; column: number }[];
  path?: Array<string | number>;
  extensions?: Record<string, unknown>;
}

export interface Logo {
  sourceUrl: string;
  altText?: string | null;
}
