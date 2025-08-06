'use client';

import React, { useEffect, useState } from 'react';
import { getCategoryBySlug } from '@/lib/graph_queries/getCategoryBySlug';
import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Post } from '@/lib/types';

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function CategorySections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedCategoryPosts, setSelectedCategoryPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInitialCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        const allCats = data.categories;

        setCategories(allCats);
        setSelectedCategorySlug(allCats[0]?.slug || null);

        if (allCats[0]?.slug) {
          const fullCategory = await getCategoryBySlug(allCats[0].slug);
          setSelectedCategoryPosts(fullCategory?.posts?.nodes ?? []);
          setEndCursor(fullCategory?.posts?.pageInfo?.endCursor ?? null);
          setHasNextPage(fullCategory?.posts?.pageInfo?.hasNextPage ?? false);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialCategories();
  }, []);

  async function handleCategoryClick(slug: string) {
    if (slug === selectedCategorySlug) return;
    setPostsLoading(true);
    setSelectedCategorySlug(slug);

    try {
      const category = await getCategoryBySlug(slug);
      setSelectedCategoryPosts(category?.posts?.nodes ?? []);
      setEndCursor(category?.posts?.pageInfo?.endCursor ?? null);
      setHasNextPage(category?.posts?.pageInfo?.hasNextPage ?? false);
    } catch (error) {
      console.error('Error loading posts:', error);
      setSelectedCategoryPosts([]);
    } finally {
      setPostsLoading(false);
    }
  }

  async function loadMorePosts() {
    if (!selectedCategorySlug || !endCursor) return;

    setPostsLoading(true);
    try {
      const category = await getCategoryBySlug(selectedCategorySlug, endCursor);
      const newPosts = category?.posts?.nodes ?? [];

      setSelectedCategoryPosts(prev => [...prev, ...newPosts]);
      setEndCursor(category?.posts?.pageInfo?.endCursor ?? null);
      setHasNextPage(category?.posts?.pageInfo?.hasNextPage ?? false);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setPostsLoading(false);
    }
  }

  return (
    <div className="w-[90%] lg:w-[70%] mx-auto py-10">
      {loading ? (
        <p className="text-center">Loading categories...</p>
      ) : (
        <div className="flex flex-col lg:flex-row-reverse gap-8 items-start">
          {/* Sidebar - Categories on right */}
          <aside className="w-full lg:w-1/4 pt-6">
            <Card>
              <CardHeader>
                <h3 className="text-md font-semibold text-gray-800">Categories</h3>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`flex items-center justify-between px-4 py-2 rounded-md text-sm font-medium transition border ${
                      selectedCategorySlug === cat.slug
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-white hover:bg-gray-100 text-gray-800 border-gray-200'
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

          {/* Posts Grid */}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedCategoryPosts.map((post) => (
                    <a key={post.id} href={`/${post.slug}`} className="group flex flex-col gap-2">
                      {post.featuredImage?.node?.sourceUrl && (
                        <div className="relative w-full h-[160px] overflow-hidden rounded-md">
                          <Image
                            src={post.featuredImage.node.sourceUrl}
                            alt={post.featuredImage.node.altText || post.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium group-hover:underline text-gray-800">
                          {post.title}
                        </p>

                        {post.date && (
                          <p className="text-xs text-gray-500">
                            {new Date(post.date).toLocaleDateString()}
                          </p>
                        )}

                        {post.excerpt && (
                          <p className="text-xs text-gray-600 leading-snug line-clamp-2">
                            {post.excerpt.replace(/<[^>]+>/g, '')}
                          </p>
                        )}
                      </div>
                    </a>
                  ))}
                </div>

                {hasNextPage && (
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
