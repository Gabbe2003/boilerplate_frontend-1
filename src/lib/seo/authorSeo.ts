import type { Metadata } from "next";
import { Author } from "../types";

const SITE_URL = process.env.SITE_URL ?? "https://finanstidning.se";
const SITE_NAME = process.env.SITE_NAME ?? "Finanstidning";
const SITE_LOGO_URL = process.env.SITE_LOGO_URL ?? `${SITE_URL}/favicon.ico`;

function getAuthorCanonical(slug: string): string {
  return `${SITE_URL}/forfattare/${slug}`;
}

// ✅ 1. Build Metadata (OpenGraph + Twitter)
function buildAuthorMetadata(author: Author): Metadata {
  const title = author.seo?.title ?? `${author.name} – ${SITE_NAME}`;
  const description =
    author.description ??
    `Läs artiklar och nyheter skrivna av ${author.name} på ${SITE_NAME}.`;

  const canonical = getAuthorCanonical(author.slug);
  const avatar = author.avatar?.url ?? SITE_LOGO_URL;

  const openGraph: Metadata["openGraph"] = {
    title,
    description,
    url: canonical,
    type: "profile",
    siteName: SITE_NAME,
    images: [{ url: avatar }],
  };

  return {
    title,
    description,
    alternates: { canonical },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [avatar],
    },
  };
}

// ✅ 2. Build JSON-LD (Person Schema)
function buildAuthorJsonLd(author: Author): Array<Record<string, any>> {
  const canonical = getAuthorCanonical(author.slug);
  const avatar = author.avatar?.url ?? SITE_LOGO_URL;

  const PUBLISHER_ORG = {
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    foundingDate: "2025-10-02",
    legalName: `${SITE_NAME}`,
    logo: {
      "@type": "ImageObject",
      url: SITE_LOGO_URL,
      width: 512,
      height: 512,
    },
    sameAs: [
      "https://www.facebook.com/finanstidning/",
      "https://twitter.com/finanstidning",
      "https://www.linkedin.com/company/finanstidning/",
    ],
  };

  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    description:
      author.description ??
      `Läs artiklar och nyheter skrivna av ${author.name} på ${SITE_NAME}.`,
    url: canonical,
    image: avatar,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    worksFor: PUBLISHER_ORG,
  };

  return [jsonLd];
}

// ✅ 3. Unified helper
export function getAuthorSeo(author: Author): {
  metadata: Metadata;
  jsonLd: Array<Record<string, any>>;
} {
  return {
    metadata: buildAuthorMetadata(author),
    jsonLd: buildAuthorJsonLd(author),
  };
}
