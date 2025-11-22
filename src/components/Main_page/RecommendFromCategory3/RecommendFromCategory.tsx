"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

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
            `/api/categories?category=${encodeURIComponent(slug)}&start=6&end=10`,
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
   <div className="w-full flex justify-center mt-14">
  <div className="base-width-for-all-pages">
    
    <h2 className="text-xl sm:text-2xl font-semibold mb-8 text-gray-900">
      Senaste inom våra kategorier
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
      {CATEGORIES.map((slug) => {
        const posts = data[slug] || [];
        if (posts.length === 0) return null;

        const first = posts[0];
        const rest = posts.slice(1);

        return (
          <div
            key={slug}
            className="rounded-lg border border-gray-200 p-5 bg-white hover:shadow transition-all"
          >
            {/* Category Title */}
            <h3 className="text-lg font-semibold tracking-wide text-gray-800 mb-4">
              {slug}
            </h3>

            {/* Featured Post */}
            <Link href={`/${first.slug}`} className="block mb-4 group">
              {first.featuredImage?.node?.sourceUrl && (
                <div className="w-full aspect-[16/9] relative rounded-md overflow-hidden mb-3">
                  <Image
                    src={first.featuredImage.node.sourceUrl}
                    alt={first.featuredImage.node.altText || first.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
                  />
                </div>
              )}

              <h4 className="font-medium text-base text-gray-900 leading-snug line-clamp-2 group-hover:underline">
                {first.title}
              </h4>
            </Link>

            {/* Remaining Posts */}
            <ul className="space-y-2 border-t pt-4">
              {rest.map((post: any) => (
                <li key={post.id}>
                  <Link
                    href={`/${post.slug}`}
                    className="text-sm text-blue-600 hover:underline leading-tight"
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
