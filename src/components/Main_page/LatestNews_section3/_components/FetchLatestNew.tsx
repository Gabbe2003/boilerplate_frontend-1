"use client";

import { useEffect, useState } from "react";
import { Post } from "@/lib/types";
import PostCard from "../../Popular_posts_section1/_components/PostCard";
import Link from "next/link";

export default function FetchLatestNew() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [amount, setAmount] = useState(10);

  async function fetchPosts(amount: number) {
    try {
      const res = await fetch(`/api/getpost?amount=${amount}`, {cache: 'no-store'});
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      if (data.success) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  useEffect(() => {
    fetchPosts(10);
  }, []);

  const handleShowMore = () => {
    const newAmount = amount + 10;
    setAmount(newAmount);
    fetchPosts(newAmount);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2">
        {posts.map((post) => (
            <Link href={`/${post.slug}`} key={`Senaste-nyheter${post.id}`} prefetch={false}>
              <PostCard post={post} variant="hero" className="h-[420px]" />
            </Link>
        ))}
      </div>

      {amount < 100 && (
        <div className="w-full flex items-center justify-center ">
            <button
                onClick={handleShowMore}
                className="custom-button"
            >
                Ladda mer
            </button>
        </div>
      )}
    </div>
  );
}
