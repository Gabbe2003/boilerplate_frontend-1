import { Sidebar } from "@/app/components/Main-page/SideBar";
import { getTagBySlug } from "@/lib/graph_queries/getTag";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { Post } from "@/lib/types";
import type { Metadata } from "next";
import { getBestSeoBySlug } from "@/lib/seo/seo-helpers";
import { stripHtml } from "@/lib/helper_functions/strip_html";
import { truncateWords } from "@/lib/utils";
import { JSX } from "react/jsx-runtime";

// ---- Types ----
type Params = Promise<{ slug: string }>;

interface Tag {
  id: string;
  slug: string;
  name: string;
  description?: string;
  count?: number;
  posts: {
    nodes: Post[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string;
    };
  };
}

// ---------- helper (safe JSON parse) ----------
function safeParse<T = unknown>(raw?: string): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getBestSeoBySlug(slug, "tag");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonLdRaw = (meta.other as any)?.jsonLd as string | undefined;
  safeParse(jsonLdRaw);
  
  return meta;
}

export default async function TagPage({ params }: { params: Params }) {
  const { slug } = await params;

  let tag: Tag | null = null;
  try {
    tag = await getTagBySlug(slug);
  } catch (e) {
    console.error(e);
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Tag</h1>
        <p className="text-red-500">Failed to load tag.</p>
      </div>
    );
  }

  if (!tag) {
    notFound();
  }

  // Fetch SEO again for JSON-LD injection on the page
  const { meta: seoMeta } = await getBestSeoBySlug(slug, "tag");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonLdRaw = (seoMeta.other as any)?.jsonLd as string | undefined;
  safeParse(jsonLdRaw);

  const breadcrumbItems = [
    { href: "/", label: "Home" },
    { href: null, label: "Tags" },
    { href: `/tags/${tag.slug}`, label: tag.name, current: true },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Emit JSON-LD script (server-rendered) */}
      {jsonLdRaw ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdRaw }}
        />
      ) : null}

      <h1 className="text-3xl font-bold mb-2">{tag.name}</h1>

      <Breadcrumb>
        <BreadcrumbList className="flex items-center gap-1 text-sm">
          {breadcrumbItems.flatMap((item, idx) => {
            const isLast = idx === breadcrumbItems.length - 1;

            return [
              idx !== 0 ? (
                <BreadcrumbSeparator key={`sep-${idx}`}>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </BreadcrumbSeparator>
              ) : null,
              (
                <BreadcrumbItem key={item.href || item.label}>
                  {item.href && !isLast ? (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href}
                        className="text-gray-700 underline underline-offset-4 hover:text-gray-900 transition-colors"
                        prefetch={false}
                      >
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  ) : (
                    <span
                      aria-current={isLast ? "page" : undefined}
                      className={`${
                        isLast
                          ? "font-semibold text-primary cursor-default"
                          : "text-gray-500 cursor-default"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </BreadcrumbItem>
              ),
            ];
          })}
        </BreadcrumbList>
      </Breadcrumb>

      {tag.description && (
        <div className="text-gray-700 mb-2">{tag.description}</div>
      )}
      <div className="text-xs text-gray-500 mb-4">
        Posts: {tag.count ?? "0"}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 flex flex-col">
          {tag.posts.nodes.length === 0 ? (
            <div className="mb-8 p-6 rounded-sm border border-gray-200 bg-gray-50 text-center">
              <p className="text-lg font-semibold text-gray-600 mb-4">
                No posts found with this tag.
              </p>
              <div className="text-gray-500 mb-2">
                Try exploring our{" "}
                <Link href="/" className="underline">
                  latest posts
                </Link>
                .
              </div>
            </div>
          ) : (
            <ul
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              // keep below-the-fold cheap
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              style={{ contentVisibility: "auto", containIntrinsicSize: "1px 800px" as any }}
            >
              {(tag.posts.nodes as Post[]).map((post, idx): JSX.Element => {
                const imgSrc = post.featuredImage?.node?.sourceUrl || "/favicon_logo.png";
                const imgAlt = post.featuredImage?.node?.altText || post.title || tag.name;

                // Only the first card should be LCP if it's actually above the fold
                const isLCP = idx === 0;

                return (
                  <li
                    key={post.id}
                    className="rounded-sm cursor-pointer hover:shadow-none transition flex flex-col overflow-hidden group"
                  >
                    <Link href={`/${post.slug}`} className="block overflow-hidden" prefetch={false}>
                      {/* Reserve exact aspect ratio: 600 / 300 = 2:1 */}
                      <div className="relative w-full aspect-[600/300]">
                        <Image
                          src={imgSrc}
                          alt={imgAlt}
                          fill
                          sizes="(max-width: 640px) 100vw,
                                 (max-width: 1024px) 60vw,
                                 70vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-200 bg-[#f5f5f5]"
                          quality={85}
                          priority={isLCP}
                          fetchPriority={isLCP ? "high" : "auto"}
                          loading={isLCP ? "eager" : "lazy"}
                          placeholder="blur"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          blurDataURL={(post as any)?.featuredImage?.node?.blurDataURL || "/favicon_logo.png"}
                        />
                      </div>
                    </Link>

                    <div className="pt-4 flex flex-col flex-1">
                      {/* Title + Date in one row */}
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/${post.slug}`}
                          className="font-bold text-lg hover:underline line-clamp-1"
                          prefetch={false}
                        >
                          {post.title}
                        </Link>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Excerpt (first 15 words) */}
                      <div className="prose prose-sm text-gray-700 mt-2 flex-1">
                        {truncateWords(stripHtml(post.excerpt || "") || "", 15)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <aside className="w-full h-full hidden lg:block">
          <div className="sticky top-24 w-[60%]">
            <Sidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
