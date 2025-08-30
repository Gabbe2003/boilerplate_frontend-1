'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Post } from '@/lib/types';

interface Category {
  id: string;
  name: string;
  slug: string;
}

type PageInfo = { hasNextPage: boolean; endCursor: string | null };
type PostsResponse = { posts: Post[]; pageInfo: PageInfo };
type CacheEntry = { posts: Post[]; pageInfo: PageInfo };

/** Mjuk revalidationsperiod (sekunder). Ingen env — fast till 5 minuter. */
const REVALIDATE_SECONDS = 300;

/** Version stamp that changes every REVALIDATE_SECONDS */
function versionStamp() {
  return String(Math.floor(Date.now() / (REVALIDATE_SECONDS * 1000)));
}

export function useCategorySections() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  const [selectedCategoryPosts, setSelectedCategoryPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);

  const [hasNextPage, setHasNextPage] = useState(false);
  const [endCursor, setEndCursor] = useState<string | null>(null);

  // per-category in-memory cache + abort handle
  const cacheRef = useRef<Map<string, CacheEntry>>(new Map());
  const abortRef = useRef<AbortController | null>(null);

  // Track current version; when it rolls over, we can refresh silently

  // 1) Load all categories (soft-revalidate via versioned URL)
  const fetchCategories = useCallback(async (signal?: AbortSignal) => {
    const url = `/api/categories?v=${versionStamp()}`;
    const res = await fetch(url, { cache: 'force-cache', signal });
    if (!res.ok) throw new Error('Failed to fetch categories');
    const data = await res.json();
    const allCats: Category[] = Array.isArray(data) ? data : data?.categories ?? [];
    return allCats;
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const allCats = await fetchCategories();
        if (!alive) return;
        setCategories(allCats);
        setSelectedCategorySlug((prev) => prev ?? allCats[0]?.slug ?? null);
      } catch (error) {
        console.error('Error loading categories:', error);
        if (alive) setCategories([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [fetchCategories]);



  const fetchPosts = useCallback(
    async (slug: string, after?: string | null, signal?: AbortSignal) => {
      const qs = new URLSearchParams();
      qs.set('slug', slug);
      if (after) qs.set('after', after);

      const res = await fetch(`/api/categories?${qs.toString()}`, {
        signal,
        // For first page, allow server cache; for pagination we pass `after`
        cache: after ? 'no-store' : 'force-cache',
      });
      if (!res.ok) throw new Error('Failed to fetch posts');
      return (await res.json()) as PostsResponse;
    },
    []
  );

  // 2) Load posts for the selected category (cache first, then refresh)
  useEffect(() => {
    if (!selectedCategorySlug) return;

    let alive = true;

    (async () => {
      // If cached, show immediately
      const cached = cacheRef.current.get(selectedCategorySlug);
      if (cached && alive) {
        setSelectedCategoryPosts(cached.posts);
        setEndCursor(cached.pageInfo.endCursor);
        setHasNextPage(!!cached.pageInfo.hasNextPage);
      }

      setPostsLoading(true);

      // cancel any in-flight
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      try {
        const { posts, pageInfo } = await fetchPosts(selectedCategorySlug, null, ac.signal);
        if (!alive) return;

        cacheRef.current.set(selectedCategorySlug, { posts: posts ?? [], pageInfo });
        setSelectedCategoryPosts(posts ?? []);
        setEndCursor(pageInfo?.endCursor ?? null);
        setHasNextPage(!!pageInfo?.hasNextPage);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error?.name !== 'AbortError') {
          console.error('Error loading posts:', error);
          if (alive && !cached) {
            setSelectedCategoryPosts([]);
            setEndCursor(null);
            setHasNextPage(false);
          }
        }
      } finally {
        if (alive) setPostsLoading(false);
      }
    })();

    return () => {
      alive = false;
      abortRef.current?.abort();
    };
  }, [selectedCategorySlug, fetchPosts]);



  function handleCategoryClick(slug: string) {
    if (slug === selectedCategorySlug) return;

    // If cached, switch immediately (UI stays snappy)
    const cached = cacheRef.current.get(slug);
    if (cached) {
      setSelectedCategorySlug(slug);
      // kick an idle refresh in the background
      // prefetchCategory(slug); // disabled
      return;
    }
    // Not cached: switch (effect will fetch) and show spinner
    setSelectedCategorySlug(slug);
  }

  // 3) Pagination (always network)
  async function loadMorePosts() {
    if (!selectedCategorySlug || !endCursor) return;

    setPostsLoading(true);
    try {
      const { posts, pageInfo } = await fetchPosts(selectedCategorySlug, endCursor);
      // append to UI
      setSelectedCategoryPosts((prev) => prev.concat(posts ?? []));
      setEndCursor(pageInfo?.endCursor ?? null);
      setHasNextPage(!!pageInfo?.hasNextPage);
      // and update cache
      const existing = cacheRef.current.get(selectedCategorySlug) || {
        posts: [],
        pageInfo: { hasNextPage: false, endCursor: null as string | null },
      };
      cacheRef.current.set(selectedCategorySlug, {
        posts: existing.posts.concat(posts ?? []),
        pageInfo,
      });
    } catch (error) {
      console.error('Error loading more posts:', error);
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
