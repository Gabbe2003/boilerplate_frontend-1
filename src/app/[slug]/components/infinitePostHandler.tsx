import { useEffect, useRef, useState } from "react";
import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
import getPosts from "@/lib/graph_queries/getPosts";
import { load } from "cheerio";
import type { Post } from "@/lib/types";
import type { TOCItem } from "../page";

// Helper: Extract headings and TOC from HTML
const extractHeadingsClient = (html: string): { updatedHtml: string; toc: TOCItem[] } => {
  
  const $ = load(html);
  const toc: TOCItem[] = [];
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

export function useInfinitePosts(initialPost: Post & { updatedHtml: string; toc: TOCItem[] }) {
  const [rendered, setRendered] = useState<(Post & { updatedHtml: string; toc: TOCItem[] })[]>([initialPost]);
  const [queue, setQueue] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Initialize queue (on mount)
  useEffect(() => {
    getPosts().then((posts) => {
      const uniqueSlugs = Array.from(new Set(posts.map((p) => p.slug)));
      setQueue(uniqueSlugs.filter((s) => s !== initialPost.slug));
    });
  }, [initialPost.slug]);

  // Infinite scroll observer
  useEffect(() => {
    if (queue.length === 0 || loading) return;
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setLoading(true);
      const nextSlug = queue[0];
      const post = nextSlug ? await getPostBySlug(nextSlug) : null;
      if (post) {
        const { updatedHtml, toc } = extractHeadingsClient(post.content);
        setRendered((prev) =>
          prev.some((p) => p.slug === post.slug)
            ? prev
            : [...prev, { ...post, updatedHtml, toc }]
        );
      }
      setQueue((q) => q.slice(1));
      setLoading(false);
    }, { rootMargin: "200px", threshold: 0.1 });

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [queue, loading]);

  return { rendered, loading, sentinelRef };
}
