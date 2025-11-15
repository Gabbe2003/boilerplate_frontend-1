import "server-only"; 

import Link from "next/link";
import { Category_names } from "@/lib/types";
import { handleSpecielChar } from "@/lib/globals/actions";
import NewsletterIsland from "@/components/Ads/NewsLetter/NewsletterIsland";
import { getAllPostsByTitle } from "@/lib/graphql_queries/getPost";

export async function DesktopHeader({
  links,
  all_categories,
}: {
  links: { name: string; href: string }[];
  all_categories: Category_names[];
}) {

  return (
    <>
    <div className="flex items-center justify-between gap-6">
      <nav className="flex items-center gap-5 text-sm font-small mr-4">
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
            <div key={l.name}>
              <NewsletterIsland
                key={l.name}
                className="text-gray-800 hover:text-black tracking-wide"
                label={l.name}
                />
            </div>
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
     
    </>
  );
}
