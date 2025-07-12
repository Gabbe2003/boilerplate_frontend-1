"use client";

import { useRef, useState, useEffect } from "react";
import type { Post } from "@/lib/types";
import type { TOCItem } from "../page";
import { useInfinitePosts } from "./infinitePostHandler";
import PostMain from "./ArticleWithContent";
import PostRecommendations from "./sideBar";
import PostTOC from "./TOCContent";
import EndOfPageRecommendations from "./EndOfPageRecommendations";

interface PostWithTOC extends Post {
  updatedHtml: string;
  toc: TOCItem[];
}

// Utility: strip HTML tags for excerpts
function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

export default function InfinitePostFeed({
  initialPost,
}: {
  initialPost: PostWithTOC;
}) {
  // Infinite scroll logic from custom hook
  const { rendered, loading, sentinelRef } = useInfinitePosts(initialPost);

  // ----- NEW: Per-post alignment logic -----
  const articleRefs = useRef<(HTMLElement | null)[]>([]);
const aboveImageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [aboveImageHeights, setAboveImageHeights] = useState<number[]>([]);



useEffect(() => {
function handleScroll() {
  const articles = articleRefs.current;
  let activeIdx = 0;
  let minTop = Infinity;

  for (let i = 0; i < articles.length; i++) {
    const ref = articles[i];
    if (!ref) continue;
    const rect = ref.getBoundingClientRect();

    // Find the first article whose top is >= 0 (visible in viewport)
    if (rect.top >= 0 && rect.top < minTop) {
      activeIdx = i;
      minTop = rect.top;
    }
  }

  // If at the very bottom, show last article
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 2) {
    activeIdx = articles.length - 1;
  }

  const post = rendered[activeIdx];
  if (post) {
    document.title = post.title || document.title;
    window.history.replaceState(null, post.title || "", `/${post.slug}`);
    const meta = document.querySelector('meta[name="description"]');
    if (meta && post.excerpt) {
      meta.setAttribute("content", stripHtml(post.excerpt));
    }
  }
}


  window.addEventListener("scroll", handleScroll, { passive: true });
  // Call once for initial mount
  handleScroll();
  return () => window.removeEventListener("scroll", handleScroll);
}, [rendered]);


  useEffect(() => {
    setAboveImageHeights(
      rendered.map((_, idx) => aboveImageRefs.current[idx]?.offsetHeight ?? 0)
    );
  }, [rendered]);
  // -----------------------------------------

  return (
    <div className="space-y-16 max-w-7xl mx-auto py-12 px-4 mb-10">
      {rendered.map((post, i) => {
        const postUrl = `${process.env.NEXT_PUBLIC_SHARENAME || "https://yoursite.com"}/news/${post.slug}`;
        const postExcerpt = stripHtml(post.excerpt);

        return (
          <div
      key={post.slug}
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
      data-index={i}
      ref={el => { articleRefs.current[i] = el; }}
    >
      <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
        <PostMain
          post={post}
          postUrl={postUrl}
          postExcerpt={postExcerpt}
          aboveImageRef={el => { aboveImageRefs.current[i] = el; }}
        />

        {/* --- END OF PAGE RECOMMENDATIONS --- */}
        <EndOfPageRecommendations currentSlug={post.slug} />
      </div>

            <aside className="space-y-8">
              {/* Spacer to align TOC with the featured image */}
              <div
                style={{ height: aboveImageHeights[i], minHeight: 0 }}
                className="hidden lg:block"
                aria-hidden="true"
              />
              {/* TOC */}
              <PostTOC toc={post.toc} />

              {/* Recommendations */}
              <PostRecommendations currentSlug={post.slug} />

            </aside>
          </div>
        );
      })}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && <p className="text-center">Downloading more...</p>}
    </div>
  );
}
