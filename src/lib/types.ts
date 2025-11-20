import "server-only";


// Random stuff 😂

export type GetAllPostsOpts = {
  disableCache?: boolean;   // force uncached fetch
  buckets?: number[];       // default: [2, 10, 100]
  revalidate?: number;      // ISR seconds; default 300
};

export type PostTitleSlug = {
  title: string;
  slug: string;
};

export type PostsQueryData = {
  posts?: {
    nodes?: Array<{
      title?: string | null;
      slug?: string | null;
    } | null> | null;
  } | null;
};

export type WpGraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message?: string }>;
};


export type GetPostSlugsOpts = {
  revalidate?: number;     
  disableCache?: boolean;  
  tags?: string[]; 
};

export type AllPostSlugsResponse = {
  data?: {
    posts?: {
      nodes?: Array<{ slug?: string | null } | null> | null;
    } | null;
  } | null;
};

export type GQLResp = {
  data?: {
    posts?: {nodes: Post[]} | null;
  } | null;
};

export type TodayPost = {
  slug?: string;
  title: string | { rendered: string };
  excerpt: string | { rendered: string };
  [key: string]: any;
};

export type AllPostsMinimalResponse = {
  data: any;
  posts?: {
    pageInfo?: {
      hasNextPage?: boolean;
      hasPreviousPage?: boolean;
      startCursor?: string | null;
      endCursor?: string | null;
    };
    
    nodes?: Post[];
  };
};



export type PostBySlugResult = {
  post: Post;
  updatedHtml: string;
  toc: ITOCItem[];
};



// Table of content items
export interface ITOCItem {
  id: string;
  text: string;
  level: number;
  children?: ITOCItem[];

}


// Categories
export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
};



export type Category_names = {
  name: string;
  count?: number | null; 
};



export type CategoryBySlugQuery = {
  data: {
    category: CategoryWithPosts | null;
  }
};


export interface CategoriesQuery {
  data: {
    categories: {
      edges: {
        node: {
          name: string;
          count: number | null
        };
      }[];
    };
  };
}


export type CategoryName = { name: string; count: number };

export type CategoryWithPosts = {
  id: string;
  name: string;
  slug: string;
  title?: string;
  excerpt?: string;           
  featuredImageUrl?: string;
  description?: string | null;
  count?: number | null;
  parent?: { node?: { id: string; name: string; slug: string } | null } | null;
  posts: {
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
    nodes: Post[];
  };
}



export interface Post {
  author_name?: string;
  author?: { node: Record<string, any> };
  content?: string; 
  databaseId?: number;
  date?: string;
  excerpt?: string;

  featuredImage?: {
  node?: {
    id?: string | number;
    altText?: string;
    sourceUrl?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
      sizes?: Array<{
        name?: string;
        sourceUrl?: string;
        width?: number;
        height?: number;
      }>;
    };
    [k: string]: any;
  } | null;
};


  id?: string;
  slug?: string;
  status?: string;
  tags?: { nodes: any[] }; // we can better type insteead of any
  category?: {
    nodes: CategoryNode[]
  }
  categories?: {
    nodes: CategoryNode[]
  }
    
  seo?:{
    title?: string; 
    breadcrumbs?:{
      text: string; 
      url: string
    }
  }
  title?: string;
  uri?: string;
}

export type SeoBreadcrumb = {
  text: string;
  url?: string | null;
};

export type SeoBasic = {
  title?: string | null;
  breadcrumbs?: SeoBreadcrumb[] | null;
};

/** PageInfo type for cursor-based pagination */
export type PageInfo = {
  hasNextPage: boolean;
  endCursor?: string | null;
};

/** Core Author shape — works for both list and detail queries */
export type Author = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  avatar?: { url?: string | null } | null;

  /** Optional count when mapping categories-like data */
  postCount?: number | null;

  /** For category compatibility (not used by authors but safe to keep) */
  parent?: { id: string; name: string; slug: string } | null;

  /** Posts connection */
  posts: {
    pageInfo?: PageInfo;
    nodes: Post[];
  };

  /** Optional SEO data (from first post or user.seo if available) */
  seo?: SeoBasic | null;
};

/** Raw GraphQL envelope */
export type GqlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

/** All authors list query shape */
export type AllAuthorsData = {
  users: {
    nodes: {
      id: string;
      name: string;
      slug: string;
      description?: string | null;
      avatar?: { url?: string | null } | null;
      posts: {
        nodes: (Post & { seo?: SeoBasic | null })[];
      };
    }[];
  };
};


// Author