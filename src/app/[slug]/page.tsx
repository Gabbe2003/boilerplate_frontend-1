import { getPostBySlug } from "@/lib/graph_queries/getPostBySlug";
import { load } from "cheerio";
import type { ITOCItem, Post } from "@/lib/types";
import { SinglePost } from "./components/SinglePost";
import NotFound from "../NotFound";

export const dynamicParams = false;

async function extractHeadings(html: string): Promise<{ updatedHtml: string; toc: ITOCItem[] }> {
  const $ = load(html);
  const toc: ITOCItem[] = [];

  $("h2,h3,h4,h5,h6").each((_, el) => {
    const $el = $(el);
    const tag = el.tagName.toLowerCase();
    const level = parseInt(tag.charAt(1), 10);
    const text = $el.text().trim();
    const id = $el.attr("id") || text.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");
    $el.attr("id", id);
    toc.push({ text, id, level });
  });

  return { updatedHtml: $("body").html() ?? $.root().html() ?? "", toc };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: `Not found - ${process.env.HOSTNAME}`,
      description: "Sorry, this post was not found.",
      robots: "noindex,nofollow",
    };
  }

  const description = post.excerpt.replace(/<[^>]+>/g, "").trim();

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SHARENAME || "https://yoursite.com"}/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description,
      url: `${process.env.NEXT_PUBLIC_SHARENAME || "https://yoursite.com"}/${post.slug}`,
      type: "article",
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const post = await getPostBySlug(params.slug);
    if (!post) return <NotFound />;
    const { updatedHtml, toc } = await extractHeadings(post.content);

    return <SinglePost initialPost={{ ...post, updatedHtml, toc }} />;
  } catch (e) {
    console.error(e);
    return <NotFound />;
  }
}
