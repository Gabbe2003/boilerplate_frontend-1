
import Image from "next/image";
import { Post } from "@/lib/types";
import { limitExcerpt, stripHtml } from "@/lib/globals/actions";

type PostCardProps = {
  post: Post;                 // <-- single post
  className?: string;
  variant?: "default" | "hero";
};

export default function PostCard({ post, className = "", variant = "default" }: PostCardProps) {
  const img = post.featuredImage?.node;
  const imgSrc: string | undefined = img?.sourceUrl;
  const alt = img?.altText || stripHtml(post.title || "");
  const cat = post.category?.nodes?.[0]?.name ?? "";

  if (variant === "hero") {
    
    return (
      <article className={`relative overflow-hidden ${className}`}>
        <div className="relative w-full aspect-[4/3] overflow-hidden">
        {/* <div className="relative w-full aspect-[16/9] overflow-hidden"> */}
          {imgSrc ? (
            <Image
              src={imgSrc}
              overrideSrc={imgSrc}
              alt={alt}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="aspect-[16/9] w-full bg-gray-200" />
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6">
          {cat && (
            <span className="mb-2 inline-block rounded bg-white/90 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-900">
              {cat}
            </span>
          )}
          <h3 className="text-1xl  !text-white font-extrabold leading-tight line-clamp-2 !mt-1">
            {post.title}
          </h3>
          {post.excerpt && (
            <p className="mt-2 text-white/90 line-clamp-2 text-xs sm:text-md">{limitExcerpt(post.excerpt, 22)}</p>
          )}
        </div>
      </article>
    );
  }

  // default card (like your small teasers)
  return (
    <article className={`overflow-hidden ${className}`}>
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md">
          {imgSrc ? (
            <Image
              src={imgSrc}
              overrideSrc={imgSrc}
              alt={alt}
              fill
              sizes="(max-width:1024px) 100vw, 50vw"
              className="object-contain"
              priority
            />
          ) : (
            <div className="aspect-[16/9] w-full bg-gray-200" />
          )}
        </div>

      <div className="mt-2">
        {cat && (
          <span className="block text-[11px] font-extrabold uppercase tracking-widest text-rose-700">
            {cat}
          </span>
        )}
        <h3 className="text-[18px] font-semibold leading-snug text-gray-900 !m-0">{post.title}</h3>
        {post.excerpt && (
          <p className="mt-1 text-sm text-gray-700 line-clamp-2">{limitExcerpt(post.excerpt, 18)}</p>
        )}
      </div>
    </article>
  );
}
