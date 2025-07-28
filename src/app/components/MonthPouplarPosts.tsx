'use client';

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AdCard } from "../[slug]/components/adcard";
import { ADS } from "../[slug]/components/adsSideBar";
import FEATURED_IMAGE from "../../../public/next.svg";
import { useAppContext } from "@/store/AppContext";

function PostCard({ post, className = "" }: { post: any; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow border overflow-hidden flex flex-col ${className}`}>
      <div className="relative w-full h-44 sm:h-60 lg:h-72">
        <Image
          src={
            typeof post.featuredImage === "string"
              ? post.featuredImage
              : post.featuredImage?.node?.sourceUrl || FEATURED_IMAGE
          }
          alt={post.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {post.category && (
          <span
            className="uppercase text-xs font-semibold mb-1"
            style={{ color: "#FFB16A" }}
          >
            {post.category}
          </span>
        )}
        <h3 className="text-base font-semibold mb-1">{post.title}</h3>
      </div>
    </div>
  );
}

function AdGridCard({ ad, className = "" }: { ad: any; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-xl flex items-center justify-center min-h-44 sm:min-h-60 lg:min-h-72 p-4 ${className}`}>
      <AdCard ad={ad} />
    </div>
  );
}


export default function PopularNews({ items = [] }) {
  const { tagline } = useAppContext();

  if (!items.length) {
    return <div className="py-8 text-center">No popular posts found.</div>;
  }

  // Split into "top", "bottom", "last" for lg layout
  const topItems = items.slice(0, 4);
  const bottomItems = items.slice(4, 8);
  const lastItem = items[8];

return (
  <section className="w-[89%] mx-auto py-10">
    {tagline && (
      <h1 className="mt-1 text-sm text-gray-500 block mb-4">{tagline}</h1>
    )}
    <div className="flex flex-col gap-10">
      {/* Mobile: 2 columns x4, last full width */}
      <div className="grid grid-cols-2 gap-5 lg:hidden">
        {items.slice(0, 8).map((item, idx) =>
          item.type === "ad" ? (
            <AdGridCard key={`ad-m-${idx}`} ad={ADS[item.adIndex]} />
          ) : (
            <Link href={`/${item.slug}`} key={item.id}>
              <PostCard post={item} />
            </Link>
          )
        )}
        {items[8] && (
          <div className="col-span-2 mt-2">
            {items[8].type === "ad" ? (
              <AdGridCard ad={ADS[items[8].adIndex]} />
            ) : (
              <Link href={`/${items[8].slug}`}>
                <PostCard post={items[8]} />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Desktop: first row, 4 columns */}
      <div className="hidden lg:grid grid-cols-4 gap-8">
        {topItems.map((item, idx) =>
          item.type === "ad" ? (
            <AdGridCard key={`ad-top-${idx}`} ad={ADS[item.adIndex]} />
          ) : (
            <Link href={`/${item.slug}`} key={item.id}>
              <PostCard post={item} />
            </Link>
          )
        )}
      </div>

      {/* Desktop: second row, 5 columns, last item fills last cell if present */}
      <div className="hidden lg:grid grid-cols-5 gap-8">
        {bottomItems.map((item, idx) =>
          item.type === "ad" ? (
            <AdGridCard key={`ad-bot-${idx}`} ad={ADS[item.adIndex]} />
          ) : (
            <Link href={`/${item.slug}`} key={item.id}>
              <PostCard post={item} />
            </Link>
          )
        )}
        {lastItem &&
          (lastItem.type === "ad" ? (
            <AdGridCard key={`ad-last`} ad={ADS[lastItem.adIndex]} />
          ) : (
            <Link href={`/${lastItem.slug}`} key={lastItem.id}>
              <PostCard post={lastItem} />
            </Link>
          ))}
      </div>
    </div>
  </section>
);
};