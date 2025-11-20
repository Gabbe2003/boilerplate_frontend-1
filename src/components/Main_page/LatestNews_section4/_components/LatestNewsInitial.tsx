import { Post } from "@/lib/types";
import PostCard from "../../Popular_posts_section1/_components/PostCard";
import Link from "next/link";
import { getAllPosts } from "@/lib/graphql_queries/getPost";

export default async function LatestNewsInitial() {
  const posts = await getAllPosts(4)

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
      {posts.map((post) => (
        <Link key={post.id} href={`/${post.slug}`} className="block">
          <PostCard post={post} variant="hero" />
        </Link>
      ))}
    </div>
  );
}
