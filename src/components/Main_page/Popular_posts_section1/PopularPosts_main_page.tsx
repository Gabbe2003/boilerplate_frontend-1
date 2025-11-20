import "server-only"

import { getAllPosts, getTodaysPosts } from "@/lib/graphql_queries/getPost";
import Link from "next/link";
import PostCard from "./_components/PostCard";


export default async function Home() {
  let [posts, todays_posts] = await Promise.all([
    getAllPosts(9),
    getTodaysPosts(12),
  ]);


  const left_col = posts.slice(0, 2);
  const middle_col = posts.slice(2, 5);
  return (
    <main className="w-full flex justify-center">
      <div className="mt-8 space-y-6 lg:grid lg:grid-cols-14 lg:gap-6 lg:space-y-0 base-width-for-all-pages">
        {/* left */}
        <div className="col-span-12 flex flex-col gap-6 border-gray-200 pr-0 lg:pr-4 lg:col-span-6 lg:border-r">
          {left_col.map((item) => (
            <Link href={`/${item.slug}`} key={`left-${item.id}`} prefetch={false}>
              {/* Responsive hero card height */}
              <PostCard
                post={item}
                variant="hero"
              />
            </Link>
          ))}
        </div>

        {/* middle */}
        <div className="col-span-12 grid grid-cols-2 gap-4 lg:flex lg:flex-col lg:col-span-4">
          {middle_col.map((item) => (
            <Link href={`/${item.slug}`} key={`mid-${item.id}`} prefetch={false}>
              <PostCard post={item} />
            </Link>
          ))}
        </div>

        {/* right (popular list) */}
        <div className="col-span-12 lg:col-span-4 lg:pl-3">
          <ul className="max-h-[72vh] overflow-y-auto">
            {todays_posts.map((post: any, index: number) => (
              <li key={post.id} className="group">

                <Link
                  href={post.slug!}
                  className="block py-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/20"
                >
                  <div className="flex items-start gap-3">

                    {/* LEFT COLUMN WITH DOT + VERTICAL LINE */}
                    <div className="relative">
                      {/* Dot */}
                      <span className="block h-2 w-2 rounded-full bg-rose-700 mt-1" />

                      <span className="absolute left-1 top-4 bottom-0 w-px ">
                        <hr className="bg-gray-300 h-15 lg:h-18" />
                      </span>
                    </div>

                    {/* TEXT COLUMN */}
                    <div className="flex-1 pb-4">
                      {/* Category */}
                      <div className="text-[11px] font-bold tracking-wide text-rose-700 uppercase text-gray-500 mb-1">
                        {post.category}
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-[15px] leading-snug group-hover:underline">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>

              </li>
            ))}
          </ul>
        </div>


      </div>
    </main>
  );
}
