import "server-only"; 

import Link from "next/link";
import SearchBar from "../Search_Component/SearchBar";
import { Category_names } from "@/lib/types";
import { handleSpecielChar } from "@/lib/globals/actions";
import NewsletterIsland from "@/components/Ads/NewsLetter/NewsletterIsland";
import { getAllPosts, getAllPostsByTitle } from "@/lib/graphql_queries/getPost";

export async function DesktopHeader({
  links,
  all_categories,
}: {
  links: { name: string; href: string }[];
  all_categories: Category_names[];
}) {
  const allPost = await getAllPostsByTitle()

  return (
    <div className="w-full flex items-center justify-between gap-6">
      {/* Center search */}
      <div className="flex-1 flex justify-center px-6">
        <SearchBar posts={allPost} action="/search" /* hrefPrefix="/blog/" if needed */ />
      </div>

      <nav className="flex items-center gap-8 text-sm font-medium mr-4">
        {/* Category links */}
        {all_categories.map((cat, index) => {
          const slug = handleSpecielChar(cat.name);
          return (
            <Link
              key={slug + index}
              href={`/category/${slug}`}
              className="text-gray-800 hover:text-black tracking-wide"
            >
              {cat.name}
            </Link>
          );
        })}

        {/* General links */}
        {links.map((l) =>
          l.name.toUpperCase() === "NYHETSBREV" ? (
            <NewsletterIsland
              key={l.name}
              className="text-gray-800 hover:text-black tracking-wide"
              label={l.name}
            />
          ) : (
            <Link
              key={l.name}
              href={l.href}
              className="text-gray-800 hover:text-black tracking-wide"
            >
              {l.name}
            </Link>
          )
        )}
      </nav>
    </div>
  );
}
