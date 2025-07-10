"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
import getPosts from "@/lib/graph_queries/getPosts";
import type { Post } from "@/lib/types";
import type { TOCItem } from "../page";
import AsideContent from "./SideBar";
import dynamic from "next/dynamic";
const RecommendationList = dynamic(() => import("./RecommendationList"), { ssr: false });
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { load } from "cheerio";
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import Instagram from "@/app/components/icons/instagram";
import Twitter from "@/app/components/icons/twitter";
import Facebook from "@/app/components/icons/facebook";
import Linkedin from "@/app/components/icons/linkedin";

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

  const articleRefs = useRef<(HTMLElement | null)[]>([]);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const extractHeadingsClient = useCallback((html: string): { updatedHtml: string; toc: TOCItem[] } => {
    const $ = load(html);
    const toc: TOCItem[] = [];

    $("h2, h3, h4, h5, h6").each((_, el) => {
      const $el = $(el);
      const tag = el.tagName.toLowerCase();
      const level = parseInt(tag.charAt(1), 10);
      const text = $el.text().trim();
      const id = $el.attr("id") || text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
      $el.attr("id", id);
      toc.push({ text, id, level });
    });

    return { updatedHtml: $.root().html()!, toc };
  }, []);

  useEffect(() => {
    if (queue.length === 0 || loading) return;

    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setLoading(true);

      const nextSlug = queue[0];
      const post = nextSlug ? await getPostBySlug(nextSlug) : null;

      if (post) {
        const { updatedHtml, toc } = extractHeadingsClient(post.content);
        setRendered((prev) => prev.some((p) => p.slug === post.slug) ? prev : [...prev, { ...post, updatedHtml, toc }]);
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

  return (
    <div className="space-y-16 max-w-7xl mx-auto py-12 px-4 mb-10">
      {rendered.map((post, i) => (
        <div key={post.slug} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start" data-index={i} ref={el => (articleRefs.current[i] = el)}>
          <article className="lg:col-span-2 space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold text-start">{post.title}</h1>

            <div className="flex flex-wrap items-center justify-between gap-y-2 text-sm text-muted-foreground mb-3">
              <Breadcrumb>
                <BreadcrumbItem><Link href="/" className="text-blue-700">{process.env.NEXT_PUBLIC_HOSTNAME || 'Home'}</Link><span className="mx-1">/</span></BreadcrumbItem>
                <BreadcrumbItem>{post.title}</BreadcrumbItem>
              </Breadcrumb>
              <span>Published: <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time></span>
            </div>

            <div className="flex items-center justify-between mt-2">
              <span className="text-sm">By <strong>{post.author?.node.name || 'Redaktionen'}</strong></span>
              <div className="flex gap-2">
                <Button variant="ghost" size="iconSmall"><Instagram className="w-6 h-6" /></Button>
                <Button variant="ghost" size="iconSmall"><Twitter className="w-6 h-6" /></Button>
                <Button variant="ghost" size="iconSmall"><Facebook className="w-6 h-6" /></Button>
                <Button variant="ghost" size="iconSmall"><Linkedin className="w-6 h-6" /></Button>
              </div>
            </div>

            {post.featuredImage?.node.sourceUrl && (
              <Image src={post.featuredImage.node.sourceUrl} alt={post.featuredImage.node.altText || ""} className="rounded-lg shadow-sm w-full mt-4" width={750} height={500} priority />
            )}

            <section className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: post.updatedHtml }} />
          </article>
          <aside className="space-y-8">
            <div className="hidden lg:block"><AsideContent toc={post.toc} /></div>
            <Card className="border-none shadow-none"><CardHeader className="p-0"><h3 className="text-xl font-bold">Läs mer</h3></CardHeader><RecommendationList currentSlug={post.slug} /></Card>
          </aside>
        </div>
      ))}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && <p className="text-center">Laddar fler...</p>}
    </div>
  );
}

// Render post with infinte scroll