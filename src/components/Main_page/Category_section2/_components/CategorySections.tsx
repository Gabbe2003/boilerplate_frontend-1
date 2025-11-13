"use client";

import { useEffect, useMemo, useState } from "react";
import { Category_names, CategoryWithPosts, Post } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { limitExcerpt, handleSpecielChar } from "@/lib/globals/actions";
import ReadPeak from "@/components/Ads/Ads/Readpeak/ReadPeak";
 
export default function CategorySections({
  getAllCategories,
}: {
  getAllCategories: Category_names[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("NYHETER");
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/categories?category=${encodeURIComponent(activeCategory)}&take=${encodeURIComponent(6)}`
        );
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        const data: CategoryWithPosts | null = await res.json();
        
        if (!cancelled) setPosts(data?.posts.nodes ?? []);
      } catch (err) {
        console.error("Error fetching category:", err);
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  return (
    <div >
      <h2>
        Senast inom {activeCategory }
      </h2>
      <div className="flex gap-5 border-b-2 mb-10 pb-10">
      {getAllCategories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(category.name)}
            aria-pressed={activeCategory === category.name}
            disabled={loading && activeCategory === category.name}
            className={`px-3 py-2 rounded transition custom-button
              ${activeCategory === category.name ? "bg-black text-white" : "bg-gray-200"}
              ${loading && activeCategory === category.name ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-300"}
            `}
          >
            {loading && activeCategory === category.name ? "Loading..." : category.name}
          </button>
      ))}
      </div>
      <div>
  {posts.length > 0 && (
    <ul
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-4 
        gap-6 
        border-b-2 
        pb-8
        mt-8
      "
    >
      {(() => {
        // Choose one random index between 0–5
        const randomIndex = Math.floor(Math.random() * 6);

        return posts.slice(0, 6).map((post, index) => {
          const spanClasses =
            index < 4
              ? "col-span-1"
              : "col-span-1 lg:col-span-2";

          // Inject the ReadPeak ad
          if (index === randomIndex) {
            return (
              <li
                key="readpeak-ad"
                className={`${spanClasses} bg-white rounded-md shadow-sm hover:shadow-md transition-shadow flex flex-col`}
              >
              <div className="relative w-full h-48 bg-gray-100 ">
                <ReadPeak numberOfAds={1} />
              </div>

              
              </li>
            );
          }

          // Regular post
          return (
            <li
              key={post.id ?? index}
              className={`${spanClasses} bg-white rounded-md shadow-sm hover:shadow-md transition-shadow  flex flex-col`}
            >
              <Link href={`/${post.slug}`} className="block h-full">
                <div className="relative w-full h-48 overflow-hidden">
                  <Image
                    src={post?.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
                    alt={post?.featuredImage?.node?.altText || "Image"}
                    width={600}
                    height={400}
                    className="w-full h-48 object-cover"
                  />
                </div>

                <div className="p-4 flex flex-col justify-between flex-1">
                  <h3 className="font-semibold text-lg text-gray-900 leading-snug">
                    {post.title}
                  </h3>
                  <div className="mt-2 text-sm text-gray-600 leading-snug">
                    {limitExcerpt(post.excerpt)}
                  </div>
                </div>
              </Link>
            </li>
          );
        });
      })()}
    </ul>
  )}
</div>


      <div className="mt-8 w-full flex justify-center mt-5">
        <button className="custom-button">
          <Link href={`/category/${handleSpecielChar(activeCategory || "")}`}>
            <p>
              Läs mer om {activeCategory}
            </p>
          </Link>
        </button>
      </div>
    </div>
  );
}
