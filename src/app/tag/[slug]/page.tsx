import { Sidebar } from "@/app/[slug]/components/sideBar";
import { getTagBySlug } from "@/lib/graph_queries/getTagBySlug";
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
import TagPosts from "./TagPosts"; // Import your client tag posts component!

interface TagPageProps {
  params: { slug: string }
}

export default async function TagPage({ params }: TagPageProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let tag: any = null;
  try {
    tag = await getTagBySlug(params.slug);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e:any) {
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

  // Breadcrumb items
  const breadcrumbItems = [
    { href: "/", label: "Home" },
    { href: `/tags/${tag.slug}`, label: tag.name, current: true },
  ];

  return (
  <div className="container mx-auto py-8 px-4">
    {/* Tag header (tags usually don't have images, but you can add an icon if you want) */}

    <h1 className="text-3xl font-bold mb-2">{tag.name}</h1>

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

    <div className="text-gray-700 mb-2">{tag.description}</div>
    <div className="text-xs text-gray-500 mb-4">
      Posts: {tag.count || "0"}
    </div>

    {/* Main grid: posts and sidebar */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      {/* Posts */}
      <div className="lg:col-span-2 flex flex-col">
        {tag.posts.nodes.length === 0 ? (
          <div className="mb-8 p-6 rounded-sm border border-gray-200 bg-gray-50 text-center">
            <p className="text-lg font-semibold text-gray-600 mb-4">
              No posts found with this tag.
            </p>
            <div className="text-gray-500 mb-2">
              Try exploring our <Link href="/" className="underline">latest posts</Link>.
            </div>
          </div>
        ) : (
          <TagPosts
            slug={tag.slug}
            initialPosts={tag.posts.nodes}
            initialPageInfo={tag.posts.pageInfo}
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
