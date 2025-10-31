import "server-only"; 
import type { CategoriesQuery, Category_names, CategoryBySlugQuery } from "@/lib/types";
import { wpGraphQLCached } from "../WpCachedResponse";



export async function get_all_categories_by_name(): Promise<Category_names[]> {
  const QUERY =  `
    query NewQuery {
      categories {
        edges {
          node { 
            name 
            count
          }
        }
      }
    }
  `;
  const data = await wpGraphQLCached<CategoriesQuery>(QUERY);
  
  return data.data.categories?.edges.map(edge => ({ name: edge.node.name, count:  edge.node.count}));
}

export async function getCategoryBySlug(slug = "NYHETER" , after?: string) {
  
  const QUERY =   `
    query CategoryBySlug($slug: ID!, $after: String) {
      category(id: $slug, idType: SLUG) {
        posts(first: 6, after: $after) {
          nodes {
            title
            slug
            excerpt
            featuredImage { node { sourceUrl altText } }
          }
        }
      }
    }
  `;
  const { data } = await wpGraphQLCached<CategoryBySlugQuery>(QUERY, { slug, after });
  return data.category; 
}

