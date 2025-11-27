import "server-only"


import { ITOCItem } from "@/lib/types";
import { load } from "cheerio";



export function extractHeadings(html: string):{ updatedHtml: string; toc: ITOCItem[] } {
  if(!html){
    console.error("Something went wrong.");
    return {
        updatedHtml: "",
        toc: []
    };
  }
  const $ = load(html);
  const toc: ITOCItem[] = [];

  $('h2, h3').each((_, el) => {
    const $el = $(el);
    const tag = el.tagName.toLowerCase();
    const level = parseInt(tag.charAt(1), 10);
    const text = $el.text().trim();

    const id =
      $el.attr('id') ||
      text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '');

    $el.attr('id', id);
    toc.push({ text, id, level });
  });

  const updatedHtml = $('body').html() ?? $.root().html() ?? '';
  return { updatedHtml, toc };
}

