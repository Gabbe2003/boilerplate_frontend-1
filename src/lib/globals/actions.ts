
import { getAllPosts, getTodaysPosts } from "../graphql_queries/getPost";
import { ITOCItem } from "../types";
import { load } from "cheerio";


export function stripHtml(s = "") {
  return s.replace(/<\/?[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}


export function capitalizeFirstLetter(val : string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}



export function limitExcerpt(text?: string, words = 16) {
  const t = stripHtml(text || "");
  const arr = t.split(/\s+/);
  return arr.length > words ? arr.slice(0, words).join(" ") + "…" : t;
}

export function handleSpecielChar(text: string) {
  return text
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/å/g, "a")
    .replace(/["'`“”‘’]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}


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

  $('h2, h3, h4, h5, h6').each((_, el) => {
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



export function randomIntInclusive(min: number, max: number) {
  const lo = Math.ceil(min);
  const hi = Math.floor(max);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

// src/lib/utils/decodeHTML.ts
const htmlEntities: Record<string, string> = {
  '&amp;': '&',
  '&#038;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&#039;': "'",
  '&#8211;': '–',
  '&#8212;': '—',
  '&#8230;': '…',
  '&#8217;': '’',
  '&#8220;': '“',
  '&#8221;': '”',
};

export function decodeHTML(str?: string | null): string {
  if (!str) return '';
  return str.replace(
    new RegExp(Object.keys(htmlEntities).join('|'), 'g'),
    (m) => htmlEntities[m] || m
  );
}

const stockholmFmt = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Stockholm",
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDateStockholm(iso?: string) {
  if (!iso) return "";
  return stockholmFmt.format(new Date(iso));
}

export function normalizeName(name: string){
  return name
    .split(" ")[0]
    .toLowerCase(); 
}