
// Random stuff 😂
export type TodayPost = Record<string, unknown>;

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



export type CategoryWithPosts = {
  id: string;
  name: string;
  slug: string;
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
  category?: {
    nodes: CategoryNode[]
  }

 
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
    };
  };

  id?: string;
  slug?: string;
  status?: string;
  tags?: { nodes: any[] };
  title?: string;
  uri?: string;
}

