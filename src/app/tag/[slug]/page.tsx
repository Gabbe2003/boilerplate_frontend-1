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

  // TEMP: log parsed JSON-LD for verification
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonLdRaw = (meta.other as any)?.jsonLd as string | undefined;
  const parsed = safeParse(jsonLdRaw);
  if (parsed) console.log("[tag/generateMetadata] JSON-LD parsed:", parsed);

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
  const parsed = safeParse(jsonLdRaw);
  if (parsed) console.log("[tag/page] JSON-LD parsed:", parsed);

  const breadcrumbItems = [
    { href: "/", label: "Home" },
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
          {breadcrumbItems.map((item, idx) => (
            <span key={item.href} className="flex items-center gap-1">
              {idx !== 0 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                {item.current ? (
                  <BreadcrumbLink className="font-semibold text-primary underline underline-offset-4 cursor-default">
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className="text-blue-700 underline underline-offset-4 hover:text-blue-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          ))}
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
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(tag.posts.nodes as Post[]).map((post): JSX.Element => {
                const imgSrc = post.featuredImage?.node?.sourceUrl || "/favicon_logo.png";
                const imgAlt = post.featuredImage?.node?.altText || post.title || tag.name;

                return (
                  <li
                    key={post.id}
                    className="rounded-sm cursor-pointer hover:shadow-none transition flex flex-col overflow-hidden group"
                  >
                    <Link href={`/${post.slug}`} className="block overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={imgAlt}
                        width={600}
                        height={176}
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-200"
                        style={{ background: "#f5f5f5" }}
                        priority={false}
                      />
                    </Link>

                    <div className="p-4 flex flex-col flex-1">
                      {/* Title + Date in one row */}
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/${post.slug}`}
                          className="font-bold text-lg hover:underline line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>

                      {/* Excerpt (first 15 words) */}
                      <div className="prose prose-sm text-gray-700 mt-2 flex-1">
                        {truncateWords(stripHtml(post.excerpt!) || "", 15)}
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
