import Image from "next/image";
import TableOfConet from "./TableOfContent";
import type { ITOCItem, Post } from "@/lib/types";
import RecommendationRail from "../Postheader&footer/RecommendationRail";
import { getRecommendation } from "@/lib/graphql_queries/getPost";

export default async function PostBody({
  post,
  contentHtml,
  toc,
}: {
  post: Post;
  contentHtml: string ;
  toc: ITOCItem[];
}) {
  const featured = post.featuredImage?.node;
  const w = featured?.mediaDetails?.width ?? 0;
  const h = featured?.mediaDetails?.height ?? 0;
  const sizes = w ? `${Math.min(w, 1200)}px` : "(min-width: 768px) 768px, 100vw";

  const posts = await getRecommendation({excludeSlug: post.slug})

  return (
    <article className="w-full">
      {featured?.sourceUrl && (
        <figure className="mb-6 mx-auto" style={w ? { maxWidth: `${w}px` } : undefined}>
          <Image
            src={featured.sourceUrl}
            alt={featured.altText || post.title || ""}
            width={w || 1200}
            height={h || 630}
            sizes={sizes}
            quality={85}
            className="block w-full h-auto rounded-2xl"
            priority
          />
        </figure>
      )}

      <TableOfConet toc={toc} />

      <div
        className="
          prose prose-neutral dark:prose-invert
          break-words
          [&_pre]:break-all
          [&_pre]:whitespace-pre-wrap
          [&_pre]:overflow-x-auto
          [&_code]:break-all
          prose-sm
          w-[80%] 
          
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-a:no-underline hover:prose-a:underline
          prose-a:visited:text-blue-700 dark:prose-a:visited:text-blue-500

          [&_h2]:mb-3
          [&_h3]:mb-5
          [&_h4]:mt-4
        "
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />

      <div className="mt-10">
        <RecommendationRail posts={posts} />
      </div>
    </article>
  );
}
