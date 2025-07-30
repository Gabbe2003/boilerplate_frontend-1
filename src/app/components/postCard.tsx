import Image from "next/image";
import { Post } from "@/lib/types";


function getExcerpt(text?: string, words = 15) {
  if (!text) return "";
  const arr = text.split(/\s+/);
  return arr.length > words ? arr.slice(0, words).join(" ") + "…" : text;
}

export interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className = "" }: PostCardProps) {
    console.log(post)
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="relative w-full h-[140px] mb-2">
        <Image
          src={post.featuredImage || 'No Image Found'}
          alt={post.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover" // No border radius!
          priority={false}
        />
      </div>
      {post.category && (
        <span className="text-[11px] uppercase text-gray-400 font-medium mb-1 tracking-wide">
          {post.category}
        </span>
      )}
      <h2 className="font-semibold text-base text-gray-900 mb-1 leading-tight">{post.title}</h2>
      {post.excerpt && (
        <p className="text-sm text-gray-700 leading-snug">{getExcerpt(post.excerpt, 15)}</p>
      )}
    </div>
  );
}
