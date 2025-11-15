import "server-only"

import { getAllPosts, getTodaysPosts } from "@/lib/graphql_queries/getPost";
import Link from "next/link";
import PostCard from "./_components/PostCard";


export default async function Home() {
  let [posts, todays_posts] = await Promise.all([
    getAllPosts(10),
    getTodaysPosts(12),
  ]);


  const left_col = posts.slice(0, 2);
  const middle_col = posts.slice(2, 6);
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
                className="h-[280px] sm:h-[350px] lg:h-[420px]"
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
        <div className="col-span-12 border-gray-200 lg:col-span-4 lg:pl-3 lg:border-l">
          <ul className="max-h-[72vh] divide-y overflow-y-auto">
            {todays_posts.map((post: any) => (
              <li key={post.id} className="group">
                <Link
                  href={post.slug!}
                  className="block rounded-none py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30"
                >
                  <div className="flex items-start gap-3">
                    <div className="min-w-0">
                      <div className="mb-0.5 flex items-baseline gap-2 text-[11px] font-extrabold tracking-wide">
                        {post.category}
                      </div>

                      <div className="flex items-center">
                        <span className="relative mt-1 ml-1 inline-flex h-2 w-2 shrink-0">
                          <span
                            className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping"
                            aria-hidden
                          />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                        </span>

                        <div className="truncate font-medium text-gray-900 group-hover:underline ml-1">
                          {post.title ?? ""}
                        </div>
                      </div>
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
