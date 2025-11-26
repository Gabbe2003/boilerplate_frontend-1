import "server-only";

import Image from "next/image";
import Link from "next/link";
import { getAllPosts, getTodaysPosts } from "@/lib/graphql_queries/getPost";
import { Post } from "@/lib/types";
import ReadPeak from "@/components/Ads/Ads/Readpeak/ReadPeak";
import {
  capitalizeFirstLetter,
  formatDateStockholm,
  limitExcerpt,
} from "@/lib/globals/actions";
import SignUpNewsLetter from "@/components/Ads/NewsLetter/SignUpNewsLetter";

const ReadPeakAd = () => <ReadPeak />;

export default async function Home() {
  const [posts, todays_right] = await Promise.all([
    getAllPosts(6),
    getTodaysPosts(8),
  ]);

  const left_col: Post[] = posts.slice(0, 3);
  const middle_big: Post = posts[3];
  const middle_rest: Post[] = posts.slice(4);

  return (
    <main className="w-full flex justify-center px-3 sm:px-4 font-serif  bg-[#fcf6f0] pb-[var(--section-spacing)]">
      <div className="base-width-for-all-pages grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <aside className="md:col-span-3 flex flex-col gap-4 order-3 md:order-1">

          {left_col.map((post: Post) => (
            <Link
              key={post.id}
              href={`/${post.slug}`}
              className="py-4 border-b border-[#e8e0d8] "
            >
              <h3 className="font-semibold text-base leading-snug ">
                {post.title}
              </h3>

              <p className="text-xs mt-3">
                {limitExcerpt(post.excerpt, 20)}
              </p>

              <div className="mt-3">
                {post.author?.node?.name && (
                  <p className="text-xs text-red-500">
                    {capitalizeFirstLetter(post.author.node.name)}
                  </p>
                )}
                <p className="text-xs text-[#6f6a63] mt-1">
                  {formatDateStockholm(post.date!)}
                </p>
              </div>
            </Link>
          ))}

          {/* Newsletter pinned bottom */}
          <div className="mt-auto">
            <SignUpNewsLetter variant="compact" />
          </div>

        </aside>

        {/* MIDDLE COLUMN */}
        <section className="md:col-span-6 flex flex-col gap-6 order-1 md:order-2 p-3 border border-[#e8e0d8] bg-white/40">

          {/* Large Article */}
          {middle_big && (
            <Link
              href={`/${middle_big.slug}`}
              className="block overflow-hidden p-3 "
            >
              <div className="relative w-full aspect-[16/9]  overflow-hidden">
                <Image
                  src={middle_big.featuredImage?.node?.sourceUrl!}
                  alt={middle_big.featuredImage?.node?.altText || middle_big.title!}
                  fill
                  className="object-contain "
                />
              </div>

              <div className="pt-3">
                <h2 className="text-lg sm:text-xl font-bold leading-snug ">
                  {middle_big.title}
                </h2>

                <p className="text-sm mt-3 line-clamp-3">
                  {limitExcerpt(middle_big.excerpt, 30)}
                </p>

                <div className="flex justify-between mt-3 text-xs text-[#6f6a63]">
                  <span className="text-red-500">
                    {capitalizeFirstLetter(middle_big.author?.node?.name) ?? ""}
                  </span>
                  <span>{formatDateStockholm(middle_big.date!)}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Middle Rest */}
          <div className="flex flex-col w-full">
            {middle_rest.map((post: Post) => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                className="flex gap-4 py-4 border-t w-full"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-32 sm:w-40 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={post.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
                    alt={post.featuredImage?.node?.altText || post.title!}
                    fill
                    className="object-contain rounded-md"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base leading-snug mb-1 break-words">
                    {post.title}
                  </h3>

                  <p className="text-xs leading-relaxed line-clamp-2 mb-2">
                    {limitExcerpt(post.excerpt)}
                  </p>

                  <div className="flex justify-between items-center text-xs text-[#6f6a63]">
                    <span className="text-red-500">
                      {capitalizeFirstLetter(post.author?.node?.name) ?? ""}
                    </span>
                    <span>{formatDateStockholm(post.date!)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </section>

        {/* RIGHT COLUMN */}
        <aside className="md:col-span-3 flex flex-col gap-6 order-2 md:order-3">

          <div>
            <h2 className="text-lg font-semibold mb-2 text-center sm:text-left">
              Dagens nyheter
            </h2>

            <div className="flex flex-col border-b border-[#e8e0d8]">
              {todays_right.map((post: any) => (
                post && (
                  <Link
                    key={post.id}
                    href={`/${post.slug}`}
                    className="py-4 border-b border-[#e8e0d8] "
                  >
                    <h3 className="font-semibold text-sm leading-snug">
                      {post.title}
                    </h3>
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* ReadPeak pinned bottom */}
          <div className="mt-auto">
            <ReadPeakAd />
          </div>

        </aside>

      </div>
    </main>
  );
}
