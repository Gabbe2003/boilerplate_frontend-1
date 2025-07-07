// src/app/[slug]/components/InfinitePostFeed.tsx
"use client";

import { useEffect, useState, useRef, RefObject } from "react";
import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
import getPosts from "@/lib/graph_queries/getPosts";
import type { Post } from "@/lib/types";
import type { TOCItem } from "../page";
import AsideContent from "./AsideContent";
import dynamic from "next/dynamic";
const RecommendationList = dynamic(() => import("./RecommendationList"), { ssr: false });
import { Card, CardHeader } from "@/components/ui/card";

interface PostWithTOC extends Post {
  updatedHtml: string;
  toc: TOCItem[];
}

export default function InfinitePostFeed({
  initialPost,
}: {
  initialPost: PostWithTOC;
}) {
  const [rendered, setRendered] = useState<PostWithTOC[]>([initialPost]);
  const [queue, setQueue] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // Index of the post currently "active" (i.e. in view)
  const [activeIndex, setActiveIndex] = useState(0);

  // Refs for each rendered article so we can observe them
  const articleRefs = useRef<RefObject<HTMLElement>[]>([]);

  // --- CLIENT‐SIDE HTML+TOC extractor ---
  function extractHeadingsClient(html: string): {
    updatedHtml: string;
    toc: TOCItem[];
  } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const toc: TOCItem[] = [];
    doc
      .querySelectorAll("h2, h3, h4, h5, h6")
      .forEach((el) => {
        const level = parseInt(el.tagName[1], 10);
        const text = el.textContent?.trim() || "";
        const id =
          el.id ||
          text
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]+/g, "");
        el.id = id;
        toc.push({ text, id, level });
      });
    return { updatedHtml: doc.body.innerHTML, toc };
  }

  // 1️⃣ Build the slug queue on mount// 1️⃣ Build the slug queue on mount
useEffect(() => {
  getPosts().then((posts) => {
    const uniqueSlugs = Array.from(new Set(posts.map((p) => p.slug)));
    setQueue(uniqueSlugs.filter((s) => s !== initialPost.slug));
  });
}, [initialPost.slug]);

// 2️⃣ Infinite‐scroll loader for new posts
useEffect(() => {
  if (loading || queue.length === 0) return;
  const observer = new IntersectionObserver(
    async ([entry]) => {
      if (entry.isIntersecting) {
        observer.disconnect();
        setLoading(true);

        // Don't mutate the queue directly. Use currentQueue[0] to pick next.
        const nextSlug = queue[0];
        if (!nextSlug) {
          setLoading(false);
          return;
        }

        const post = await getPostBySlug(nextSlug);
        if (post) {
          const { updatedHtml, toc } = extractHeadingsClient(post.content);
          const nextPost = { ...post, updatedHtml, toc };

          setRendered((prev) => {
            // Don't add the post if its slug is already in the list!
            if (prev.some((p) => p.slug === nextPost.slug)) return prev;
            return [...prev, nextPost];
          });

          // Only remove slug from queue *after* appending
          setQueue((q) => q.slice(1));
        } else {
          // If the post can't be fetched, still remove to prevent infinite loop
          setQueue((q) => q.slice(1));
        }

        setLoading(false);
      }
    },
    { rootMargin: "200px", threshold: 0.1 }
  );

  const lastRef = articleRefs.current[rendered.length - 1];
  if (lastRef?.current) observer.observe(lastRef.current);

  return () => observer.disconnect();
}, [queue, loading, rendered]);

  // 3️⃣ Track which article is in view to drive TOC and URL
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          if (entry.isIntersecting) {
            setActiveIndex(index);
            // update URL when a new article becomes active
            const slug = rendered[index].slug;
           if (window.location.hash !== `/${slug}`) {
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
    root: null,                  // viewport
    rootMargin: "0px 0px 10% 0px", // wait until sentinel is within bottom 10% of viewport
    threshold: 0                 // as soon as any bit is visible
  }    );


  
    articleRefs.current.forEach((ref) => {
      if (ref.current) obs.observe(ref.current);
    });

    return () => obs.disconnect();
  }, [rendered]);

  // Ensure we have exactly one ref per rendered post
  articleRefs.current = rendered.map(
    (_, i) => articleRefs.current[i] || ({} as RefObject<HTMLElement>)
  );
  rendered.forEach((_, i) => {
    if (!articleRefs.current[i]?.current) {
      articleRefs.current[i] = { current: null };
    }
  });
return (
  <div className="space-y-16 max-w-7xl mx-auto py-12 px-4 mb-10">
    {rendered.map((post, i) => (
      <div
        key={post.slug}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
        data-index={i}
        ref={(el) => {
          articleRefs.current[i] = { current: el! };
        }}
      >
        {/* Main article */}
        <article className="lg:col-span-2 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-center">
            {post.title}
          </h1>
          {post.featuredImage?.node.sourceUrl && (
            <img
              src={post.featuredImage.node.sourceUrl}
              alt={post.featuredImage.node.altText || ""}
              className="rounded-lg shadow-sm w-full mt-4"
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

    {/* sentinel at the very bottom */}
    <div
      ref={(el) => (articleRefs.current[rendered.length] = { current: el! })}
      style={{ height: 1 }}
    />
    {loading && <p className="text-center">Laddar fler...</p>}
  </div>
);

}
