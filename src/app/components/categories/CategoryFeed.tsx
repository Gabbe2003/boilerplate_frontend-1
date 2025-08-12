"use client";

import { useCategorySections } from "./herlper.useCategoryFeed";
import CategoryDesktopGrid from "./CategoryDesktopGrid";
import CategoryMobileCarousel from "./CategoryMobileCarousel";
import { Button } from "@/components/ui/button";

export default function CategorySections() {
  const {
    categories,
    selectedCategorySlug,
    selectedCategoryPosts,
    loading,
    postsLoading,
    hasNextPage,
    handleCategoryClick,
    loadMorePosts,
  } = useCategorySections();

  const selectedCategory =
    categories.find((c) => c.slug === selectedCategorySlug) ?? null;

  return (
    <div className="w-[100%] px-2 lg:w-[70%] mx-auto py-6">
      {loading ? (
        <p className="text-center">Loading categories...</p>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Title */}
          {selectedCategory && (
            <h2 className="text-xl font-semibold text-start lg:text-left capitalize">
              {selectedCategory.name}
            </h2>
          )}

          {/* Categories row aligned with posts */}
          {categories.length > 0 && (
            <nav aria-label="Categories">
              <div
                className="
                  flex items-start gap-2
                  overflow-x-auto md:overflow-visible
                  md:flex-wrap md:justify-start lg:justify-start
                  [scrollbar-width:none] [-ms-overflow-style:none]
                  [&::-webkit-scrollbar]:hidden
                  pb-2
                "
              >
                {categories.map((cat) => {
                  const isActive = selectedCategorySlug === cat.slug;
                  return (
                    <Button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.slug)}
                      className={`
                        whitespace-nowrap px-4 py-2 text-sm font-medium transition
                        ${isActive
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white text-gray-800 border-gray-200 hover:bg-gray-100"
                        }
                      `}
                      variant="ghost"
                    >
                      {cat.name}
                    </Button>
                  );
                })}
              </div>
            </nav>
          )}

          {/* Posts */}
          {postsLoading && selectedCategoryPosts.length === 0 ? (
            <p className="text-center">Loading posts...</p>
          ) : selectedCategoryPosts.length === 0 ? (
            <p className="text-sm text-gray-500 text-start">
              No posts in this category.
            </p>
          ) : (
            <>
              {/* MOBILE */}
              <CategoryMobileCarousel posts={selectedCategoryPosts} />

              {/* DESKTOP */}
              <CategoryDesktopGrid posts={selectedCategoryPosts} />

              {hasNextPage && (
                <div className="mt-6 hidden lg:flex justify-center">
                  <Button
                    onClick={loadMorePosts}
                    disabled={postsLoading}
                    className="px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {postsLoading ? "Loading more..." : "Load More"}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
