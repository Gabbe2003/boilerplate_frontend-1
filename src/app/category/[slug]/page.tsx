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
import CategoryPosts from "./CategoryPosts";


// ---- Shared props (Promise style) ----
type RouteParams = { slug: string };
type PagePropsPromise = { params: Promise<RouteParams> };

import type { Metadata } from 'next';
import { getBestSeoBySlug } from "@/lib/seo/seo-helpers";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getBestSeoBySlug(slug, 'category');
  console.log('Metadata for category', meta)
  return meta;
}

export default async function CategoryPage({ params }: PagePropsPromise) {
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
    {/* Category header (not inside grid) */}
    {category.image?.sourceUrl && (
      <div className="mb-4 w-full flex justify-center">
        <Image
          src={category.image.sourceUrl}
          alt={category.image.altText || category.name}
          width={160}
          height={160}
          className=" object-cover shadow border bg-white"
          style={{ maxHeight: 160, maxWidth: 160 }}
          priority
        />
      </div>
    )}

    <h1 className="text-3xl font-bold mb-2">{category.name}</h1>

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
      <div className="text-xs text-gray-400 mb-2">
        Parent: {category.parent.node.name}
      </div>
    )}
    <div className="text-xs text-gray-500 mb-4">
      Posts: {category.count || "0"}
    </div>

    {/* Main grid: posts and sidebar */}
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
          <CategoryPosts
            slug={category.slug}
            initialPosts={category.posts.nodes as Post[]}
            initialPageInfo={category.posts.pageInfo}
          />
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