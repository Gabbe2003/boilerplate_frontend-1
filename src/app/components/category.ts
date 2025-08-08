// hooks/useCategorySections.ts
import { useEffect, useState } from 'react';
import { getCategoryBySlug } from '@/lib/graph_queries/getCategoryBySlug';
import { Post } from '@/lib/types';

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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 1024); // lg breakpoint
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Initial categories load
  useEffect(() => {
    async function fetchInitialCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        const allCats = data.categories;

        setCategories(allCats);
        setSelectedCategorySlug(allCats[0]?.slug || null);

        if (allCats[0]?.slug) {
          await fetchPostsForCategory(allCats[0].slug, isMobile);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialCategories();
    // eslint-disable-next-line
  }, [isMobile]);

  async function handleCategoryClick(slug: string) {
    if (slug === selectedCategorySlug) return;
    setSelectedCategorySlug(slug);
    await fetchPostsForCategory(slug, isMobile);
  }

  async function fetchPostsForCategory(slug: string, loadAll: boolean) {
    setPostsLoading(true);
    try {
      if (loadAll) {
        // Fetch ALL posts for mobile
        let allPosts: Post[] = [];
        let cursor: string | null = null;
        let nextPage = true;
        do {
          const cat = await getCategoryBySlug(slug, cursor);
          allPosts = [...allPosts, ...(cat?.posts?.nodes ?? [])];
          cursor = cat?.posts?.pageInfo?.endCursor ?? null;
          nextPage = cat?.posts?.pageInfo?.hasNextPage ?? false;
        } while (nextPage && cursor);

        setSelectedCategoryPosts(allPosts);
        setEndCursor(null);
        setHasNextPage(false);
      } else {
        // Desktop: fetch first page
        const cat = await getCategoryBySlug(slug);
        setSelectedCategoryPosts(cat?.posts?.nodes ?? []);
        setEndCursor(cat?.posts?.pageInfo?.endCursor ?? null);
        setHasNextPage(cat?.posts?.pageInfo?.hasNextPage ?? false);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
      setSelectedCategoryPosts([]);
      setEndCursor(null);
      setHasNextPage(false);
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

  return {
    categories,
    selectedCategorySlug,
    selectedCategoryPosts,
    loading,
    postsLoading,
    hasNextPage,
    isMobile,
    handleCategoryClick,
    loadMorePosts,
    setSelectedCategorySlug,
  };
}
