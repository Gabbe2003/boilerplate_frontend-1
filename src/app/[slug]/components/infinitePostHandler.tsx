"use client";


import { useEffect, useRef, useState, useCallback } from "react";
import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
import { getPosts } from "@/lib/graph_queries/getRecommendationPost";
import { load } from "cheerio";
import type { ITOCItem, Post } from "@/lib/types";

const extractHeadingsClient = (html: string): { updatedHtml: string; toc: ITOCItem[] } => {
  const $ = load(html);
  const toc: ITOCItem[] = [];
  $("h2, h3, h4, h5, h6").each((_, el) => {
    const $el = $(el);
    const tag = el.tagName.toLowerCase();
    const level = parseInt(tag.charAt(1), 10);
    const text = $el.text().trim();
    const id = $el.attr("id") || text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    $el.attr("id", id);
    toc.push({ text, id, level });
  });
  return { updatedHtml: $.root().html()!, toc };
};

export function InfinitePosts(initialPost: Post & { updatedHtml: string; toc: ITOCItem[] }) {
  const [rendered, setRendered] = useState([initialPost]);
  const [queue, setQueue] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const articleRefs = useRef<Array<HTMLElement | null>>([]);
  const lastSlugRef = useRef<string | null>(initialPost.slug); // initialized correctly here

  const setArticleRef = useCallback(
    (idx: number) => (el: HTMLElement | null) => {
      articleRefs.current[idx] = el;
    },
    []
  );

  useEffect(() => {
    let mounted = true;
    getPosts().then((posts) => {
      if (!mounted) return;
      const uniqueSlugs = Array.from(new Set(posts.map((p) => p.slug)));
      setQueue(uniqueSlugs.filter((s) => s !== initialPost.slug));
    });
    return () => {
      mounted = false;
    };
  }, [initialPost.slug]);

  useEffect(() => {
    if (queue.length === 0 || loading) return;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setLoading(true);
      const nextSlug = queue[0];
      let post: Post | null = null;
      try {
        if (nextSlug) post = await getPostBySlug(nextSlug);
        if (post) {
          const { updatedHtml, toc } = extractHeadingsClient(post.content);
          setRendered((prev) =>
            prev.some((p) => p.slug === post.slug)
              ? prev
              : [...prev, { ...post, updatedHtml, toc }]
          );
        }
      } finally {
        setQueue((q) => q.slice(1));
        setLoading(false);
      }
    }, { rootMargin: "200px", threshold: 0.1 });

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [queue, loading]);
 useEffect(() => {
  if (rendered.length === 0) return;

  let ticking = false;

  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const articles = articleRefs.current;
        let selectedIdx = 0;

        // When at the very top, always select first
        if (window.scrollY === 0) {
          selectedIdx = 0;
        } else {
          let maxTop = -Infinity;
          for (let i = 0; i < articles.length; i++) {
            const ref = articles[i];
            if (!ref) continue;
            const rect = ref.getBoundingClientRect();
            // Find the topmost article that is above or at the top of the viewport
            if (rect.top <= 0 && rect.top > maxTop) {
              maxTop = rect.top;
              selectedIdx = i;
            }
          }
        }

        const selectedPost = rendered[selectedIdx];
        if (selectedPost && lastSlugRef.current !== selectedPost.slug) {
          window.history.replaceState(null, "", `/${selectedPost.slug}`);
          document.title = selectedPost.title;
          lastSlugRef.current = selectedPost.slug;
        }

        ticking = false;
      });
      ticking = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  setTimeout(handleScroll, 100); // Initial load
  return () => window.removeEventListener("scroll", handleScroll);
}, [rendered]);


  return { rendered, loading, sentinelRef, setArticleRef };
}
