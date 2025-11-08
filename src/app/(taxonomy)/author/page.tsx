// app/category/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { handleSpecielChar, capitalizeFirstLetter } from "@/lib/globals/actions";
import { getAllAuthors } from "@/lib/graphql_queries/getAuthor";
import { Author, Post } from "@/lib/types";
import Breadcrumb from "../_components/BreadCrumb";
import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";

export async function generateMetadata() {
  const { metadata } = await getWpSeo("/author");
   metadata.robots = {
    index: false, 
    follow: true
  }
  return metadata;
}


export default async function CategoryPage({
  params,
}: { params: { slug: string } }) {
  const authors: Author[] = await getAllAuthors();
  const { jsonLd } = await getWpSeo("/author");

  return (
    <main className="space-y-12">
      <div>
        <Breadcrumb type="author" /> 
      </div>
      {authors.map((author) => (
        <section key={author.slug ?? author.name ?? ""}>
 
          <header className="flex items-baseline justify-between">
            <h3 className="text-xl font-semibold">
              {capitalizeFirstLetter(author.name ?? "")}
            </h3>
            <Link
              href={`/author/${encodeURIComponent(handleSpecielChar(author.slug ?? author.name ?? ""))}`}
              className="text-sm underline"
            >
              View all
            </Link>
          </header>

          {author.description && (
            <div className="mb-9">{author.description}</div>
          )}

          {/* POSTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(author.posts?.nodes ?? []).map((p : Post) => {
              const imgUrl = p.featuredImage?.node?.sourceUrl ?? "";
              return (
                <article key={(p as any).databaseId ?? p.slug} className="rounded-xl border p-4">
                  <Link href={`/${p.slug ?? ""}`} className="block space-y-3">
                    {imgUrl && (
                      <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                        <Image
                          src={imgUrl}
                          alt={p.featuredImage?.node?.altText ?? p.title ?? ""}
                          fill
                          sizes="(max-width:768px) 100vw, 25vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                    <h4 className="font-medium leading-tight">{p.title}</h4>
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
