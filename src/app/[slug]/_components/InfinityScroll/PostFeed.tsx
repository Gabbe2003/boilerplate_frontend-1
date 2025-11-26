"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Post, PostBySlugResult } from "@/lib/types";
import PostHero from "../_post/PostHero";
import PostBodyClient from "../_post/PostBodyClient";
import InfiniteScroll from "./InfiniteScroll";
import RecommendationRail from "../Postheader&footer/RecommendationRail";

type FeedItem = PostBySlugResult & { recs: Post[] };

async function fetchNextPost(slug: string): Promise<PostBySlugResult | null> {
  if (!slug) return null;
  const res = await fetch(`/api/getPostBySlug?slug=${encodeURIComponent(slug)}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  const { post, updatedHtml, toc } = json || {};
  if (!post) return null;
  return { post, updatedHtml: updatedHtml ?? "", toc: Array.isArray(toc) ? toc : [] };
}

async function fetchNextRecommendation(currentSlug: string): Promise<Post[]> {
  if (!currentSlug) return [];
  const res = await fetch(`/api/recommendations?slug=${encodeURIComponent(currentSlug)}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) return [];
  const payload = await res.json();
  const maybe = payload?.posts ?? payload?.data ?? payload;
  return Array.isArray(maybe) ? (maybe as Post[]) : [];
}

export default function PostFeed({
  initialPost,
  slugQueue,
  currentSlug,
}: {
  initialPost: Post;
  slugQueue: string[];
  currentSlug: string;
}) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const indexRef = useRef(0);
  const [hasMore, setHasMore] = useState(slugQueue.length > 0);

  // Keep this dense; we only ever read from it
  const articleRefs = useRef<HTMLElement[]>([]);
  const lastSlugRef = useRef<string | null>(null);

  // Initialize last slug once to avoid needless replaceState on mount.
  useEffect(() => {
    lastSlugRef.current = currentSlug || initialPost?.slug || null;
  }, [currentSlug, initialPost?.slug]);

  const loadMore = useCallback(async () => {
    const i = indexRef.current;
    if (i >= slugQueue.length) {
      setHasMore(false);
      return null;
    }
    const nextSlug = slugQueue[i];
    indexRef.current = i + 1;
    if (indexRef.current >= slugQueue.length) setHasMore(false);

    const [postRes, recs] = await Promise.all([
      fetchNextPost(nextSlug),
      fetchNextRecommendation(nextSlug),
    ]);

    if (!postRes) return null;
    return { ...postRes, recs } as FeedItem;
  }, [slugQueue]);

  // Log view when new post appended
  useEffect(() => {
    if (items.length === 0) return;
    const last = items[items.length - 1].post;
    const databaseId = last?.databaseId;
    if (!databaseId) return;
    fetch("/api/log-view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ databaseId }),
      cache: "no-store",
      keepalive: true,
    }).catch(() => { });
  }, [items]);

  // -----------------------------
  // URL + Title updater on scroll
  // -----------------------------
  useEffect(() => {
    if (!initialPost) return;

    const OFFSET = 8; // px from top where a section "counts" as active
    let raf = 0;

    const computeActive = () => {
      // Default/fallback = initial post at the very top region.
      let activeSlug = initialPost.slug;
      let activeTitle = initialPost.title ?? document.title;
      let maxTop = -Infinity;

      const nodes = articleRefs.current;
      for (let i = 0; i < nodes.length; i++) {
        const el = nodes[i];
        if (!el) continue;
        const { top } = el.getBoundingClientRect();

        // choose the last element whose top is at or above the top (with small offset)
        if (top <= OFFSET && top > maxTop) {
          maxTop = top;
          activeSlug = el.dataset.slug || activeSlug;
          activeTitle = el.dataset.title || activeTitle;
        }
      }

      return { activeSlug, activeTitle };
    };

    const applyActive = () => {
      const { activeSlug, activeTitle } = computeActive();
      if (!activeSlug) return;

      if (lastSlugRef.current !== activeSlug) {
        const newUrl = activeSlug.startsWith("/") ? activeSlug : `/${activeSlug}`;
        // URL first to keep back/forward semantics consistent
        window.history.replaceState(null, "", newUrl);
        if (activeTitle) document.title = activeTitle;
        lastSlugRef.current = activeSlug;
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        applyActive();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Trigger once when items change so the active state is correct after appends.
    applyActive();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [items, initialPost]);

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="w-full space-y-10">
      {items.map(({ post, updatedHtml, toc, recs }, index) => (
        <article
          key={post?.databaseId ?? post?.slug ?? index}
          ref={(el) => {
            if (el) {
              articleRefs.current[index] = el;
            }
          }}
          data-slug={post?.slug}
          data-title={post?.title}
          className="w-full"
        >
          <PostHero
            title={post.title}
            author={post.author}
            date={post.date}
            excerpt={post.excerpt}
            uri={post.uri}
            featured={post.featuredImage}
            modified={post.modified}
          />
          <main>
            <PostBodyClient post={post} contentHtml={updatedHtml} toc={toc} />
            {recs?.length ? (
              <div className="mt-10">
                <RecommendationRail posts={recs} />
              </div>
            ) : null}
          </main>
        </article>
      ))}

      <InfiniteScroll<FeedItem>
        rootMargin="0px 0px 50% 0px"
        loadMore={loadMore}
        onData={(item) => item && setItems((prev) => [...prev, item])}
        disabled={!hasMore}
      />
    </div>
  );
}
