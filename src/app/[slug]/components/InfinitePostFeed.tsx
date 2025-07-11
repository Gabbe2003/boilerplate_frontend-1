"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
import getPosts from "@/lib/graph_queries/getPosts";
import type { Post } from "@/lib/types";
import type { TOCItem } from "../page";
import AsideContent from "./SideBar";
import dynamic from "next/dynamic";
const RecommendationList = dynamic(() => import("./RecommendationList"), { ssr: false });
import { Card, CardHeader } from "@/components/ui/card";
import { load } from "cheerio";
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import Twitter from "@/app/components/icons/twitter";
import Facebook from "@/app/components/icons/facebook";
import Linkedin from "@/app/components/icons/linkedin";
import Email from "@/app/components/icons/email";

interface PostWithTOC extends Post {
  updatedHtml: string;
  toc: TOCItem[];
}

// Share URL generator
function getShareUrl(
  platform: "twitter" | "facebook" | "linkedin",
  { url, title }: { url: string; title: string }
) {
  switch (platform) {
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    case "linkedin":
      return `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
    default:
      return url;
  }
}

// Utility: strip HTML tags for excerpts
function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, '');
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

  // TOC dynamic alignment refs
  const aboveImageRef = useRef<HTMLDivElement>(null);
  const [aboveImageHeight, setAboveImageHeight] = useState(0);

  // Runs after every render
  useEffect(() => {
    if (aboveImageRef.current) {
      setAboveImageHeight(aboveImageRef.current.offsetHeight);
    }
  }, [rendered]);

  // For infinite scroll loading
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
    {rendered.map((post, i) => {
      const postUrl = `${process.env.NEXT_PUBLIC_SHARENAME || "https://yoursite.com"}/news/${post.slug}`;
      const postExcerpt = stripHtml(post.excerpt);

      return (
        <div
          key={post.slug}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
          data-index={i}
          ref={el => (articleRefs.current[i] = el)}
        >
          <article className="lg:col-span-2 flex flex-col">
            {/* Title, Excerpt, Author+Share */}
            <div ref={i === 0 ? aboveImageRef : null} className="mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-start mb-1">{post.title}</h1>
              {post.excerpt && (
                <p className="text-lg text-muted-foreground leading-snug mb-1">
                  {stripHtml(post.excerpt)}
                </p>
              )}


              <div className="flex items-center justify-between mt-5 mb-1">
                <span className="text-sm flex items-center gap-2">
                  {post.author?.node.avatar?.url ? (
                    <Image
                      src={post.author.node.avatar.url}
                      alt={post.author.node.name || "Author"}
                      width={28}
                      height={28}
                      className="rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <span
                      className="inline-flex items-center justify-center rounded-full bg-gray-300 text-gray-600 font-semibold border border-gray-200"
                      style={{ width: 28, height: 28, fontSize: "1rem", userSelect: "none" }}
                      aria-label="Author initial"
                    >
                      {post.author?.node.name
                        ? post.author.node.name[0].toUpperCase()
                        : "A"}
                    </span>
                  )}
                  By <strong>{post.author?.node.name || 'Admin'}</strong>
                </span>



               
  <div className="inline-flex items-center gap-1 px-3 py-2 bg-white border border-neutral-200 rounded-xs">
  {/* Share (copy link/share API) */}
  <Button
    variant="ghost"
    className="h-9 min-w-[52px] flex items-center justify-center text-neutral-700 font-medium rounded-xs px-3 transition-colors duration-150 text-mx border border-transparent hover:bg-neutral-100"
    aria-label="Share Link"
    onClick={async () => {
      if (typeof window !== "undefined" && navigator.share) {
        try {
          await navigator.share({
            title: post.title,
            text: postExcerpt || post.title,
            url: postUrl,
          });
        } catch (e) {
          console.log("User cancelled and sharing failed", e);
        }
      } else if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(postUrl);
        alert("Link Copied!");
      }
    }}
  >
    Share
  </Button>

  {/* Facebook */}
  <Button
    variant="ghost"
    size="iconSmall"
    className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
    asChild
    aria-label="Dela på Facebook"
  >
    <a
      href={getShareUrl('facebook', { url: postUrl, title: post.title })}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Facebook className="w-5 h-5 text-neutral-500" />
    </a>
  </Button>

  {/* Twitter/X */}
  <Button
    variant="ghost"
    size="iconSmall"
    className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
    asChild
    aria-label="Dela på X"
  >
    <a
      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(`${post.title}\n\n${postExcerpt}`)}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Twitter className="w-5 h-5 text-neutral-500" />
    </a>
  </Button>

  {/* Linkedin */}
  <Button
    variant="ghost"
    size="iconSmall"
    className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
    asChild
    aria-label="Dela på LinkedIn"
  >
    <a
      href={getShareUrl('linkedin', { url: postUrl, title: post.title })}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Linkedin className="w-5 h-5 text-neutral-500" />
    </a>
  </Button>

  {/* Email */}
  <Button
    variant="ghost"
    size="iconSmall"
    className="h-9 w-9 flex items-center justify-center p-0 rounded-xs border border-transparent hover:bg-neutral-100 transition-colors"
    asChild
    aria-label="Dela via e-post"
  >
    <a
      href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(`${post.title}\n\n${postExcerpt}\n\n${postUrl}`)}`}
    >
      <Email className="w-5 h-5 text-neutral-500" />
    </a>
  </Button>
</div>





                
              </div>





            </div>

            {/* Featured Image */}
            {post.featuredImage?.node.sourceUrl && (
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || ""}
                className="rounded-sm shadow-sm w-full mb-6"
                width={750}
                height={500}
                priority
              />
            )}

            {/* Breadcrumbs + Published Date Row */}
            <div className="flex flex-wrap items-center justify-between gap-y-2 text-sm text-muted-foreground my-3">
              <Breadcrumb>
                <BreadcrumbItem>
                  <Link href="/" className="text-blue-700">
                    {process.env.NEXT_PUBLIC_HOSTNAME || 'Home'}
                  </Link>
                  <span className="mx-1">/</span>
                </BreadcrumbItem>
                <BreadcrumbItem>{post.title}</BreadcrumbItem>
              </Breadcrumb>
              <span>
                Published: <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              </span>
            </div>

            {/* Post Content */}
            <section className="max-w-none" dangerouslySetInnerHTML={{ __html: post.updatedHtml }} />
          </article>

          <aside className="space-y-8">
            {/* Spacer to align TOC with the featured image */}
            <div
              style={{ height: i === 0 ? aboveImageHeight : 0, minHeight: 0 }}
              className="hidden lg:block"
              aria-hidden="true"
            />
            {/* TOC */}
            <div className="hidden lg:block">
              <div className="bg-gray-50 rounded-lg shadow p-4">
                <AsideContent toc={post.toc} />
              </div>
            </div>
            {/* Recommendations */}
            <Card className="border-none shadow-none">
              <CardHeader className="p-0">
                <h3 className="text-xl font-bold">Read more</h3>
              </CardHeader>
              <RecommendationList currentSlug={post.slug} />
            </Card>
          </aside>
        </div>
      );
    })}
    <div ref={sentinelRef} style={{ height: 1 }} />
    {loading && <p className="text-center">Downloading more...</p>}
  </div>
);
};