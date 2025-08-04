"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { Post } from "@/lib/types";

interface TagPostsProps {
  slug: string;
  initialPosts: Post[];
  initialPageInfo: {
    hasNextPage: boolean;
    endCursor: string;
  };
}

async function fetchMorePosts(slug: string, after: string) {
  const res = await fetch(`/tag?slug=${slug}&after=${after}`);
  if (!res.ok) throw new Error("Failed to load more posts");
  return res.json();
}

function getFirstWords(html: string, wordCount: number) {
  if (!html) return "";
  // Remove HTML tags
  const text = html.replace(/<[^>]+>/g, "");
  // Split into words and take first `wordCount`
  const words = text.split(/\s+/).filter(Boolean).slice(0, wordCount);
  return words.join(" ") + (words.length === wordCount ? "…" : "");
}

export default function TagPosts({ slug, initialPosts, initialPageInfo }: TagPostsProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [loading, setLoading] = useState(false);

  // Intersection Observer hook
  const { ref, inView } = useInView({ threshold: 0, triggerOnce: false });

  // Fetch more when the sentinel comes into view
  React.useEffect(() => {
    if (inView && pageInfo.hasNextPage && !loading) {
      setLoading(true);
      fetchMorePosts(slug, pageInfo.endCursor)
        .then((data) => {
          setPosts((prev) => [...prev, ...data.posts]);
          setPageInfo(data.pageInfo);
        })
        .finally(() => setLoading(false));
    }
  }, [inView, pageInfo.hasNextPage, pageInfo.endCursor, slug, loading]);

 return (
  <>
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {posts.map((post: Post) => (
        <li
          key={post.id}
          className="border rounded-2xl shadow-md hover:shadow-lg transition bg-white flex flex-col overflow-hidden group"
        >
          {/* Image */}
          {post.featuredImage?.node?.sourceUrl ? (
            <Link href={`/${post.slug}`} className="block overflow-hidden">
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || post.title}
                width={600}
                height={176}
                className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-200"
                style={{ background: "#f5f5f5" }}
                priority={false}
              />
            </Link>
          ) : (
            <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          <div className="p-4 flex flex-col flex-1">
            <Link
              href={`/${post.slug}`}
              className="font-bold text-lg mb-1 hover:underline line-clamp-2"
            >
              {post.title}
            </Link>
            <div className="flex items-center justify-between mb-2">
              {/* Author info left */}
              <div className="flex items-center gap-2">
                {post.author?.node?.avatar?.url && (
                  <Image
                    src={post.author.node.avatar.url}
                    alt={post.author.node.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                {post.author?.node && (
                  <Link
                    href={`/author/${post.author.node.slug}`}
                    className="text-xs text-gray-700 hover:underline"
                  >
                    {post.author.node.name}
                  </Link>
                )}
              </div>
              {/* Date right */}
              <span className="text-xs text-gray-500 mr-2">
                {new Date(post.date).toLocaleDateString()}
              </span>
            </div>
            <div className="prose prose-sm text-gray-700 flex-1 line-clamp-4">
              {getFirstWords(post.excerpt ?? "", 20)}
            </div>
          </div>
        </li>
      ))}
    </ul>
    {pageInfo.hasNextPage && (
      <div ref={ref} className="h-10 flex items-center justify-center">
        {loading ? (
          <span className="text-gray-400">Loading more...</span>
        ) : (
          <span className="text-gray-300">Scroll to load more...</span>
        )}
      </div>
    )}
  </>
);
};
