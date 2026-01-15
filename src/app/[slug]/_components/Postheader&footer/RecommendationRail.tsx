"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

import { Post } from "@/lib/types";
import { handleSpecielChar } from "@/lib/globals/actions";
import ReadPeak from "@/components/Ads/Ads/Readpeak/ReadPeak";

interface Props {
  posts: Post[];
}

/**
 * Editorial post rendered in the SAME visual style as ads
*/
const AdStylePost = ({ post }: { post: Post }) => {
  return (
    <Link
      href={handleSpecielChar(post.slug || "")}
      prefetch={false}
      className="group flex flex-col w-[224px] flex-shrink-0"
    >
      {/* Image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={post.featuredImage?.node?.sourceUrl || "/full_logo_with_slogan.png"}
          alt={post.featuredImage?.node?.altText || ""}
          fill
          className="object-cover"
          sizes="240px"
        />
      </div>

      {/* Content */}
      <div className="pt-3 space-y-1">
        {/* Category */}
        {post.categories?.nodes?.[0]?.name && (
          <div className="text-[11px] uppercase tracking-wide font-semibold text-red-600">
            {post.categories.nodes[0].name}
          </div>
        )}

        {/* Title */}
        <h3 className="text-[17px] font-semibold leading-snug text-neutral-900">
          {post.title}
        </h3>
      </div>
    </Link>
  );
};

export default function RecommendationRow({ posts }: Props) {
  // Only use first 3 posts
  const items = useMemo(() => posts.slice(0, 3), [posts]);

  if (items.length < 3) return null;

  return (
    <section className="w-full mx-auto mb-20">
{/* Horizontal row wrapper */}
<div className="bg-[#f6efe7] rounded-2xl px-4 sm:px-6 py-2">
  <div
    className="
      flex items-start gap-8
      overflow-x-auto
      py-4
      scrollbar-hide
    "
  >
    <AdStylePost post={items[0]} />

    <ReadPeak />

    <AdStylePost post={items[1]} />

    <ReadPeak />

    <AdStylePost post={items[2]} />
  </div>
</div>

    </section>
  );
}
