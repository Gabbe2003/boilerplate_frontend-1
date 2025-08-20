// lib/seo-helpers.ts
import type { Metadata } from 'next';
import { getSeo, buildMetadataFromSeo } from '@/lib/seo/seo';

const ensureLeadingTrailingSlash = (p: string) => {
  const s = p.startsWith('/') ? p : `/${p}`;
  return s.endsWith('/') ? s : `${s}/`;
};

type Kind = 'tag' | 'category' | 'author' | 'auto';


function candidateUris(slug: string, kind: Kind): string[] {
  const s = slug.replace(/^\/+|\/+$/g, '');

  switch (kind) {
    case 'tag':
      return [ensureLeadingTrailingSlash(`tag/${s}`), ensureLeadingTrailingSlash(s)];
    case 'category':
      return [ensureLeadingTrailingSlash(`category/${s}`), ensureLeadingTrailingSlash(s)];
    case 'author':
      return [ensureLeadingTrailingSlash(`author/${s}`), ensureLeadingTrailingSlash(s)];
    case 'auto':
    default:
      return [
        ensureLeadingTrailingSlash(`category/${s}`),
        ensureLeadingTrailingSlash(`tag/${s}`),
        ensureLeadingTrailingSlash(`author/${s}`),
        ensureLeadingTrailingSlash(s),
      ];
  }
}

export async function getBestSeoBySlug(
  slug: string,
  kind: Kind,
  opts?: { metadataBase?: string; siteName?: string; defaultOgImage?: string }
): Promise<{ meta: Metadata; resolvedUri: string; found: boolean }> {
  const base = process.env.NEXT_PUBLIC_HOST_URL!;
  const candidates = candidateUris(slug, kind);

  for (const uri of candidates) {
    console.log(uri);
    
    const payload = await getSeo(uri);
    if (payload?.nodeByUri) {
      const meta = buildMetadataFromSeo(payload, {
        metadataBase: opts?.metadataBase ?? base,
        siteName: opts?.siteName ?? process.env.NEXT_PUBLIC_HOSTNAME,
        defaultOgImage: opts?.defaultOgImage ?? process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE,
      });
      // Ensure canonical aligns with what resolved at WP (node.uri or our requested uri fallback already applied).
      return { meta, resolvedUri: uri, found: true };
    }
  }

  // Fallback: last candidate as canonical with noindex
  const last = candidates[candidates.length - 1];
  const canonical = new URL(last.replace(/^\//, ''), base).toString();
  const site = process.env.NEXT_PUBLIC_HOSTNAME ?? '';
  return {
    meta: {
      title: `Not found - ${site}`,
      description: 'Sorry, this page was not found.',
      alternates: { canonical },
      robots: { index: false, follow: false },
      openGraph: {
        title: `Not found - ${site}`,
        description: 'Sorry, this page was not found.',
        url: canonical,
        images: process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE
          ? [{ url: process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE }]
          : undefined,
        type: 'website',
      },
      twitter: {
        card: process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE ? 'summary_large_image' : 'summary',
        title: `Not found - ${site}`,
        description: 'Sorry, this page was not found.',
        images: process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE
          ? [process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE]
          : undefined,
      },
    },
    resolvedUri: last,
    found: false,
  };
}
