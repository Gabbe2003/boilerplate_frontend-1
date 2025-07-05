// src/app/[slug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";
import puppeteer from "puppeteer";
import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
import type { Post } from "@/lib/types";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Breadcrumb, BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Facebook, Twitter } from "lucide-react";
import React from "react";
import AsideContent from "./components/AsideContent";

export const dynamicParams = false;

interface PostPageProps {
  params: { slug: string };
}

interface TOCItem {
  text: string;
  id: string;
  level: number;
}

export async function extractHeadings(html: string): Promise<{ updatedHtml: string; toc: TOCItem[] }> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });

  const result = await page.evaluate(() => {
    // ── 0) inject CSS for our circle bullets ──────────────────────────────────
    const style = document.createElement("style");
    style.textContent = `
      .faq-list { padding-left: 0; } /* remove default indent */
      .faq-list li {
        position: relative;
        padding-left: 1.5em;    /* make room for the circle */
        list-style: none;       /* turn off built-in bullets */
      }
      .faq-list li::before {
        content: "";
        position: absolute;
        left: 0;
        top: 0.6em;             /* tweak to vertically center */
        width: 0.5em;
        height: 0.5em;
        background-color: black;
        border-radius: 50%;
      }
    `;
    document.head.appendChild(style);

    const toc: TOCItem[] = [];
    const doc = document.querySelectorAll("h2, h3, h4, h5, h6");

    // 1) IDs + TOC
    doc.forEach((el) => {
      const level = parseInt(el.tagName[1], 10);
      const text = el.textContent!.trim();
      const id = text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]+/g, "");
      el.id = id;
      toc.push({ text, id, level });
    });

    return {
      updatedHtml: document.documentElement.outerHTML,
      toc,
    };
  });

  await browser.close();
  return result;
}




export default async function PostPage({ params }: PostPageProps) {
  const { slug } = params;
  const post: Post | null = await getPostBySlug(slug);
  if (!post) return notFound();
  const { updatedHtml, toc } = await extractHeadings(post.content);

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      <article className="lg:col-span-2 space-y-6">
        {/* Header & Featured Image */}
        <div>
          <CardHeader className="pb-0 p-0">
            <h1 className="text-4xl font-bold text-center">{post.title}</h1>
            <div className="flex w-full justify-end mb-4 gap-4">
              <Button className="cursor-pointer">
                <Facebook />
              </Button>
              <Button className="cursor-pointer">
                <Twitter />
              </Button>
            </div>
          </CardHeader>

          {post.featuredImage?.node.sourceUrl && (
            <CardContent className="p-0">
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || "Featured image"}
                width={750}
                height={500}
                className="rounded-b-lg shadow-sm w-full h-auto object-cover"
                priority
              />

              {/* 2. Caption under the featured image */}
              <p className="text-muted-foreground text-[10px] mt-2">
                {post.title}
              </p>

              {/* 3. Breadcrumbs */}
              <Breadcrumb className="mb-4">
                <BreadcrumbItem >
                  <Link href="/" className="text-blue-700">Hem </Link>/   <p style={{whiteSpace: 'pre-wrap'}}></p>
                </BreadcrumbItem>
                {/* <BreadcrumbItem >
                  <Link href="/blog" className="text-blue-700">Blogg</Link>
                </BreadcrumbItem> */}
                <BreadcrumbItem>{post.title}</BreadcrumbItem>
              </Breadcrumb>
            </CardContent>
          )}

          {/* 4. Author + Date */}
          <div className="flex items-center text-sm text-muted-foreground space-x-4 mt-1 ">
            <span>
              Av <span className="font-medium">{post.author?.node.name || "Redaktionen"}</span>
            </span>
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>

        {/* Content */}
        <section
          className={`
            prose prose-lg max-w-none
            [&_a]:text-blue-600 [&_a:hover]:underline
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6
            [&_h4]:text-lg [&_h4]:font-medium [&_h4]:mt-5
            [&_h5]:text-base [&_h5]:font-medium [&_h5]:mt-4
            [&_h6]:text-sm [&_h6]:font-medium [&_h6]:mt-3
          `}
          dangerouslySetInnerHTML={{ __html: updatedHtml }}

        />
      </article>

      {/* Sidebar */}
      <aside className="space-y-8 ">
        <div className="hidden lg:block">
          <AsideContent toc={toc} />
        </div>
        {/* Recommendation posts */}
        <Card className="border-none shadow-none">
          <CardHeader>
            <h3 className="text-xl font-bold">Läs mer</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              "Liisa avslöjar parkeringsbolagets bluff",
              "James Bond-villa i Stuvsta – veckans klickraket",
              "Orkla: Norsk livsmedelsjätte under lupp",
              "Trumps marknadsfiasko avslöjat",
              "Euro i Sverige: En Omvälvande Förändring i Valutasystemet",
            ].map((title) => (
              <a
                key={title}
                href="#"
                className="grid items-start space-x-2 group"
              >
                <span className="text-sm text-blue-600 group-hover:text-primary">
                  Nyheter
                </span>
                <span className="font-medium group-hover:underline">
                  {title}
                </span>
              </a>
            ))}
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}
