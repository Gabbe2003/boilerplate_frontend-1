import { useEffect, useState } from "react";
import { CategoryWithPosts, Post } from "@/lib/types";

export function useCategoryPosts(category: string, take = 6) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      try {
        const res = await fetch(`/api/categories?category=${encodeURIComponent(category)}&take=${take}`);
        if (!res.ok) throw new Error("Failed request");

        const data: CategoryWithPosts | null = await res.json();
        if (!cancelled) setPosts(data?.posts.nodes ?? []);
      } catch {
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true };
  }, [category, take]);

  return { posts, loading };
}
