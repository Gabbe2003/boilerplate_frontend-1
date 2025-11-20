import { wpGraphQLCached } from "../WpCachedResponse";

export async function getMenu(slug: number) {
  const query = `
  query Menu($slug: ID!) {
  menu(id: $slug) {
    id
    name
    slug
    menuItems {
      nodes {
        id
        label
        url
        parentId
      }
    }
  }
}

  `;

  const res = await wpGraphQLCached<any>(query, { slug }, {
    revalidate: 84600,
    tags: ["menus"],
  });

  return res.data?.menu || null;
}
