"use server"
import { load } from "cheerio";

export interface Asset {
  sourceUrl: string;
  altText?: string | null;
}

export interface SiteAssets {
  favicon: Asset | null;
  logo: Asset | null;
}

const DEFAULT_URL = process.env.HOSTNAME!;

export async function getLogo(): Promise<SiteAssets> {
  try {
    const res = await fetch(`https://${DEFAULT_URL}`, { cache: 'no-store' });
    
    if (!res.ok) {
      return { favicon: null, logo: null };
    }
    const html = await res.text();
    const $ = load(html);
    const base = new URL(`https://${DEFAULT_URL}`);

    // find favicon
    const iconEl = $('head link[rel*="icon"]').first();
    const rawHref = iconEl.attr('href') || '';
    let faviconUrl = new URL(rawHref, base).href;
    if (faviconUrl.startsWith('http://')) {
      faviconUrl = faviconUrl.replace(/^http:\/\//, 'https://');
    }

    const favicon = rawHref
      ? { sourceUrl: faviconUrl, altText: null }
      : null;

    // find header logo
    const logoImg = $('header img').first();
    const rawSrc = logoImg.attr('src') || '';
    const logoUrl = rawSrc
      ? new URL(rawSrc, base).href.replace(/^http:\/\//, 'https://')
      : null;

    const logo = logoUrl
      ? { sourceUrl: logoUrl, altText: logoImg.attr('alt') || null }
      : null;

    return { favicon, logo };
  } catch {
    return { favicon: null, logo: null };
  }
}
