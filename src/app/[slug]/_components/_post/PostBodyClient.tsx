// components/_post/PostBodyClient.tsx
"use client";

import Image from "next/image";
import TableOfConet from "./TableOfContent";
import type { Post, ITOCItem } from "@/lib/types";

type Props = {
  post: Post;
  contentHtml: string;
  toc: ITOCItem[] | null | undefined;
};

export default function PostBodyClient({ post, contentHtml, toc }: Props) {
  const featured = post.featuredImage?.node;
  const w = featured?.mediaDetails?.width ?? 0;
  const h = featured?.mediaDetails?.height ?? 0;
  const sizes = w ? `${Math.min(w, 1200)}px` : "(min-width: 768px) 768px, 100vw";

  return (
    <article className="w-full">
      {featured?.sourceUrl && (
        <figure
          className="mb-6 mx-auto"
          style={w ? { maxWidth: `${w}px` } : undefined}
        >
          <Image
            src={featured.sourceUrl}
            alt={featured.altText || post.title || ""}
            width={w || 1200}
            height={h || 630}
            sizes={sizes}
            quality={85}
            className="block w-full h-auto rounded-2xl"
            // Do NOT set priority for infinite-scroll items
          />
        </figure>
      )}

      {Array.isArray(toc) && toc.length > 0 ? <TableOfConet toc={toc} /> : null}

      <div
        className="
          prose prose-neutral dark:prose-invert
          break-words
          [&_pre]:break-all
          [&_pre]:whitespace-pre-wrap
          [&_pre]:overflow-x-auto
          [&_code]:break-all
          prose-sm
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-a:no-underline hover:prose-a:underline
          prose-a:visited:text-blue-700 dark:prose-a:visited:text-blue-500
        "
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </article>
  );
}
