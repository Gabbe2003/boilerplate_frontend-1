import Link from "next/link";
import SearchBar from "../Search_Component/SearchBar";
import { Category_names } from "@/lib/types";
import { handleSpecielChar } from "@/lib/globals/actions";

export function DesktopHeader({
  links,
  all_categories, 
}: {
  links: { name: string; href: string }[];
  all_categories: Category_names[];
}) {
  
  return (
    <div className="w-full flex items-center justify-between gap-6 ">
      {/* Search in center */}
      <div className="flex-1 flex justify-center px-6">
        <SearchBar />
      </div>
      <nav className="flex items-center gap-8 text-sm font-medium mr-4">
        {all_categories.map((cat, index) => {
          // Replace ä -> a, ö -> o, and optionally handle spaces
          const slug = handleSpecielChar(cat.name)
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
          {links.map((l) => (
            <Link
              key={l.name}
              href={l.href}
              className="text-gray-800 hover:text-black tracking-wide"
            >
              {l.name}
            </Link>
          ))}
      </nav>
    </div>
  );
}
