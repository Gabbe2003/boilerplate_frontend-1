import "server-only"

import { getAllPosts, getTodaysPosts } from "@/lib/graphql_queries/getPost";
import Link from "next/link";
import PostCard from "./_components/PostCard";
import { formatDateStockholm } from "@/lib/globals/actions";


export default async function Home() {
  let [posts, todays_posts] = await Promise.all([
    getAllPosts(10),
    getTodaysPosts(12),
  ]);


  const left_col = posts.slice(0, 2);
  const middle_col = posts.slice(2, 6);

  return (
    <main>
      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        {/* left */}
        <div className="col-span-12 flex flex-col gap-6 border-gray-200 pr-4 lg:col-span-5 lg:border-r">
          {left_col.map((item) => (
            <Link href={`/${item.slug}`} key={`left-${item.id}`} prefetch={false}>
              <PostCard post={item} variant="hero" className="h-[420px]" />
            </Link>
          ))}
        </div>

        {/* middle */}
        <div className="col-span-12 flex flex-col gap-6 px-4 lg:col-span-3">
          {middle_col.map((item) => (
            <Link href={`/${item.slug}`} key={`mid-${item.id}`} prefetch={false}>
              <PostCard post={item} />
            </Link>
          ))}
        </div>

        {/* right (popular list) */}
        <div className="col-span-12 border-gray-200 pl-4 lg:col-span-4 lg:border-l">
          <h2 className="mb-2 font-semibold">Populära inlägg</h2>
          <ul className="max-h-[72vh] divide-y overflow-y-auto">
            {todays_posts.map((post : any) => {
              const cat = (post)?.category?.nodes?.[0]?.name ?? (post)?.category?.nodes?.[0]?.name;
              const when = formatDateStockholm(post.date);
              return (
                <li key={post.id} className="group">
                  <Link href={post.slug!} className="block rounded-none px-4 py-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/30">
                    <div className="flex items-start gap-3">
                      <span className="relative mt-1 inline-flex h-2 w-2 shrink-0">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75 animate-ping" aria-hidden />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                      </span>
                      <div className="min-w-0">
                        <div className="mb-0.5 flex items-baseline gap-2 text-[11px] font-extrabold tracking-wide">
                          {cat && <span className="uppercase text-rose-700">{cat}</span>}
                          {when && <span className="text-red-500">{when}</span>}
                        </div>
                        <div className="truncate font-medium text-gray-900 group-hover:underline">
                          {post.title ?? ""}
                        </div>
                        {post.excerpt && (
                          <p className="mt-0.5 line-clamp-1 text-[13px] text-gray-600">
                            {post.excerpt.replace(/<\/?[^>]+>/g, "").replace(/\s+/g, " ").trim()}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </main>
  );
}
