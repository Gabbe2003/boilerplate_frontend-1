// hooks/useCategorySections.ts
"use client";

import { useEffect, useState } from "react";
import { getCategoryBySlug } from "@/lib/graph_queries/getCategoryBySlug";
import { Post } from "@/lib/types";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function useCategorySections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  const [selectedCategoryPosts, setSelectedCategoryPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = await res.json();
        const allCats: Category[] = data?.categories ?? [];
        if (!alive) return;

        setCategories(allCats);
        setSelectedCategorySlug((prev) => prev ?? allCats[0]?.slug ?? null);
      } catch (error) {
        console.error("Error loading categories:", error);
        if (alive) setCategories([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedCategorySlug) return;

    let alive = true;
    (async () => {
      setPostsLoading(true);
      try {
        const cat = await getCategoryBySlug(selectedCategorySlug);
        if (!alive) return;

        setSelectedCategoryPosts(cat?.posts?.nodes ?? []);
        setEndCursor(cat?.posts?.pageInfo?.endCursor ?? null);
        setHasNextPage(!!cat?.posts?.pageInfo?.hasNextPage);
      } catch (error) {
        console.error("Error loading posts:", error);
        if (alive) {
          setSelectedCategoryPosts([]);
          setEndCursor(null);
          setHasNextPage(false);
        }
      } finally {
        if (alive) setPostsLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedCategorySlug]);

  function handleCategoryClick(slug: string) {
    if (slug === selectedCategorySlug) return;
    // Only update state; effect above will fetch & re-render
    setSelectedCategorySlug(slug);
  }

  async function loadMorePosts() {
    if (!selectedCategorySlug || !endCursor) return;

    setPostsLoading(true);
    try {
      const category = await getCategoryBySlug(selectedCategorySlug, endCursor);
      const newPosts = category?.posts?.nodes ?? [];

      setSelectedCategoryPosts((prev) => prev.concat(newPosts));
      setEndCursor(category?.posts?.pageInfo?.endCursor ?? null);
      setHasNextPage(!!category?.posts?.pageInfo?.hasNextPage);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setPostsLoading(false);
    }
  }

  return {
    categories,
    selectedCategorySlug,
    selectedCategoryPosts,
    loading,
    postsLoading,
    hasNextPage,
    handleCategoryClick,
    loadMorePosts,
  };
}
