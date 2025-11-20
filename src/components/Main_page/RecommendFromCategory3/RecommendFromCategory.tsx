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
    <div className="w-full flex justify-center mt-10">
      <div className="base-width-for-all-pages">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {CATEGORIES.map((slug) => {
            const posts = data[slug] || [];
            if (posts.length === 0) return null;

            const first = posts[0];
            const rest = posts.slice(1);

            return (
              <div key={slug} className="p-4 shadow-sm hover:shadow-md transition-shadow">
                {/* Featured post */}
                <h2 className="text-2xl mb-5">{slug}</h2>
                <Link href={`/${first.slug}`} className="block mb-4">
                  {first.featuredImage?.node?.sourceUrl && (
                    <div className="w-full aspect-[16/9] relative mb-3">
                      <Image
                        src={first.featuredImage.node.sourceUrl}
                        alt={first.featuredImage.node.altText || first.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <h3 className="font-semibold text-xl leading-tight mb-2">
                    {first.title}
                  </h3>

                  {/* Excerpt */}
                  {first.excerpt && (
                    <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                      {first.excerpt.replace(/<[^>]+>/g, "")}
                    </p>
                  )}
                </Link>

                {/* Remaining posts */}
                <ul className="space-y-2 border-t pt-3">
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
