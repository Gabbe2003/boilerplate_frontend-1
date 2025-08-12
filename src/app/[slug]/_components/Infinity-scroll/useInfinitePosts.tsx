import { useEffect, useRef, useState, useCallback } from "react";
import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
import { getPosts } from "@/lib/graph_queries/getRecommendationPost";
import type { ITOCItem, Post, PostWithTOC } from "@/lib/types";

/**
 * Lightweight, browser-native heading extraction (no cheerio needed in the client).
 */
function extractHeadingsClient(html: string): { updatedHtml: string; toc: ITOCItem[] } {
  const doc = new DOMParser().parseFromString(html || "", "text/html");
  const toc: ITOCItem[] = [];
  const headings = doc.querySelectorAll("h2, h3, h4, h5, h6");

  headings.forEach((el) => {
    const level = Number(el.tagName.slice(1));
    const text = (el.textContent || "").trim();
    const id =
      el.id ||
      text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
    el.id = id;
    toc.push({ text, id, level });
  });

  return { updatedHtml: doc.body.innerHTML, toc };
}

/**
 * Single place that owns state + IO for infinite posts.
 * IMPORTANT: This file has no `"use client"`. It is imported by a client component,
 * which is enough for Next to include it in the client bundle.
 */
export function InfinitePosts(initialPost: PostWithTOC & { updatedHtml?: string; toc?: ITOCItem[] }) {
  const [rendered, setRendered] = useState<Array<PostWithTOC>>([
    // ensure the initial post is first
    initialPost,
  ]);

  const [queue, setQueue] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const articleRefs = useRef<Array<HTMLElement | null>>([]);
  const lastSlugRef = useRef<string>(initialPost.slug);
  const inFlightRef = useRef<AbortController | null>(null);

  const setArticleRef = useCallback(
    (idx: number) => (el: HTMLElement | null) => {
      articleRefs.current[idx] = el;
    },
    []
  );

  // Build the queue once (exclude the initial slug)
  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    (async () => {
      try {
        const posts = await getPosts();
        if (!mounted) return;
        const uniqueSlugs = Array.from(new Set(posts.map((p) => p.slug)));
        setQueue(uniqueSlugs.filter((s) => s !== initialPost.slug));
      } catch {
        // noop (optionally report)
      }
    })();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [initialPost.slug]);

  // IntersectionObserver to fetch the next post
  useEffect(() => {
    if (queue.length === 0 || loading) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect(); // one-shot until we finish this load

        if (inFlightRef.current) return; // guard

        const nextSlug = queue[0];
        if (!nextSlug) return;

        const controller = new AbortController();
        inFlightRef.current = controller;
        setLoading(true);

        try {
          const post = await getPostBySlug(nextSlug);
          if (post) {
            const { updatedHtml, toc } = extractHeadingsClient(String(post.content ?? ""));
            setRendered((prev) =>
              prev.some((p) => p.slug === post.slug)
                ? prev
                : [
                    ...prev,
                    {
                      ...(post as Post),
                      // keep shape compatible with PostWithTOC consumer
                      updatedHtml,
                      toc,
                    } as PostWithTOC,
                  ]
            );
          }
        } catch {
          // noop (optionally report)
        } finally {
          setQueue((q) => q.slice(1));
          setLoading(false);
          inFlightRef.current?.abort();
          inFlightRef.current = null;
        }
      },
      {
        root: null,
        rootMargin: "800px 0px 800px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [queue, loading]);

  // Scroll -> URL + title sync
  useEffect(() => {
    if (rendered.length === 0) return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const articles = articleRefs.current;
        let selectedIdx = 0;

        if (window.scrollY !== 0) {
          let maxTop = -Infinity;
          for (let i = 0; i < articles.length; i++) {
            const ref = articles[i];
            if (!ref) continue;
            const rect = ref.getBoundingClientRect();
            if (rect.top <= 0 && rect.top > maxTop) {
              maxTop = rect.top;
              selectedIdx = i;
            }
          }
        }

        const selectedPost = rendered[selectedIdx];
        if (selectedPost && lastSlugRef.current !== selectedPost.slug) {
          window.history.replaceState(null, "", `/${selectedPost.slug}`);
          if (selectedPost.title) document.title = selectedPost.title;
          lastSlugRef.current = selectedPost.slug;
        }

        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    setTimeout(handleScroll, 100); // initial kick
    return () => window.removeEventListener("scroll", handleScroll);
  }, [rendered]);

  return { rendered, loading, sentinelRef, setArticleRef };
}
