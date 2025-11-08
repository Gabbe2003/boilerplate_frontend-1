// app/(taxonomy)/_components/TaxonomyStream.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Breadcrumb from "@/app/(taxonomy)/_components/BreadCrumb";
import InfiniteScroll from "@/app/[slug]/_components/InfinityScroll/InfiniteScroll";
import type { Post } from "@/lib/types";
import { capitalizeFirstLetter } from "@/lib/globals/actions";

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


    console.log(slug);
    
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
    <main className="space-y-10">
      {/* Breadcrumb */}
      <div>
        <Breadcrumb type={kind} name={author_name} />
      </div>

      {/* Header */}
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold">{author_name}</h1>
        {initial.description ? (
          <div className="text-muted-foreground">{initial.description}</div>
        ) : null}
      </header>

      {/* Featured (single) */}
      {featured && (
        <article className="rounded-xl border p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href={`/${featured.slug}`} className="md:col-span-2 space-y-3">
            {featured.featuredImage?.node?.sourceUrl && (
              <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                <Image
                  src={featured.featuredImage.node.sourceUrl}
                  alt={featured.featuredImage.node.altText ?? featured.title ?? ""}
                  fill
                  sizes="(max-width:768px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
              </div>
            )}
            <h2 className="text-xl font-semibold">{featured.title}</h2>
            {featured.excerpt && (
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: featured.excerpt }}
              />
            )}
          </Link>
        </article>
      )}

      {/* Rows of 4 */}
      {chunk(rest, 4).map((row, i) => (
        <div key={i} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {row.map((p) => (
            <article key={p.id ?? p.slug} className="rounded-xl border p-4">
              <Link href={`/${p.slug}`} className="block space-y-3">
                {p.featuredImage?.node?.sourceUrl && (
                  <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                    <Image
                      src={p.featuredImage.node.sourceUrl}
                      alt={p.featuredImage.node.altText ?? p.title ?? ""}
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
          ))}
        </div>
      ))}

      {/* Infinite sentinel */}
      <InfiniteScroll<PagePayload>
        loadMore={loadMore}
        onData={() => {}}
        disabled={!hasNext}
        rootMargin="0px 0px 40% 0px"
      />
    </main>
  );
}
