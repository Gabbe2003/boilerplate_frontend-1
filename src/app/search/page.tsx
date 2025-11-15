// app/search/page.tsx
import { getAllPostsByTitle } from "@/lib/graphql_queries/getPost";
import { bestEffortMatches, highlightAll, sanitizeQuery } from "@/lib/search";
import Image from "next/image";
import AuthorInfo from "../[slug]/_components/_post/AuthorInfo";
import Link from "next/link";



export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const { q } = await searchParams;
  const s = sanitizeQuery(await (q) ?? "");

  // If no query, let the header bar control the flow → render nothing
  if (!s) return null;

  // Fetch the posts with full render data (image, excerpt, etc.)
  const allPosts = await getAllPostsByTitle({ render_post: true });
  const results = bestEffortMatches(allPosts, q!, 50);

  return (
    <div className="w-full">
      <div className="mx-auto base-width-for-all-pages py-10 ">
        <h1 className="text-2xl font-semibold mb-5">
          Sökresultat för <span className="italic">“{q}”</span>
        </h1>

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {results.map((p) => (
              <div
                key={p.slug}
                className="flex flex-col h-full rounded-lg overflow-hidden border bg-white hover:shadow-lg transition"
              >
                <Link href={`/${p.slug}`} className="group block">
                  <div className="relative aspect-[16/9]">
                    <Image
                      src={p.featuredImage?.url || ""}
                      alt={p.featuredImage?.alt || p.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                      priority={false}
                    />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 !mt-2 px-4 py-2 min-h-[5.6rem] flex items-start group-hover:underline">
                    {highlightAll(p.title, q!)}
                  </h2>
                </Link>

                {/* Non-clickable meta + excerpt area */}
                <div className="flex flex-col flex-grow px-4 pb-4 space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {p.author && <AuthorInfo author={p.author} />}
                    </div>
                    {p.date && (
                      <time
                        dateTime={p.date}
                        className="whitespace-nowrap text-gray-500"
                      >
                        {new Date(p.date).toLocaleDateString("sv-SE", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    )}
                  </div>

                  {/* Spacer keeps excerpt aligned at bottom */}
                  <div className="flex-grow" />

                  {p.excerpt && (
                    <p
                      className="text-gray-700 line-clamp-3 mt-auto"
                      dangerouslySetInnerHTML={{ __html: p.excerpt }}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 space-y-3 py-10">
            <p className="text-lg font-medium">
              Vi hittade inte det du sökte, men här är några rekommendationer för dig.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
