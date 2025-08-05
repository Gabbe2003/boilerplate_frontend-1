"use client"

import { ArticleWithContent } from "./ArticleWithContent";
import { Sidebar } from "./sideBar";
import { PostTOC } from "./TOCContent";
import EndOfPageRecommendations from "./EndOfPageRecommendations";
import { stripHtml } from "@/lib/helper_functions/strip_html";
import type { PostWithTOC } from "@/lib/types";
import { InfinitePosts } from "./infinitePostHandler";
 
export default function InfiniteScrollClient({ initialPost }: { initialPost: PostWithTOC }) {
  const { rendered, loading, sentinelRef, setArticleRef } = InfinitePosts(initialPost);

  // Don't render the initial post (already rendered server-side)
  if (rendered.length <= 1) {
    return <div ref={sentinelRef} style={{ height: 1 }} />;
  }

  return (
    <>
      {rendered.slice(1).map((post, i) => {
        const postUrl = `${process.env.NEXT_PUBLIC_SHARENAME || "https://yoursite.com"}/${post.slug}`;
        const postExcerpt = stripHtml(String(post.excerpt));

        return (
          <div
            key={post.slug}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            data-index={i + 1}
            ref={setArticleRef(i + 1)}
          >
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
              <ArticleWithContent
                post={post}
                postUrl={postUrl}
                postExcerpt={postExcerpt}
                index={i + 1}
              />
              <EndOfPageRecommendations currentSlug={post.slug} />
            </div>
            <aside className="space-y-8">
              <div
                style={{ height: 200, minHeight: 0 }}
                className="hidden lg:block"
                aria-hidden="true"
              />
              <PostTOC toc={post.toc} />
              <Sidebar />
            </aside>
          </div>
        );
      })}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && <p className="text-center">Downloading more...</p>}
    </>
  );
}
