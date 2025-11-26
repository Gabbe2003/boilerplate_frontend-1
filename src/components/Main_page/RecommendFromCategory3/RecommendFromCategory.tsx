"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SectionBreaker from "@/components/SectionBreaker";

const CATEGORIES = ["NYHETER", "BÖRSEN", "FÖRETAG", "UTBILDNING"];

export default function CategoryFourBlock() {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const results: Record<string, any> = {};

      await Promise.all(
        CATEGORIES.map(async (slug) => {
          const res = await fetch(
            `/api/categories?category=${encodeURIComponent(
              slug
            )}&start=6&end=10`,
            { cache: "no-store" }
          );

          if (!res.ok) {
            results[slug] = [];
            return;
          }

          const json = await res.json();
          results[slug] = json?.posts?.nodes ?? [];
        })
      );

      setData(results);
      setLoading(false);
    }

    load();
  }, []);

  if (loading) return <div>Loading...</div>;
return (
  <div className="w-full flex justify-center pt-[var(--section-spacing)] pb-[var(--section-spacing)] bg-[#FCEDDC]">
    <div className="base-width-for-all-pages">

      <SectionBreaker color="red" />

      <h2 className="text-lg sm:text-xl font-semibold mb-6 text-[#2f2a26] tracking-tight">
        Senaste inom våra kategorier
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {CATEGORIES.map((slug) => {
          const posts = data[slug] || [];
          if (posts.length === 0) return null;

          const first = posts[0];
          const rest = posts.slice(1);

          return (
            <div
              key={slug}
              className="
                rounded-lg 
                border border-[#e5d8c9]
                bg-[#f8efe5]
                p-3 sm:p-4 
                shadow-sm
                transition
              "
            >
              {/* Category Title */}
              <h3 className="text-lg font-semibold text-[#7a6f67] tracking-wider uppercase mb-3">
                {slug}
              </h3>

              {/* Featured Post */}
              <Link href={`/${first.slug}`} className="block group">
                {first.featuredImage?.node?.sourceUrl && (
                  <div className="w-full h-[90px] lg:h-[150px] relative rounded-md overflow-hidden bg-[#f2e7db] flex items-center justify-center mb-3">
                    <Image
                      src={first.featuredImage.node.sourceUrl}
                      alt={first.featuredImage.node.altText || first.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}

                <h4 className="font-semibold text-sm sm:text-base text-[#2f2a26] leading-snug line-clamp-2 transition">
                  {first.title}
                </h4>
              </Link>

              {/* Remaining Posts */}
              <ul className="mt-4 space-y-2 border-t border-[#e5d8c9] pt-3 text-[11px] sm:text-xs">
                {rest.map((post: any) => (
                  <li key={post.id} className="pl-3 relative">
                    <span className="absolute left-0 top-1.5 w-1 h-1 rounded-full bg-red-500"></span>

                    <Link
                      href={`/${post.slug}`}
                      className="text-[#4a433c] leading-tight transition line-clamp-2"
                    >
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

    </div>
  </div>
);

}
