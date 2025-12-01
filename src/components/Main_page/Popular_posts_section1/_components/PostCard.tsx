
import Image from "next/image";
import { Post } from "@/lib/types";
import { limitExcerpt, stripHtml } from "@/lib/globals/actions";
import Link from "next/link";

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
return (
  <Link
    href={`/${post.slug}`}
    className={`
      group block overflow-hidden rounded-lg  
     ${className}
    `}
  >
    {/* IMAGE */}
    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md">
      {imgSrc ? (
        <Image
          src={imgSrc}
          overrideSrc={imgSrc}
          alt={alt}
          fill
          sizes="(max-width:1024px) 100vw, 50vw"
          className="
            object-cover 
          "
          priority
        />
      ) : (
        <div className="aspect-[16/9] w-full bg-gray-200" />
      )}
    </div>

    {/* TEXT CONTENT */}
    <div className="mt-3 space-y-1.5">

      {/* CATEGORY */}
      {cat && (
        <span className="block text-[11px] font-bold uppercase tracking-[0.15em] text-rose-700">
          {cat}
        </span>
      )}

      {/* TITLE */}
      <h3 className="
        text-[20px] leading-tight font-semibold text-gray-900 
        group-hover:text-black transition-colors
      ">
        {post.title}
      </h3>

      {/* EXCERPT */}
      {post.excerpt && (
        <p className="text-[14px] text-gray-600 leading-snug line-clamp-2">
          {limitExcerpt(post.excerpt, 25)}
        </p>
      )}
    </div>
  </Link>
);

}
