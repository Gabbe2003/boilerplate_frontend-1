"use client";

import Link from "next/link";
import SectionBreaker from "@/components/SectionBreaker";
import { handleSpecielChar } from "@/lib/globals/actions";
import { CategoryPostCard } from "./CategoryPostCard";
import { useCategoryPosts } from "../hooks/useCategoryPosts";
import { useMemo, useState } from "react";
import ReadPeak from "@/components/Ads/Ads/Readpeak/ReadPeak";
import { Category_names } from "@/lib/types";

export default function CategorySections({
  getAllCategories,
}: {
  getAllCategories: Category_names[];
}) {  const [activeCategory, setActiveCategory] = useState("NYHETER");
  const { posts, loading } = useCategoryPosts(activeCategory);

  const randomIndex = useMemo(() => Math.floor(Math.random() * 4), [activeCategory]);

  return (
    <div className="pt-[var(--section-spacing)] pb-[var(--section-spacing)] bg-[#F5ECE4]">
      <SectionBreaker color="red" />

      <h2 className="text-2xl text-center sm:text-left text-[#1A1A1A]">
        Våra kategorier
      </h2>

      <div className="flex flex-wrap gap-4 mt-5 pb-10">
        {getAllCategories.map((category) => (
          <button
            key={category.name}
            onClick={() => setActiveCategory(category.name)}
            disabled={loading && activeCategory === category.name}
            aria-pressed={activeCategory === category.name}
            className={`py-2 rounded-sm custom-button text-sm font-medium
              ${activeCategory === category.name ? "!bg-black !text-white" : "text-[#4B4B4B] hover:text-black"}
              ${loading && activeCategory === category.name ? "opacity-70 cursor-not-allowed" : ""}
            `}
          >
            {loading && activeCategory === category.name ? "Loading..." : category.name}
          </button>
        ))}
      </div>

      {/* POSTS */}
      {posts.length > 0 && (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 border-b-2 border-[#e3d7cc] pb-8 mt-3">

          {posts.slice(0, 6).map((post, index) => {
            const spanClasses = index < 4 ? "col-span-1" : "col-span-1 lg:col-span-2";
            const showRightBorder = index < 3 || index === 4;

            if (index === randomIndex) {
                  return (
                    <li
                      key="readpeak-ad"
                      className={`
                        ${spanClasses}
                        flex flex-col
                        transition-shadow
                        ${showRightBorder ? "lg:border-r lg:pr-6 border-[#e3d7cc]" : ""}
                      `}
                    >
                      <div className="relative w-full bg-[#f2eee7] rounded-md">
                        <ReadPeak numberOfAds={1} />
                      </div>
                    </li>
                  );
                }

            return (
              <CategoryPostCard
                key={post.id}
                post={post}
                index={index}
                spanClasses={spanClasses}
                showRightBorder={showRightBorder}
              />
            );
          })}

        </ul>
      )}

      {/* READ MORE */}
      <div className="flex justify-center mt-8">
        <Link
          href={`/category/${handleSpecielChar(activeCategory)}`}
          className="custom-button !bg-black !text-white px-4 py-2 rounded-sm"
        >
          Läs mer om {activeCategory}
        </Link>
      </div>
    </div>
  );
}
