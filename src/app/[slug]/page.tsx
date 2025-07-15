import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
import { load } from "cheerio";
import type { ITOCItem, Post } from "@/lib/types";
import InfinitePostFeedClientWrapper from "./components/InfinitePostFeedClientWrapper";

export const dynamicParams = false;


/** Runs on the server – safe to import Puppeteer */ 

export async function extractHeadings(html: string): Promise<{
  updatedHtml: string;
  toc: ITOCItem[];
}> {
  // Load the HTML into Cheerio
  const $ = load(html);

  const toc: ITOCItem[] = [];

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
  
  return (
    <InfinitePostFeedClientWrapper initialPost={{ ...post, updatedHtml, toc }} />
  );
}
