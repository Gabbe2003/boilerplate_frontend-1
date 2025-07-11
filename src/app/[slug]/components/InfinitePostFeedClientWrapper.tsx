// src/app/[slug]/components/InfinitePostFeedClientWrapper.tsx
"use client";
import { PostWithTOC } from "@/lib/types";
import InfinitePostFeed from "./SinglePost";

export default function InfinitePostFeedClientWrapper({
  initialPost,
}: { initialPost: PostWithTOC }) {
  return <InfinitePostFeed initialPost={initialPost} />;
}
