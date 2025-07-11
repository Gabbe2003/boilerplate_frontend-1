"use client";

import { useRef, useState, useEffect } from "react";
import type { Post } from "@/lib/types";
import type { TOCItem } from "../page";
import { useInfinitePosts } from "./infinitePostHandler";
import PostMain from "./ArticleWithContent";
import PostRecommendations from "./ReadMorePosts";
import PostTOC from "./TOCContent";

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
  const aboveImageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [aboveImageHeights, setAboveImageHeights] = useState<number[]>([]);

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
            ref={el => (articleRefs.current[i] = el)}
          >
            <PostMain
              post={post}
              postUrl={postUrl}
              postExcerpt={postExcerpt}
              aboveImageRef={el => (aboveImageRefs.current[i] = el)} // <-- Pass a unique ref for each post!
            />

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
