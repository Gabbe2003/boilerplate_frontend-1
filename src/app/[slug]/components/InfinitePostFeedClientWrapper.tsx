// src/app/[slug]/components/InfinitePostFeedClientWrapper.tsx
"use client";
import InfinitePostFeed from "./InfinitePostFeed";
import type { PostWithTOC } from "./InfinitePostFeed";

export default function InfinitePostFeedClientWrapper({
  initialPost,
}: { initialPost: PostWithTOC }) {
  return <InfinitePostFeed initialPost={initialPost} />;
}
