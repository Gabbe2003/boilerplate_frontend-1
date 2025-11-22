import "server-only";

import Image from "next/image";
import Link from "next/link";
import { getAllPosts, getTodaysPosts } from "@/lib/graphql_queries/getPost";
import { Post } from "@/lib/types";
import ReadPeak from "@/components/Ads/Ads/Readpeak/ReadPeak";
import { formatDateStockholm, limitExcerpt } from "@/lib/globals/actions";
import SignUpNewsLetter from "@/components/Ads/NewsLetter/SignUpNewsLetter";

// NYT style serif font can also be applied globally via globals.css
// body { @apply font-serif text-gray-900; }

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
    <main className="w-full flex justify-center px-4 py-10 font-serif text-[#111]">
      <div className="base-width-for-all-pages grid grid-cols-1 md:grid-cols-12 gap-10 border-t pt-10">

        {/* LEFT COLUMN (order 3 on mobile) */}
        <aside className="md:col-span-3 flex flex-col gap-6 order-3 md:order-1 h-full min-h-full">

          {left_col.map((post: Post) => (
            <Link
              key={post.id}
              href={`/${post.slug}`}
              className="pt-5 pb-5  border-b border-gray-300 block"
            >
              <h3 className="font-semibold text-lg leading-tight">{post.title}</h3>

              <p className="text-gray-700 text-sm mt-2">
                {limitExcerpt(post.excerpt, 20)}
              </p>

              <p className="text-xs text-gray-500 mt-4">
                {formatDateStockholm(post.date!)}
              </p>
            </Link>
          ))}

          {/* Newsletter ALWAYS sticks to the bottom */}
          <div className="mt-auto">
            <SignUpNewsLetter variant="compact" />
          </div>

        </aside>


        {/* MIDDLE COLUMN (order 1 on mobile = FIRST) */}
        <section className="md:col-span-6 flex flex-col gap-10 p-3 order-1 md:order-2 border w-full">
          <div className="">
            {middle_big && (
              <Link
                href={`/${middle_big.slug}`}
                className="block  overflow-hidden border-gray-300 p-3 w-full"
              >
                <div className="relative w-full aspect-[16/9]">
                  <Image
                    src={middle_big.featuredImage?.node?.sourceUrl!}
                    alt={middle_big.featuredImage?.node?.altText || middle_big.title!}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="pt-3">
                  <h2 className="text-xl sm:text-2xl font-bold leading-snug">
                    {middle_big.title}
                  </h2>

                  <p className="text-gray-700 text-sm sm:text-base mt-4 line-clamp-3">
                    {limitExcerpt(middle_big.excerpt, 30)}
                  </p>

                  <div className="flex justify-between mt-4 text-xs sm:text-sm">
                    <p>
                      by <span>{middle_big.author?.node?.name ?? "Unknown"}</span>
                    </p>
                    <p className="text-gray-500">
                      {formatDateStockholm(middle_big.date!)}
                    </p>
                  </div>
                </div>
              </Link>
            )}
          </div>


 <div className="flex flex-col w-full">
  {middle_rest.map((post: Post) => (
    <Link
      key={post.id}
      href={`/${post.slug}`}
      className="grid lg:flex gap-4 sm:gap-6 py-6 border-t border-gray-300 transition w-full"
    >
      {/* Image */}
      <div
        className="
          relative 
          aspect-[16/9] 
          w-full        /* full width in column layout */
          lg:w-32 lg:sm:w-40  /* fixed width in row layout on large screens */
          flex-shrink-0 
          overflow-hidden 
          rounded
        "
      >
        <Image
          src={post.featuredImage?.node?.sourceUrl || '/placeholder.jpg'}
          alt={post.featuredImage?.node?.altText || post.title!}
          fill
          className="object-cover"
        />
      </div>

      {/* Text */}
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-semibold text-base sm:text-lg leading-snug text-gray-900 mb-2 break-words">
          {post.title}
        </h3>

        <p className="text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-3 mb-3">
          {limitExcerpt(post.excerpt, 150)}
        </p>

        <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500">
          <span>By {post.author?.node?.name ?? 'Unknown'}</span>
          <span>{formatDateStockholm(post.date!)}</span>
        </div>
      </div>
    </Link>
  ))}
</div>

        </section>

        {/* RIGHT COLUMN (order 2 on mobile) */}
        <aside className="md:col-span-3 flex flex-col gap-8 order-2 md:order-3 h-full">

          <div className="">
            <h2 className="text-xl font-bold mb-4 text-center sm:text-left mt-5 sm:mt-0">Dagens nyheter</h2>

            <div className="flex flex-col  border-b">
              {todays_right.map((post: any) => (
                post && (
                  <Link
                    key={post.id}
                    href={`/${post.slug}`}
                    className="pt-5 pb-5 block border-b px-1 transition "
                  >
                    <h3 className="font-semibold text-md leading-tight">{post.title}</h3>
                  </Link>
                )
              ))}
            </div>
          </div>

          {/* ReadPeak always pinned to bottom */}
          <div className="mt-auto ">
            <ReadPeakAd />
          </div>

        </aside>

      </div>
    </main>
  );
}
