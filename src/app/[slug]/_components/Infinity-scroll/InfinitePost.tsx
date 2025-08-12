"use client"

import { ArticleWithContent } from "../ArticleContent";
import EndOfPageRecommendations from "../FooterRecommendations";
import { stripHtml } from "@/lib/helper_functions/strip_html";
import type { PostWithTOC } from "@/lib/types";
import { InfinitePosts } from "./useInfinitePosts";
 
export default function InfiniteScrollClient({ initialPost }: { initialPost: PostWithTOC }) {
  const { rendered, loading, sentinelRef, setArticleRef } = InfinitePosts(initialPost);

  if (rendered.length <= 1) {
    return <div ref={sentinelRef} style={{ height: 1 }} />;
  }

  return (
    <>
      {rendered.slice(1).map((post, i) => {
        const postUrl = `${process.env.NEXT_PUBLIC_HOST_URL || `${process.env.NEXT_PUBLIC_HOST_URL}`}/${post.slug}`;
        const postExcerpt = stripHtml(String(post.excerpt));

        return (
          <div
            key={post.slug}
            className="w-full grid grid-cols-1 lg:grid-cols- gap-8 items-start"
            data-index={i + 1}
            ref={setArticleRef(i + 1)}
          >
              <div className="col-span-1 lg:col-span-2 flex flex-col gap-8 ">
              <ArticleWithContent
                post={post}
                postUrl={postUrl}
                postExcerpt={postExcerpt}
                index={i + 1}
              />
              <EndOfPageRecommendations currentSlug={post.slug} />
            </div>
            <aside className="hidden lg:block space-y-8 lg:col-span-1 bg-[var(--secBG)] px-0 sm:px-2">
            <div
              style={{ height: 0, minHeight: 0 }}
              className="hidden lg:block"
              aria-hidden="true"
            />
          </aside>
          </div>
        );
      })}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && <p className="text-center">Downloading more...</p>}
    </>
  );
}
