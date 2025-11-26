
import Link from "next/link";
import SearchBar from "../Search_Component/SearchBar";
import { handleSpecielChar } from "@/lib/globals/actions";
import { Category_names, CategoryName, PostTitleSlug } from "@/lib/types";

export  function DesktopHeader({ categories_name, allPost }: {
  categories_name: CategoryName[];
  allPost: PostTitleSlug[]
}) {

  return (
<div className="hidden md:flex items-center py-3 border-b-2 border-black">
      
      {/* LEFT SPACER */}
      <div className="flex-1"></div>

      {/* NAVIGATION */}
      <nav className="flex gap-6 text-xs font-bold tracking-wide uppercase">
        {categories_name.map((cat, index) => {
          const slug = handleSpecielChar(cat.name);

          return (
            <Link
              key={slug + index}
              href={`/category/${slug}`}
              className="text-gray-800 hover:text-black border-r border-gray-400 pr-4 last:border-r-0"
            >
              {cat.name}
            </Link>
          );
        })}
      </nav>

      {/* SEARCH BAR */}
      <div className="flex-1 flex justify-end">
        <div className="w-[200px]">
          <SearchBar posts={allPost} action="/search" limitWidth="200px" />
        </div>
      </div>
    </div>
  );
}
