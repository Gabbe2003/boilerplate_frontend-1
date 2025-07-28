// src/app/[slug]/components/InfinitePostFeedClientWrapper.tsx
import { PostWithTOC } from "@/lib/types";
import { SinglePost } from "./SinglePost";

export function InfinitePostFeedClientWrapper({
  initialPost,
}: { initialPost: PostWithTOC }) {
  return <SinglePost initialPost={initialPost} />;
}
