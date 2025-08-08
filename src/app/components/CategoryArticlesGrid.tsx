'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import CategoryMobileCarousel from './mobile';
import { useCategorySections } from './category';
import CategoryDesktopGrid from './desktop';

export default function CategorySections() {
  const {
    categories,
    selectedCategorySlug,
    selectedCategoryPosts,
    loading,
    postsLoading,
    hasNextPage,
    isMobile,
    handleCategoryClick,
    loadMorePosts,
  } = useCategorySections();

  return (
    <div className="w-[90%] lg:w-[70%] mx-auto py-6">
      {loading ? (
        <p className="text-center">Loading categories...</p>
      ) : (
        <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
          {/* Sidebar - Categories on right */}
          <aside className="w-full lg:w-1/4 mt-12 pt-8">
            <Card>
              <CardHeader />
              <CardContent className="flex flex-col gap-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition border ${
                      selectedCategorySlug === cat.slug
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm hover:cursor-pointer'
                        : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-200  hover:cursor-pointer'
                    }`}
                  >
                    <span>{cat.name}</span>
                    {selectedCategorySlug === cat.slug && (
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">✓</span>
                    )}
                  </button>
                ))}
              </CardContent>
            </Card>
          </aside>

          {/* Posts Grid / Carousel */}
          <main className="w-full lg:w-3/4">
            {selectedCategorySlug && (
              <h2 className="text-xl font-semibold mb-6 capitalize text-center lg:text-left">
                {categories.find(c => c.slug === selectedCategorySlug)?.name}
              </h2>
            )}

            {postsLoading && selectedCategoryPosts.length === 0 ? (
              <p className="text-center">Loading posts...</p>
            ) : selectedCategoryPosts.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">No posts in this category.</p>
            ) : (
              <>
                {/* MOBILE: Modularized carousel */}
                <CategoryMobileCarousel posts={selectedCategoryPosts} />

                {/* DESKTOP: Modularized grid */}
                <CategoryDesktopGrid posts={selectedCategoryPosts} />

                {/* "Load more" button ONLY on desktop */}
                {hasNextPage && !isMobile && (
                  <div className="mt-6 flex justify-center">
                    <button
                      onClick={loadMorePosts}
                      disabled={postsLoading}
                      className="px-6 py-2 text-sm font-medium bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {postsLoading ? 'Loading more...' : 'Load More'}
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
