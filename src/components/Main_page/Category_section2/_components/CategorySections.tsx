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
}) {
  const [activeCategory, setActiveCategory] = useState("NYHETER");
  const { posts, loading } = useCategoryPosts(activeCategory);

  const randomIndex = useMemo(() => Math.floor(Math.random() * 4), [activeCategory]);

  return (
    <div className="pt-[var(--section-spacing)] pb-[var(--section-spacing)]">
      <SectionBreaker color="red" />

      <h2 className="text-2xl text-center sm:text-left text-[#1A1A1A]">
        Våra kategorier
      </h2>

      <div className="flex flex-wrap gap-3 mt-5 pb-8">
        {getAllCategories.map((category) => {
          const isActive = activeCategory === category.name;
          const isLoading = loading && isActive;

          return (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              disabled={isLoading}
              aria-pressed={isActive}
              className={`
          flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md
          border transition
          ${isActive
                  ? "bg-[#2e2d2d] text-white border-[#1A1A1A]"
                  : "text-[#333] border-[#d4c9c0]"
                }
          ${isLoading ? "opacity-60 cursor-not-allowed" : ""}
        `}
            >
              {/* Dot Indicator */}
              <span
                className={`
            w-2.5 h-2.5 rounded-full 
            ${isActive ? "bg-white" : "bg-[#d1cdca]"}
          `}
              />

              {isLoading ? "Loading..." : category.name}
            </button>
          );
        })}
      </div>


      {/* POSTS */}
      {/* POSTS + READ MORE SECTION */}
      {posts.length > 0 && (
        <div className="mt-6">

          {/* POSTS GRID */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 pb-6 border-b">
            {posts.slice(0, 6).map((post, index) => {
              const spanClasses = index < 4 ? "col-span-1" : "col-span-1 lg:col-span-2";
              const showRightBorder = index < 3 || index === 4;

              if (index === randomIndex) {
                return (
                  <li
                    key="readpeak-ad"
                    className={`${spanClasses} flex flex-col ${showRightBorder ? "lg:border-r lg:pr-6" : ""}`}
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

          {/* READ MORE BUTTON (RIGHT-ALIGNED LIKE DESIGN) */}
          <div className="flex justify-end mt-4">
            <Link
              href={`/category/${handleSpecielChar(activeCategory)}`}
              className="text-[#c65f14] text-sm font-medium flex items-center gap-2 hover:underline"
            >
              Se mer från kategorin
              <svg width="14" height="14" viewBox="0 0 20 20" className="text-[#c65f14]">
                <path
                  fill="currentColor"
                  d="M7 5l5 5-5 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}
