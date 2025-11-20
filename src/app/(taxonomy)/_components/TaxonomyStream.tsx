// app/(taxonomy)/_components/TaxonomyStream.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/(taxonomy)/_components/BreadCrumb";
import InfiniteScroll from "@/app/[slug]/_components/InfinityScroll/InfiniteScroll";
import type { Post } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/globals/actions";
import ReadPeak from "@/components/Ads/Ads/Readpeak/ReadPeak";

type StreamKind = "author" | "category";

type PageInfo = { hasNextPage: boolean; endCursor?: string | null };

type StreamInitial = {
  name: string;
  description?: string | null;
  posts: {
    pageInfo?: PageInfo;
    nodes: Post[];
  };
};

// Minimal payload we expect back from the API on “load more”
type PagePayload = {
  name?: string;
  posts: {
    pageInfo?: PageInfo;
    nodes: Post[];
  };
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default function TaxonomyStream({
  kind,
  slug,
  initial,
}: {
  kind: StreamKind;
  slug: string;
  initial: StreamInitial;
}) {
  const initialNodes = initial.posts.nodes.slice(0, 9);

  const [nodes, setNodes] = useState<Post[]>(initialNodes);
  const [hasNext, setHasNext] = useState<boolean>(
    Boolean(initial.posts.pageInfo?.hasNextPage)
  );
  const [take, setTake] = useState<number>(initialNodes.length);

  const featured = nodes[0];
  const rest = nodes.slice(1);

  async function loadMore(): Promise<PagePayload | null> {
    if (!hasNext) return null;

    const nextTake = take + 8;

    // Choose endpoint + param key based on kind
    const endpoint = kind === "author" ? "/api/author" : "/api/categories";
    const slugKey = kind === "author" ? "slug" : "category";

    const url = new URL(endpoint, window.location.origin);
    url.searchParams.set(slugKey, slug);
    url.searchParams.set("take", String(nextTake));

    const res = await fetch(url.toString(), { cache: "no-store" });
    if (!res.ok) return null;

    const data = (await res.json()) as PagePayload;

    setNodes(data.posts.nodes);
    setHasNext(Boolean(data.posts.pageInfo?.hasNextPage));
    setTake(nextTake);

    return data;
  }

  const author_name = capitalizeFirstLetter(initial.name);

  return (
      <main className="base-width-for-all-pages mt-3">
        <div className="w-[100%] lg:w-[75%]">

          {/* Breadcrumb */}
          <Breadcrumb type={kind} name={author_name} />

          {/* Header */}
          <header className="space-y-6 mt-6 mb-10">
            <h1 className="text-3xl font-bold tracking-tight">{author_name}</h1>

            {initial.description && (
              <p className="text-[17px] leading-relaxed text-gray-600 max-w-3xl">
                {initial.description}
              </p>
            )}
          </header>

          {/* FEATURED */}
          {featured && (
            <article className="space-y-4 mb-12">
              <Link href={`/${featured.slug}`} className="block space-y-4">
                {featured.featuredImage?.node?.sourceUrl && (
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={featured.featuredImage.node.sourceUrl}
                      alt={featured.featuredImage.node.altText ?? featured.title ?? ""}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 66vw"
                      priority
                    />
                  </div>
                )}

                <h2 className="text-2xl font-bold leading-tight">
                  {featured.title}
                </h2>
              </Link>
            </article>
          )}

          {/* POSTS + RANDOM AD */}
          {/* POSTS WITH AD EVERY 8 ITEMS */}

          {/* POSTS + RANDOM AD */}
          <div className="w-full">
            {chunk(rest, 8).map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full"
              >
                {group.map((p) => (
                  <article key={p.id ?? p.slug} className="space-y-3">
                    <Link href={`/${p.slug}`} className="block space-y-3">
                      {p.featuredImage?.node?.sourceUrl && (
                        <div className="relative aspect-[16/9] min-h-[160px] overflow-hidden w-full">
                          <Image
                            src={p.featuredImage.node.sourceUrl}
                            alt={p.featuredImage.node.altText ?? p.title ?? ""}
                            fill
                            className="object-cover"
                            sizes="(max-width:768px) 100vw, 50vw"
                          />
                        </div>
                      )}

                      <h3 className="text-[17px] font-semibold leading-snug text-gray-900 hover:underline">
                        {p.title}
                      </h3>
                    </Link>
                  </article>
                ))}

                {/* AD after 8 posts */}
                <div className="sm:col-span-2 col-span-1 my-8">
                  <ReadPeak numberOfAds={1} />
                </div>
              </div>
            ))}

            <InfiniteScroll<PagePayload>
              loadMore={loadMore}
              onData={() => { }}
              disabled={!hasNext}
              rootMargin="0px 0px 40% 0px"
            />
          </div>




        </div>
      </main>
  );

}
