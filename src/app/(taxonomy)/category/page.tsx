// app/category/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { get_all_categories_by_name } from "@/lib/graphql_queries/getCategories";
import { handleSpecielChar } from "@/lib/globals/actions";
import type { CategoryWithPosts, Post } from "@/lib/types";
import Breadcrumb from "../_components/BreadCrumb";
import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";


export async function generateMetadata() {
  const { metadata } = await getWpSeo("/category");
  metadata.robots = {
    index: false, 
    follow: true
  }
  return metadata;
}


export default async function CategoryPage(){
  const categories = (await get_all_categories_by_name(true)) as CategoryWithPosts[];
  const { jsonLd } = await getWpSeo("/category");

  return (
    <main className="space-y-12">
      <div>
        <Breadcrumb type="category" /> 
      </div>
      {categories.map((cat) => (
        <section key={cat.slug ?? cat.name} className="space-y-4">
          <header className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold">
              {cat.name} <span className="text-sm text-gray-500">({cat.count ?? 0})</span>
            </h2>
            <Link
              href={`/category/${encodeURIComponent(handleSpecielChar(cat.name))}`}
              className="text-sm underline"
            >
              View all
            </Link>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(
              // 👇 Normalize: supports both shapes:
              // - array: Post[]
              // - connection: { nodes: Post[] }
              (Array.isArray((cat as any).posts)
                ? ((cat as any).posts as Post[])
                : (cat.posts?.nodes ?? [])) as Post[]
            ).map((p) => {
              const imgUrl =
                (p as any).featuredImageUrl ??
                p.featuredImage?.node?.sourceUrl ??
                "";

              return (
                <article key={p.id ?? p.slug} className="rounded-xl border p-4">
                  <Link href={`/${p.slug ?? ""}`} className="block space-y-3">
                    {imgUrl && (
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                        <Image
                          src={imgUrl}
                          alt={p.title ?? ""}
                          fill
                          sizes="(max-width:768px) 100vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-medium leading-tight">{p.title}</h3>
                    {p.excerpt && (
                      <div
                        className="prose prose-sm max-w-none line-clamp-3"
                        dangerouslySetInnerHTML={{ __html: p.excerpt }}
                      />
                    )}
                  </Link>
                </article>
              );
            })}
          </div>
        </section>
      ))}
      <SeoJsonLd data={jsonLd} />
    </main>
  );
}
