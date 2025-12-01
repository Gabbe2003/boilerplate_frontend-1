/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import Link from "next/link";
import { memo } from "react";
import { limitExcerpt } from "@/lib/globals/actions";

export const CategoryPostCard = memo(function CategoryPostCard({ post, index, showRightBorder }: any) {
  const imageAspect = index < 4
    ? "aspect-[4/3] sm:aspect-[16/10] lg:w-[280px]"
    : "aspect-[4/3] sm:aspect-[16/10] lg:w-[320px]";

  return (
    <li
      className={`
        ${index < 4 ? "col-span-1" : "col-span-1 lg:col-span-2"}
        flex h-full 
        transition-shadow  
        ${index >= 4 ? "flex-col lg:flex-row lg:gap-4" : "flex-col"}
        ${showRightBorder ? "lg:border-r lg:pr-6 border-[#e3d7cc]" : ""}
      `}
    >
      <Link
        href={`/${post.slug}`}
        className={`
          flex h-full w-full 
          ${index >= 4 ? "flex-col lg:flex-row lg:gap-4" : "flex-col"}
          cursor-pointer
        `}
      >
        {/* IMAGE */}
        <div
          className={`
            relative 
            overflow-hidden 
            flex items-start justify-center 
            w-full max-w-full
            ${imageAspect}
          `}
        >
          <Image
            src={post.featuredImage?.node?.sourceUrl || "/favicon.ico"}
            alt={post.featuredImage?.node?.altText || post.title}
            fill
            className="object-cover object-center"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
            priority={index === 0}
          />
        </div>

        {/* TEXT */}
        <div className={`py-4 flex flex-col justify-between ${index >= 4 ? "lg:flex-1" : ""}`}>
          <h3 className="font-semibold text-base leading-snug line-clamp-2">
            {post.title}
          </h3>

          <p className="mt-2 text-sm leading-snug line-clamp-6">
            {index >= 4
              ? limitExcerpt(post.excerpt, 40)
              : limitExcerpt(post.excerpt)}
          </p>
        </div>
      </Link>
    </li>
  );
});
