"use client";

import { useEffect, useState } from "react";
import { Post } from "@/lib/types";

interface Category {
  id: string;
  name: string;
  slug: string;
}

type PageInfo = { hasNextPage: boolean; endCursor: string | null };
type PostsResponse = { posts: Post[]; pageInfo: PageInfo };

export function useCategorySections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  const [selectedCategoryPosts, setSelectedCategoryPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  // 1) Load all categories
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();

        // The route returns a top-level array: Category[]
        const allCats: Category[] = Array.isArray(data) ? data : (data?.categories ?? []);
        if (!alive) return;

        setCategories(allCats);
        // Initialize selected category if not set
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

  // 2) Load posts for the selected category
  useEffect(() => {
    if (!selectedCategorySlug) return;

    let alive = true;
    (async () => {
      setPostsLoading(true);
      try {
        const res = await fetch(
          `/api/categories?slug=${encodeURIComponent(selectedCategorySlug)}`,
          { cache: "no-store" }
        );
        if (!res.ok) throw new Error("Failed to fetch posts");
        const { posts, pageInfo }: PostsResponse = await res.json();
        if (!alive) return;

        setSelectedCategoryPosts(posts ?? []);
        setEndCursor(pageInfo?.endCursor ?? null);
        setHasNextPage(!!pageInfo?.hasNextPage);
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
    setSelectedCategorySlug(slug); // effect above will fetch
  }

  // 3) Pagination
  async function loadMorePosts() {
    if (!selectedCategorySlug || !endCursor) return;

    setPostsLoading(true);
    try {
      const res = await fetch(
        `/api/categories?slug=${encodeURIComponent(selectedCategorySlug)}&after=${encodeURIComponent(
          endCursor
        )}`,
        { cache: "no-store" }
      );
      if (!res.ok) throw new Error("Failed to fetch more posts");
      const { posts, pageInfo }: PostsResponse = await res.json();

      setSelectedCategoryPosts((prev) => prev.concat(posts ?? []));
      setEndCursor(pageInfo?.endCursor ?? null);
      setHasNextPage(!!pageInfo?.hasNextPage);
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
