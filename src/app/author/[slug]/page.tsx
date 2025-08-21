// app/author/[slug]/page.tsx

import { getAuthorBySlug } from '@/lib/graph_queries/getAuthor';
import { Sidebar } from "@/app/components/Main-page/SideBar";
import { stripHtml } from '@/lib/helper_functions/strip_html';
import { Post } from '@/lib/types';
import Link from "next/link";
import Image from "next/image";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import type { Metadata } from 'next';
import { getBestSeoBySlug } from '@/lib/seo/seo-helpers';
import { truncateWords } from '@/lib/utils';

type Params = Promise<{ slug: string }>;

// (Optional) Revalidate this route periodically to help lower TTFB for repeat visitors.
// Adjust as needed for your content freshness.
export const revalidate = 60;

// ---------- helper (safe JSON parse) ----------
function safeParse<T = unknown>(raw?: string): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getBestSeoBySlug(slug, 'author');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonLdRaw = (meta.other as any)?.jsonLd as string | undefined;
  safeParse(jsonLdRaw); // parsed but not logged

  return meta;
}

export default async function AuthorInfo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch content in parallel to reduce server time (helps TTFB)
  const [author, seo] = await Promise.all([
    getAuthorBySlug(slug),
    getBestSeoBySlug(slug, 'author'),
  ]);

  const { meta: seoMeta } = seo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonLdRaw = (seoMeta.other as any)?.jsonLd as string | undefined;
  safeParse(jsonLdRaw); // parsed but not logged

  if (!author) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Author</h1>
        <p className="text-red-500">{`Author "${slug}" not found.`}</p>
      </div>
    );
  }

  // Breadcrumbs: Home / Author Profile
  const breadcrumbItems = [
    { href: "/", label: "Home" },
    { href: `/author/${slug}`, label: `${author.name}`, current: true },
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

      {/* Title */}
      <h1 className="text-3xl font-bold mb-2">{author.name}</h1>

      {/* Breadcrumbs UNDER the title */}
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
                  <BreadcrumbLink
                    className="font-semibold text-primary underline underline-offset-4 cursor-default"
                  >
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={item.href}
                      className="text-blue-700 underline underline-offset-4 hover:text-blue-900 transition-colors"
                      prefetch={false}
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

      {/* Description */}
      <div className="text-gray-700 mb-6 mt-6">{author.description}</div>
      <div className="text-xs text-gray-500 mb-4">
        Posts: {author.posts.nodes.length}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2 flex flex-col">
          <ul
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            // Optional: helps keep below-the-fold work from delaying paint
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            style={{ contentVisibility: 'auto', containIntrinsicSize: '1px 800px' as any }}
          >
            {author.posts.nodes.length > 0 ? (
              author.posts.nodes.map((post: Post, idx: number) => {
                const imgSrc =
                  post.featuredImage?.node?.sourceUrl ||
                  author.avatar?.url ||
                  '/favicon_logo.png';
                const imgAlt =
                  post.featuredImage?.node?.altText || post.title || author.name;

                const isLCP = idx === 0; // only the very first card gets priority

                return (
                  <li
                    key={post.id}
                    className="rounded-sm hover:cursor-pointer transition flex flex-col overflow-hidden group"
                  >
                    {/* Reduce bandwidth contention from prefetching dozens of routes */}
                    <Link href={`/${post.slug}`} prefetch={false} className="block overflow-hidden">
                      <Image
                        src={imgSrc}
                        alt={imgAlt}
                        width={600}
                        height={176}
                        // Let the browser choose better sizes at each breakpoint
                        sizes="(max-width: 768px) 100vw,
                               (max-width: 1024px) 50vw,
                               66vw"
                        className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-200"
                        style={{ background: "#f5f5f5" }}

                        // Critical bit: only one priority + eager image
                        priority={isLCP}
                        fetchPriority={isLCP ? 'high' : 'auto'}
                        loading={isLCP ? 'eager' : 'lazy'}

                        // Optional: perceived-speed improvement
                        placeholder="blur"
                        blurDataURL="/tiny-blur-placeholder.png"
                        // (Generate a tiny base64 per image if you can; a generic placeholder also works.)
                      />
                    </Link>

                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <Link
                          href={`/${post.slug}`}
                          prefetch={false}
                          className="font-bold text-lg hover:underline line-clamp-1"
                        >
                          {post.title}
                        </Link>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          {new Date(post.date).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="prose prose-sm text-gray-700 mt-2 flex-1">
                        {truncateWords(stripHtml(post.excerpt!) || "", 15)}
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <li className="col-span-full text-gray-500 text-center mt-8">
                No posts found for this author.
              </li>
            )}
          </ul>
        </div>

        {/* Sidebar */}
        <aside className="w-full h-full hidden lg:block">
          <div className="sticky top-24 w-[60%]">
            <Sidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
