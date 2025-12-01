"use client";

import { useEffect, useState, useCallback } from "react";
import { Post } from "@/lib/types";
import Link from "next/link";
import ReadPeak from "@/components/Ads/Ads/Readpeak/ReadPeak";
import InfiniteScroll from "@/app/[slug]/_components/InfinityScroll/InfiniteScroll";
import Image from "next/image";
import { decodeHTML, stripHtml } from "@/lib/globals/actions";

export default function LatestNewsInfinite() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [batchIndex, setBatchIndex] = useState(1); // start AFTER first batch
  const [hasMore, setHasMore] = useState(true);

  const batchSize = 8;

  /** Fetch posts */
  const fetchPosts = useCallback(async (start: number, end: number) => {
    try {
      const res = await fetch(`/api/getpost?start=${start}&end=${end}`, {
        cache: "no-store",
      });

      const data = await res.json();
      if (!data.success || !data.posts?.length) return [];
      return data.posts as Post[];
    } catch (err) {
      console.error("Error fetching posts:", err);
      return [];
    }
  }, []);

  /** Load next batches */
  const loadMore = async () => {
    if (!hasMore) return;

    const start = batchIndex * batchSize;
    const end = start + batchSize;

    const newPosts = await fetchPosts(start, end);

    if (newPosts.length) {
      setPosts((prev) => [
        ...prev,
        { id: `ad-${batchIndex}`, slug: "", title: "readpeak-slot" } as Post,
        ...newPosts,
      ]);
      setBatchIndex((prev) => prev + 1);
    } else {
      setHasMore(false);
    }
  };

 return (
  <div className="w-full">
    <div className="space-y-6">
      {posts.map((post, index) => {
        
        const isAd = post.title === "readpeak-slot";

        if (isAd) {
          return (
            <div
              key={`ad-${index}`}
              className=" py-4 "
            >
              <ReadPeak numberOfAds={1} />
            </div>
          );
        }

        return (
          <Link
            key={`post-${post.id}-${index}`}
            href={`/${post.slug}`}
            className="block py-8 border-t section4-border-theme-infinity"
          >
           
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">

              {post.featuredImage?.node?.sourceUrl && (
                <div className="
                  w-full h-52 relative overflow-hidden sm:w-40 sm:h-38 
                  aspect-ratio-[16/9]
                  sm:order-2  
                  order-1     
                ">
                  <Image
                    src={post.featuredImage.node.sourceUrl}
                    alt={post.featuredImage.node.altText || post.title || "Post image"}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* TEXT BELOW IMAGE ON MOBILE */}
              <div className="flex-1 sm:order-1 order-2">
                <h3 className="text-xl font-semibold text-white leading-tight mb-2">
                  {post.title}
                </h3>

                <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

            </div>
          </Link>
        );
      })}

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
  </div>
);

}
