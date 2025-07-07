// src/app/[slug]/components/InfinitePostFeed.tsx
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
import getPosts from "@/lib/graph_queries/getPosts";
import type { Post } from "@/lib/types";
import type { TOCItem } from "../page";
import AsideContent from "./AsideContent";
import dynamic from "next/dynamic";
const RecommendationList = dynamic(() => import("./RecommendationList"), { ssr: false });
import { Card, CardHeader } from "@/components/ui/card";
import { load } from "cheerio";
import Image from "next/image";

interface PostWithTOC extends Post {
  updatedHtml: string;
  toc: TOCItem[];
}

export default function InfinitePostFeed({
  initialPost,
}: {
  initialPost: PostWithTOC;
}) {
  // ----- STATE -----
  const [rendered, setRendered] = useState<PostWithTOC[]>([initialPost]);
  const [queue, setQueue] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  

 const extractHeadingsClient = useCallback(
    (html: string): { updatedHtml: string; toc: TOCItem[] } => {
      const $ = load(html);
      const toc: TOCItem[] = [];

      $("h2, h3, h4, h5, h6").each((_, el) => {
        const $el = $(el);
        const tag = el.tagName.toLowerCase();
        const level = parseInt(tag.charAt(1), 10);
        const text = $el.text().trim();

        const id =
          $el.attr("id") ||
          text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");

        $el.attr("id", id);
        toc.push({ text, id, level });
      });

      const updatedHtml = $.root().html()!;
      return { updatedHtml, toc };
    },
    [] // no deps → stable reference
  );

  useEffect(() => {
    if (queue.length === 0 || loading) return;

    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setLoading(true);

      const nextSlug = queue[0];
      const post = nextSlug ? await getPostBySlug(nextSlug) : null;
      console.log(post?.id);

      // We make the view function call

      if (post) {
        const { updatedHtml, toc } = extractHeadingsClient(post.content);
        setRendered((prev) =>
          prev.some((p) => p.slug === post.slug)
            ? prev
            : [...prev, { ...post, updatedHtml, toc }]
        );
      }
      setQueue((q) => q.slice(1));
      setLoading(false);
    }, { rootMargin: "200px", threshold: 0.1 });

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, [queue, loading, extractHeadingsClient]);
  
  useEffect(() => {
    getPosts().then((posts) => {
      const uniqueSlugs = Array.from(new Set(posts.map((p) => p.slug)));
      setQueue(uniqueSlugs.filter((s) => s !== initialPost.slug));

    });
  }, [initialPost.slug]);

  // ----- TRACK ACTIVE ARTICLE IN VIEW -----
  useEffect(() => {
    if (typeof window === "undefined") return;
    const refs = articleRefs.current;
    if (!refs.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting && !isNaN(index)) {

            // Update URL and meta only if not already there
            const slug = rendered[index]?.slug;
            if (slug && window.location.pathname !== `/${slug}`) {
              window.history.replaceState(null, rendered[index].title, `/${slug}`);
            }
            document.title = rendered[index].title;
            document
              .querySelector("meta[name=description]")
              ?.setAttribute("content", rendered[index].excerpt || "");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px 0px 10% 0px",
        threshold: 0,
      }
    );

    refs.forEach((ref) => {
      if (ref) obs.observe(ref);
    });

    return () => obs.disconnect();
  }, [rendered]);

  // ----- RENDER -----
  return (
    <div className="space-y-16 max-w-7xl mx-auto py-12 px-4 mb-10">
      {rendered.map((post, i) => (
        <div
          key={post.slug}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          data-index={i}
          ref={el => (articleRefs.current[i] = el)}
        >
          {/* Main article */}
          <article className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-center">
              {post.title}
            </h1>
            {post.featuredImage?.node.sourceUrl && (
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || ""}
                className="rounded-lg shadow-sm w-full mt-4"
                  width={750}
                  height={500}
                priority
              />
            )}
            <section
              className={`
                prose prose-lg max-w-none
                [&_a]:text-blue-600 [&_a:hover]:underline
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6
                [&_h4]:text-lg [&_h4]:font-medium [&_h4]:mt-5
                [&_h5]:text-base [&_h5]:font-medium [&_h5]:mt-4
                [&_h6]:text-sm [&_h6]:font-medium [&_h6]:mt-3
              `}
              dangerouslySetInnerHTML={{ __html: post.updatedHtml }}
            />
          </article>
          {/* Aside for this post */}
          <aside className="space-y-8">
            <div className="hidden lg:block">
              <AsideContent toc={post.toc} />
            </div>
            <Card className="border-none shadow-none p-0 gap-0">
              <CardHeader className="p-0 mt-3">
                <h3 className="text-xl font-bold">Läs mer</h3>
              </CardHeader>
              <RecommendationList currentSlug={post.slug} />
            </Card>
          </aside>
        </div>
      ))}

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && <p className="text-center">Laddar fler...</p>}
    </div>
  );
}
