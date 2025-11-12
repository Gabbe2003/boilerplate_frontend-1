"use client";

import { useEffect, useState, useCallback } from "react";
import { Post } from "@/lib/types";
import PostCard from "../../Popular_posts_section1/_components/PostCard";
import Link from "next/link";
import ReadPeak from "@/components/Ads/Ads/Readpeak/ReadPeak";
import InfiniteScroll from "@/app/[slug]/_components/InfinityScroll/InfiniteScroll";

export default function FetchLatestNew() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const batchSize = 8; // 🔹 number of posts to fetch per scroll

  /** 🔹 Fetch posts from API */
  const fetchPosts = useCallback(async (pageToFetch: number) => {
    try {
      const res = await fetch(`/api/getpost?page=${pageToFetch}&amount=${batchSize}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (!data.success || !data.posts?.length) {
        setHasMore(false);
        return [];
      }
      return data.posts as Post[];
    } catch (err) {
      console.error("Error fetching posts:", err);
      setHasMore(false);
      return [];
    }
  }, []);

  /** 🔹 Load initial batch */
  useEffect(() => {
    (async () => {
      const initial = await fetchPosts(1);
      if (initial.length) setPosts(initial);
      setPage(2);
    })();
  }, [fetchPosts]);

  /** 🔹 Load more on scroll */
  const loadMore = async () => {
    if (!hasMore) return null;

    const newPosts = await fetchPosts(page);
    if (newPosts.length) {
      setPosts((prev) => [
        ...prev,
        { id: `ad-${page}`, slug: "", title: "readpeak-slot" } as unknown as Post,
        ...newPosts,
      ]);
      setPage((p) => p + 1);
    } else {
      setHasMore(false);
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
  {posts.map((post, index) => {
    const isAd = post.title === "readpeak-slot";

    if (isAd) {
      return (
        <div
          key={`ad-${index}`}
          className="sm:col-span-2 rounded-md bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="relative w-full">
            <ReadPeak numberOfAds={1} />
          </div>
        </div>
      );
    }

    return (
      <Link
        href={`/${post.slug}`}
        key={`post-${post.id}-${index}`}
        prefetch={false}
        className="block"
      >
        <PostCard post={post} variant="hero" className="h-[420px]" />
      </Link>
    );
  })}
</div>




      {/* Infinite scroll trigger */}
      {hasMore && (
        <InfiniteScroll
          loadMore={loadMore}
          onData={() => {}}
          rootMargin="0px 0px 300px 0px"
        />
      )}

      {!hasMore && (
        <div className="text-center text-gray-500 text-sm py-4">
          Alla nyheter har laddats
        </div>
      )}
    </div>
  );
}
