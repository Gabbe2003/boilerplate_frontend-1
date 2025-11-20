"use client";

import { Post, ITOCItem } from "@/lib/types";
import PostBodyShell from "../PostBodyShell";
import TableOfConet from "./TableOfContent";

export default function PostBodyClient({
  post,
  contentHtml,
  toc,
}: {
  post: Post;
  contentHtml: string;
  toc: ITOCItem[];
}) {
  const featured = post.featuredImage?.node;

  return (
    <PostBodyShell featured={featured}>
      {Array.isArray(toc) && toc.length > 0 && <TableOfConet toc={toc} />}

      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </PostBodyShell>
  );
}
