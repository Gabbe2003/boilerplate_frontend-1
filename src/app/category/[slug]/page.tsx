import { Sidebar } from "@/app/components/Main-page/SideBar";
import { getCategoryBySlug } from "@/lib/graph_queries/getCategory";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { ICategory, Post } from "@/lib/types";
import type { Metadata } from "next";
import { getBestSeoBySlug } from "@/lib/seo/seo-helpers";
import { truncateWords } from "@/lib/utils";
import { stripHtml } from "@/lib/helper_functions/strip_html";
import { JSX } from "react/jsx-runtime";

type Params = Promise<{ slug: string }>;

// ---------- helper (safe JSON parse) ----------
function safeParse<T = unknown>(raw?: string): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getBestSeoBySlug(slug, "category");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonLdRaw = (meta.other as any)?.jsonLd as string | undefined;
  const parsed = safeParse(jsonLdRaw);
  if (parsed) console.log("[category/generateMetadata] JSON-LD parsed:", parsed);

  return meta;
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let category: ICategory | null = null;
  try {
    category = await getCategoryBySlug(slug);
  } catch (e) {
    console.error(e);
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Category</h1>
        <p className="text-red-500">Failed to load category.</p>
      </div>
    );
  }

  if (!category) notFound();

  // fetch seo again for JSON-LD injection
  const { meta: seoMeta } = await getBestSeoBySlug(slug, "category");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonLdRaw = (seoMeta.other as any)?.jsonLd as string | undefined;
  const parsed = safeParse(jsonLdRaw);
  if (parsed) console.log("[category/page] JSON-LD parsed:", parsed);

  // Breadcrumb items
  const breadcrumbItems = [
    { href: "/", label: "Home" },
    ...(category.parent?.node
      ? [{ href: `/category/${category.parent.node.slug}`, label: category.parent.node.name }]
      : []),
    { href: `/category/${category.slug}`, label: category.name, current: true },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Emit JSON-LD script */}
      {jsonLdRaw ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdRaw }} />
      ) : null}

      {/* Category header image */}
      {category.image?.sourceUrl && (
        <div className="mb-4 w-full flex justify-center">
          <Image
            src={category.image.sourceUrl}
            alt={category.image.altText || category.name}
            width={160}
            height={160}
            className="object-cover shadow border bg-white"
            style={{ maxHeight: 160, maxWidth: 160 }}
            priority
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>

      {/* Breadcrumbs */}
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

      <div className="text-gray-700 mb-2">{category.description}</div>
      {category.parent?.node && (
        <div className="text-xs text-gray-400 mb-2">Parent: {category.parent.node.name}</div>
      )}
      <div className="text-xs text-gray-500 mb-4">Posts: {category.count || "0"}</div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Posts */}
        <div className="lg:col-span-2 flex flex-col">
          {category.posts.nodes.length === 0 ? (
            <div className="mb-8 p-6 rounded-sm border border-gray-200 bg-gray-50 text-center">
              <p className="text-lg font-semibold text-gray-600 mb-4">
                No posts found in this category.
              </p>
              <div className="text-gray-500 mb-2">
                Try exploring our <Link href="/" className="underline">latest posts</Link>.
              </div>
            </div>
          ) : (
           <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {(category.posts.nodes as Post[]).map((post): JSX.Element => (
    <li
      key={post.id}
      className="rounded-sm cursor-pointer hover:shadow-none transition flex flex-col overflow-hidden group"
    >
      <Link href={`/${post.slug}`} className="block overflow-hidden">
        <Image
          src={post.featuredImage?.node?.sourceUrl || "/favicon_logo.png"}
          alt={post.featuredImage?.node?.altText || post.title || category.name}
          width={600}
          height={176}
          className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-200"
          style={{ background: "#f5f5f5" }}
          priority={false}
        />
      </Link>

      <div className="p-4 flex flex-col flex-1">
        {/* Title + Date row */}
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

        {/* Excerpt */}
        <div className="prose prose-sm text-gray-700 mt-2 flex-1">
          {truncateWords(stripHtml(post.excerpt!) || "", 15)}
        </div>
      </div>
    </li>
  ))}
</ul>

          )}
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
