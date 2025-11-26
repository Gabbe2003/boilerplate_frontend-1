import { get_all_categories_by_name } from "@/lib/graphql_queries/getCategories";
import Header from "./Header";
import { getAllPostsByTitle } from "@/lib/graphql_queries/getPost";

export default async function HeaderWrapper() {
  const categories_name = await get_all_categories_by_name();
  const allPost = await getAllPostsByTitle();

  return <Header categories_name={categories_name} allPost={allPost} />;
}
