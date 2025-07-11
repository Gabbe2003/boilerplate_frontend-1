// import { notFound } from "next/navigation";
// import Image from "next/image";
// import puppeteer from "puppeteer";
// import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
// import type { Post } from "@/lib/types";
// import Link from "next/link";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
// import { Facebook, Twitter } from "lucide-react";
// import React from "react";
// import AsideContent from "./components/AsideContent";
// import RecommendationList from "./components/RecommendationList";


// export const dynamicParams = false;

// interface PostPageProps {
//   params: { slug: string };
// }

// interface TOCItem {
//   text: string;
//   id: string;
//   level: number;
// }


// export async function extractHeadings(html: string): Promise<{ updatedHtml: string; toc: TOCItem[] }> {
//   const browser = await puppeteer.launch({ headless: true });
//   const page = await browser.newPage();
//   await page.setContent(html, { waitUntil: "networkidle0" });

//   const result = await page.evaluate(() => {
//     const toc: TOCItem[] = [];
//     const doc = document.querySelectorAll("h2, h3, h4, h5, h6");

//     doc.forEach((el) => {
//       const level = parseInt(el.tagName[1], 10);
//       const text = el.textContent!.trim();
//       const id = text
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^\w-]+/g, "");
//       el.id = id;
//       toc.push({ text, id, level });
//     });

//     return {
//       updatedHtml: document.documentElement.outerHTML,
//       toc,
//     };
//   });

//   await browser.close();
//   return result;
// }


// export default async function PostPage({ params }: PostPageProps) {
//   const { slug } = params;
//   const post: Post | null = await getPostBySlug(slug);
//   if (!post) return notFound();
//   const { updatedHtml, toc } = await extractHeadings(post.content);

//   return (
//     <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
//       <article className="lg:col-span-2 space-y-6">
//         {/* Header & Featured Image */}
//         <div>
//           <CardHeader className="pb-0 p-0">
//             <h1 className="text-3xl md:text-4xl font-bold text-center">{post.title}</h1>
//             <div className="flex w-full justify-end mb-4 gap-4">
//               <Button className="cursor-pointer">
//                 <Facebook />
//               </Button>
//               <Button className="cursor-pointer">
//                 <Twitter />
//               </Button>
//             </div>
//           </CardHeader>

//           {post.featuredImage?.node.sourceUrl && (
//             <CardContent className="p-0">
//               <Image
//                 src={post.featuredImage.node.sourceUrl}
//                 alt={post.featuredImage.node.altText || "Featured image"}
//                 width={750}
//                 height={500}
//                 className="rounded-b-lg shadow-sm w-full h-auto object-cover"
//                 priority
//               />

//               <p className="text-muted-foreground text-[10px] mt-2">
//                 {post.title}
//               </p>

//               <Breadcrumb className="mb-4">
//                 <BreadcrumbItem >
//                   <Link href="/" className="text-blue-700">Hem </Link>/   <p style={{whiteSpace: 'pre-wrap'}}></p>
//                 </BreadcrumbItem>
//                 {/* <BreadcrumbItem >
//                   <Link href="/blog" className="text-blue-700">Blogg</Link>
//                 </BreadcrumbItem> */}
//                 <BreadcrumbItem>{post.title}</BreadcrumbItem>
//               </Breadcrumb>
//             </CardContent>
//           )}

//           <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-1 ">
//             <span>
//               Av <span className="font-medium">{post.author?.node.name || "Redaktionen"}</span>
//             </span>
//             <time dateTime={post.date}>
//               {new Date(post.date).toLocaleDateString(undefined, {
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               })}
//             </time>
//           </div>
//         </div>

//         {/* Content */}
//         <section
//           className={`
//             prose prose-lg max-w-none
//             [&_a]:text-blue-600 [&_a:hover]:underline
//             [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8
//             [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6
//             [&_h4]:text-lg [&_h4]:font-medium [&_h4]:mt-5
//             [&_h5]:text-base [&_h5]:font-medium [&_h5]:mt-4
//             [&_h6]:text-sm [&_h6]:font-medium [&_h6]:mt-3
//           `}
//           dangerouslySetInnerHTML={{ __html: updatedHtml }}
          
//         />
//       </article>

//       {/* Sidebar */}
//       <aside>
//         <div className="hidden lg:block">
//           <AsideContent toc={toc} />
//         </div>
//        <Card className="border-none shadow-none p-0 sticky top-30 self-start gap-0">
//           <CardHeader className="p-0 mt-3">
//             <h3 className="text-xl font-bold">Läs mer</h3>
//           </CardHeader>
//             <RecommendationList currentSlug={slug} />
//          </Card>
//       </aside>
//     </div>
//   );
// }

// src/app/[slug]/page.tsx


import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
import { load } from "cheerio";
import type { Post } from "@/lib/types";
import InfinitePostFeedClientWrapper from "./components/InfinitePostFeedClientWrapper";

export const dynamicParams = false;

export interface TOCItem {
  text: string;
  id: string;
  level: number;
}

/** Runs on the server – safe to import Puppeteer */ 

export async function extractHeadings(html: string): Promise<{
  updatedHtml: string;
  toc: TOCItem[];
}> {
  // Load the HTML into Cheerio
  const $ = load(html);

  const toc: TOCItem[] = [];

  // Find all heading tags, generate IDs, and build TOC
$("h2, h3, h4, h5, h6").each((_, el) => {
    const $el = $(el);
    const tag   = el.tagName.toLowerCase();        // e.g. "h2"
    const level = parseInt(tag.charAt(1), 10);     // heading level
    const text  = $el.text().trim();

    // generate or reuse ID
    const id =
      $el.attr("id") ||
      text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");

    $el.attr("id", id);
    toc.push({ text, id, level });
  });

  // Get back the updated <body> HTML for dangerouslySetInnerHTML
  const updatedHtml = $("body").html() ?? $.root().html() ?? "";

  return { updatedHtml, toc };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
 
  const post: Post | null = await getPostBySlug(slug);
  if (!post) return notFound();
  const { updatedHtml, toc } = await extractHeadings(post.content);

  // http://boilerplate.local/wp-json/hpv/v1/log-view/:postId
 
  
  return (
    <InfinitePostFeedClientWrapper initialPost={{ ...post, updatedHtml, toc }} />
  );
}
