// No "use client" here — this is now a Server Component.

import Link from "next/link";
import Image from "next/image";
import SectionBreaker from "@/components/SectionBreaker";
import { handleSpecielChar } from "@/lib/globals/actions";
import { getCategoryBySlug } from "@/lib/graphql_queries/getCategories";

const CATEGORIES = ["NYHETER", "BÖRSEN", "FÖRETAG", "UTBILDNING"];


async function getCategoryPosts() {
  const results: Record<string, any[]> = {};
  const opt = {
    start: 1,
    end: 5
  }
  await Promise.all(
    CATEGORIES.map(async (slug) => {
      const data = await getCategoryBySlug(slug, opt);
      results[slug] = data?.posts?.nodes ?? [];
    })
  );

  return results;
}


export default async function CategoryFourBlock() {
  const data = await getCategoryPosts();
  return (
    <div className="section3-border-theme w-full flex justify-center pt-[var(--section-spacing)] pb-[var(--section-spacing)] ">
      <div className="base-width-for-all-pages">
        <SectionBreaker color="red" />

        <h2 className="text-lg sm:text-xl font-semibold mb-6 text-[#2f2a26] tracking-tight">
          Senaste inom våra kategorier
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CATEGORIES.map((slug) => {
            const posts = data[slug] || [];
            if (posts.length === 0) return null;

            const first = posts[0];
            const rest = posts.slice(1);

            return (
              <div
                key={slug}
                className="p-4"
              >

                {/* Category Title */}
                <h3 className="text-sm font-semibold text-neutral-600 tracking-wide uppercase mb-4">
                  {slug}
                </h3>

                {/* Featured Post */}
                <Link href={`/${handleSpecielChar(first.slug)}`} className="block group">
                  {first.featuredImage?.node?.sourceUrl && (
                    <div className="relative overflow-hidden mb-4">
                      <div className="w-full aspect-[16/9] relative">
                        <Image
                          src={first.featuredImage.node.sourceUrl}
                          alt={first.featuredImage.node.altText || first.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  <h4 className="font-semibold text-base text-neutral-900 leading-tight line-clamp-2 group-hover:text-neutral-700 transition">
                    {first.title}
                  </h4>
                </Link>

                {/* Remaining Posts */}
                <ul className="mt-4 space-y-2 border-t border-[#e7d9c8]  pt-3">
                  {rest.map((post: any) => (
                    <li key={post.id} className="pl-3 relative text-sm">
                      <span className="absolute left-0 top-2 w-1.5 h-1.5 rounded-full bg-red-500"></span>

                      <Link
                        href={`/${handleSpecielChar(post.slug)}`}
                        className="text-neutral-700 leading-tight hover:text-neutral-900 transition line-clamp-2 text-xs"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

}
