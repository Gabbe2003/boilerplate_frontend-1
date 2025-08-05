import { getAuthorBySlug } from '@/lib/graph_queries/getAuthorBySlug';
import { Sidebar } from "@/app/[slug]/components/sideBar";
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

export default async function AuthorInfo({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const author = await getAuthorBySlug(slug);

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
    { href: `/authors/${slug}`, label: `${author.name}`, current: true },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Author header (like category image) */}
      {/* <h3>{author}</h3> */}

      {/* Title left-aligned */}
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

                
      {/* Description (like category.description) */}
      <div className="text-gray-700 mb-6 mt-6">{author.description}</div>
      <div className="text-xs text-gray-500 mb-4">
        Posts: {author.posts.nodes.length}
      </div>

      {/* Main grid: posts and sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Posts (left 2/3) */}
        <div className="lg:col-span-2 flex flex-col">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {author.posts.nodes.length > 0 ? (
              author.posts.nodes.map((post: Post) => {
                const imgSrc =
                  post.featuredImage?.node?.sourceUrl ||
                  author.avatar?.url ||
                  '/placeholder.jpg';
                const imgAlt =
                  post.featuredImage?.node?.altText || post.title || author.name;
                return (
                  <li
                    key={post.id}
                    className="border rounded-sm shadow-md hover:shadow-lg transition bg-white flex flex-col overflow-hidden group"
                  >
                    <Link
                      href={`/posts/${post.slug}`}
                      className="block overflow-hidden"
                    >
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
                      <Link
                        href={`/posts/${post.slug}`}
                        className="font-bold text-lg mb-1 hover:underline line-clamp-2"
                      >
                        {post.title}
                      </Link>
                      <div className="text-xs text-gray-500 mb-2">
                        {new Date(post.date).toLocaleDateString()}
                      </div>
                      <div
                        className="prose prose-sm text-gray-700 flex-1 line-clamp-4"
                        dangerouslySetInnerHTML={{
                          __html: stripHtml(post.excerpt!) || "",
                        }}
                      />
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
        {/* Sidebar (right 1/3) */}
        <aside className="w-full h-full hidden lg:block">
          <div className="sticky top-24 w-[60%]">
            <Sidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
