"use server"
import { load } from "cheerio";
import { loggedFetch } from "../logged-fetch";

interface Asset {
  sourceUrl: string;
  altText?: string | null;
}

interface SiteAssets {
  favicon: Asset | null;
  logo: Asset | null;
}

const DEFAULT_URL = process.env.HOSTNAME!;

export async function getLogo(): Promise<SiteAssets> {
  try {
    const url = `http://${DEFAULT_URL}`;
    // const res = await fetch(url);
    const res = await loggedFetch(url, {context: 'getLogo'});

    if (!res.ok) {
      return { favicon: null, logo: null };
    }

    const html = await res.text();
    const $ = load(html);
    const base = new URL(`https://${DEFAULT_URL}`);

    // --- FAVICON ---
    const iconEl = $('head link[rel*="icon"]').first();
    const rawHref = iconEl.attr('href') || '';
    const faviconUrl = rawHref ? new URL(rawHref, base).href : '';

    // Attempt to reconstruct original image if it's a resized WP image
    const wpSizeSuffixRegex = /-\d{2,4}x\d{2,4}(?=\.\w{3,4}$)/;
    const originalFaviconUrl = wpSizeSuffixRegex.test(faviconUrl)
      ? faviconUrl.replace(wpSizeSuffixRegex, '')
      : faviconUrl;

    const favicon: Asset | null = rawHref
      ? { sourceUrl: originalFaviconUrl, altText: null }
      : null;

    // --- LOGO ---
    const headerImgs = $('header img');

    const logoImg = headerImgs
      .filter((i, el) => {
        const src = $(el).attr('src') || '';
        return !src.toLowerCase().includes('favicon');
      })
      .first();

    const rawSrc = logoImg.attr('src') || '';
    const resolvedLogoUrl = rawSrc ? new URL(rawSrc, base).href : null;

    const logo: Asset | null = resolvedLogoUrl
      ? {
          sourceUrl: resolvedLogoUrl,
          altText: logoImg.attr('alt') || null,
        }
      : null;

    return { favicon, logo };
  } catch {
    return { favicon: null, logo: null };
  }
}
