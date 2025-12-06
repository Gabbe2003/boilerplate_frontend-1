/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";

import Image from "next/image";
import Link from "next/link";
import { getAllPosts, getPostsByPeriod } from "@/lib/graphql_queries/getPost";
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
    getPostsByPeriod("week"),
  ]) as [Post[], Post[]];
  
  const left_col: Post[] = posts.slice(0,5);
  const middle_big: Post = posts[3];
  const middle_rest: Post[] = posts.slice(4);
  const post_right = todays_right?.slice(0,6) ?? [];

  return (
    <main className="section1-border-theme w-full flex justify-center font-serif pt-5  pb-(--section-spacing)">
      <div className=" grid grid-cols-1 md:grid-cols-12 gap-6 base-width-for-all-pages">

        {/* LEFT COLUMN */}
        <aside className="md:col-span-3 flex flex-col gap-4 order-3 md:order-1">
          <h2 className="text-lg font-semibold mb-2 text-center sm:text-left">
              Senaste nyheter
            </h2>
          {left_col.map((post: Post) => (
            <Link
              key={post.id}
              href={`/${post.slug}`}
              className="group py-4 border-b"
            >
              <h3 className="font-semibold text-base leading-snug group-hover:underline group-hover:decoration-2 group-hover:decoration-offset-2">
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
<section className="md:col-span-6 flex flex-col gap-6 order-1 md:order-2 p-0 sm:p-2 border-0 md:border md:border-[#e4d8ce]">
  <h2 className="text-center items-center text-2xl">
    Dagliga nyheter inom finans, aktier och börsen
  </h2>

  {/* Large Article */}
  {middle_big && (
    <Link
      href={`/${middle_big.slug}`}
      className="group block overflow-hidden p-0 sm:p-2"
    >
      <div className="relative w-full aspect-[4/3] overflow-hidden flex items-center justify-center">
        <Image
          src={middle_big.featuredImage?.node?.sourceUrl || "/favicon.ico"}
          alt={middle_big.featuredImage?.node?.altText || middle_big.title!}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 700px"
        />
      </div>

      <div className="pt-6">
        <h2 className="text-lg sm:text-xl font-bold leading-snug group-hover:underline group-hover:decoration-2 group-hover:decoration-offset-2">
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
                className="
                  group
                  flex flex-col lg:flex-row 
                  gap-4 
                  py-4 
                  border-t 
                  w-full
                "
              >
                {/* Image */}
                <div
                  className="
                    relative 
                    w-full lg:w-40 
                    aspect-4/3
                    lg:aspect-video
                    overflow-hidden 
                    flex items-center justify-center
                  "
                >
                  <Image
                    src={post.featuredImage?.node?.sourceUrl || "/favicon.ico"}
                    alt={post.featuredImage?.node?.altText || post.title!}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 160px"
                  />
                </div>

                {/* Text */}
                <div className="flex flex-col flex-1 min-w-0">
                  <h3 className="font-semibold text-sm sm:text-base leading-snug mb-1 break-words group-hover:underline group-hover:decoration-2 group-hover:decoration-offset-2">
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
              Populära nyheter
            </h2>

            <div className="flex flex-col border-b border-[#e4d8ce]">
              {post_right.map((post: any) => (
                post && (
                  <Link
                    key={post.id}
                    href={`/${post.slug}`}
                    className="
                      group 
                      flex flex-col sm:flex-row 
                      gap-3 
                      py-4 
                      border-b
                    "
                  >
                    <div
                      className="
                        relative 
                        w-full sm:w-28 
                        aspect-[4/3] 
                        overflow-hidden 
                        bg-[#f7f1ea]
                      "
                    >
                      <Image
                        src={post.featuredImage?.node?.sourceUrl || "/favicon.icon"}
                        alt={post.featuredImage?.node?.altText || post.title!}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-[1.13]"
                        sizes="(max-width: 640px) 100vw, 112px"
                      />
                    </div>

                    <div className="flex-1 flex flex-col min-w-0">
                      <h3 className="font-semibold text-sm leading-snug mb-1 break-words group-hover:underline group-hover:decoration-2 group-hover:decoration-offset-2">
                        {post.title}
                      </h3>

                      <div className="flex justify-between items-center text-xs text-[#6f6a63] mt-1">
                        <span className="text-red-500">
                          {capitalizeFirstLetter(post.author?.node?.name) ?? ""}
                        </span>
                        <span>{formatDateStockholm(post.date!)}</span>
                      </div>
                    </div>
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
