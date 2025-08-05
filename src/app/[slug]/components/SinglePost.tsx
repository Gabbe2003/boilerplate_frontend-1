// SinglePost.tsx (SERVER COMPONENT!)

import type { PostWithTOC } from "@/lib/types";
import { ArticleWithContent } from "./ArticleWithContent";
import EndOfPageRecommendations from "./EndOfPageRecommendations";
import InfiniteScrollClient from "./InfinitePostClient";
import { update_viewed_post } from "@/lib/graph_queries/update_viewed_post";

// Dynamically import the client component for infinite scroll

export function SinglePost({ initialPost }: { initialPost: PostWithTOC }) {
  const postUrl = `${process.env.NEXT_PUBLIC_SHARENAME || "https://yoursite.com"}/${initialPost.slug}`; // fix later
  const postExcerpt = initialPost.excerpt!.replace(/<[^>]+>/g, "").trim();


  update_viewed_post(String(initialPost.databaseId)); // Update the post view count

  return (
    <div className="space-y-16 max-w-7xl mx-auto py-12 px-4 mb-10">
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start"
        data-index={0}
      >
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
          <ArticleWithContent
            post={initialPost}
            postUrl={postUrl}
            postExcerpt={postExcerpt}
            index={0}
          />
          <EndOfPageRecommendations currentSlug={initialPost.slug} />
        </div>
        <aside className="space-y-8">
          <div
            style={{ height: 200, minHeight: 0 }}
            className="hidden lg:block"
            aria-hidden="true"
          />
        </aside>
      </div>
      {/* The client-only infinite scroll lives here */}
      <InfiniteScrollClient initialPost={initialPost} />
    </div>
  );
}
