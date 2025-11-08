import "server-only"; 

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Category_names } from "@/lib/types";
import { handleSpecielChar } from "@/lib/globals/actions";

export function MobileHeader({
  links,
  all_categories, 
}: {
  links: { name: string; href: string }[];
  all_categories: Category_names[];
}) {


  return (
    <details className="group relative">
      {/* Toggle (hamburger / close) */}
      <summary
        className="
          ml-auto p-2 cursor-pointer list-none
          inline-flex items-center justify-center
          /* when open, pin the close button to top-right above the panel */
          group-open:fixed group-open:top-4 group-open:right-4
          z-50
        "
        aria-label="Meny"
      >
        <span className="group-open:hidden inline-flex">
          <Menu size={26} />
        </span>
        <span className="hidden group-open:inline-flex">
          <X size={26} />
        </span>
      </summary>

      {/* Full-width off-canvas that slides in from right */}
      <div
        className="
          fixed inset-0 z-40 bg-white
          transform translate-x-full group-open:translate-x-0
          transition-transform duration-300 ease-in-out
          flex flex-col
          justify-center
          items-center
        "
        role="dialog"
        aria-modal="true"
      >
        <div className="px-6 pt-20 pb-10 max-w-md w-full mx-auto">
        <nav className="flex flex-col items-center gap-8 text-sm font-medium mr-4">
          {all_categories.map((cat, index) => {
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
      </div>
    </details>
  );
}
