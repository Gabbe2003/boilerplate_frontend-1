"use client";

import { useCallback, useState } from "react";
import type { Post, PostsPage } from "@/lib/types";
import ReadPeak from "@/components/Ads/Ads/Readpeak/ReadPeak";
import InfiniteScroll from "@/app/[slug]/_components/InfinityScroll/InfiniteScroll";
import PostCard from "@/components/Main_page/Popular_posts_section1/_components/PostCard";

const POSTS_PER_PAGE = 8;

interface Props {
  initialPosts: Post[];
  initialEndCursor: string | null;
  initialHasNextPage: boolean;
}

export function ArchiveInfinity({
  initialPosts,
  initialEndCursor,
  initialHasNextPage,
}: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialEndCursor);
  const [hasMore, setHasMore] = useState(initialHasNextPage);

  const loadMore = useCallback(async (): Promise<PostsPage | null> => {
    if (!hasMore) return null;

    try {
      const url = new URL("/api/archive", window.location.origin);
      url.searchParams.set("first", String(POSTS_PER_PAGE));
      url.searchParams.set("after", cursor ?? "null");

      const res = await fetch(url.toString(), {
        cache: "no-store",
        keepalive: true,
      });

      if (!res.ok) {
        console.error("Failed fetch:", await res.text());
        return null;
      }

      const data: PostsPage = await res.json();
      setCursor(data.endCursor);
      setHasMore(data.hasNextPage);
      return data;
    } catch (err) {
      console.error(err);
      return null;
    }
  }, [cursor, hasMore]);

  const handleData = useCallback((data: PostsPage) => {
    if (data.posts.length) {
      setPosts((prev) => [...prev, ...data.posts]);
    }
  }, []);

  return (
    <section className="w-full">
      {/* TRUE 2-COLUMN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {posts.map((post, i) => (
          <div key={i}>
            <PostCard key={post.id ?? post.slug} post={post} />

            {(i + 1) % 8 === 0 && (
              <div className="sm:col-span-2 col-span-1 my-8">
                  <ReadPeak numberOfAds={1} />
                </div>
            )}
          </div>
        ))}

        {/* Infinite scroll sentinel */}
        {hasMore && (
          <div className="col-span-full flex justify-center h-20">
            <InfiniteScroll
              loadMore={loadMore}
              onData={handleData}
              disabled={!hasMore}
              rootMargin="0px 0px 50% 0px"
            />
          </div>
        )}
      </div>
    </section>
  );
}
