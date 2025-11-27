import type { Metadata } from "next";

export const SITE_URL = process.env.SITE_URL ?? "https://finanstidning.se";
export const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL;
export const SITE_LOGO_URL = process.env.SITE_LOGO_URL ?? `${SITE_URL}/favicon.ico`;
export const SITE_NAME = process.env.SITE_NAME ?? process.env.NEXT_PUBLIC_HOSTNAME ?? "Finanstidning";
export const SITE_DESC = process.env.SITE_DESC ?? "Få dagliga nyheter om finans, aktier, finansnyheter och börsen. Håll dig uppdaterad med de senaste marknadstrenderna och ekonominyheterna.";

if (!WP_GRAPHQL_URL) throw new Error("Missing WP_GRAPHQL_URL");

export type OGImageInput = string | { url: string; width?: number; height?: number };
export type OGBase = NonNullable<Metadata["openGraph"]>;
export type OGType = OGBase extends { type?: infer T } ? T : string;

export type OpenGraphFixed = Omit<OGBase, "images"> & {
  images?: OGImageInput | OGImageInput[];
  type?: OGType;
};

export async function fetchGraphQL<T>(query: string, variables: Record<string, any>): Promise<T> {
  const res = await fetch(WP_GRAPHQL_URL!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300 },
  });

  if (!res.ok) throw new Error(`GraphQL Error: ${res.statusText}`);
  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL errors:", json.errors);
    throw new Error("GraphQL query failed.");
  }

  return json.data;
}


export function getOgImageUrl(og?: OpenGraphFixed): string | undefined {
  const images = og?.images;
  if (Array.isArray(images)) {
    const first = images[0];
    return typeof first === "string" ? first : first?.url;
  }
  return typeof images === "string" ? images : images?.url;
}

export function parseRobots(content?: unknown): Metadata["robots"] | undefined {
  if (!content) return;
  if (typeof content === "object" && !Array.isArray(content)) {
    const obj = content as Record<string, boolean>;
    return { index: obj.index !== false, follow: obj.follow !== false };
  }
  const arr = Array.isArray(content) ? content.map(String) : String(content).split(",");
  const lower = arr.map((v) => v.trim().toLowerCase());
  return { index: !lower.includes("noindex"), follow: !lower.includes("nofollow") };
}

export function normalizeFocusKeywords(raw: any): string[] | undefined {
  if (!raw) return;
  if (Array.isArray(raw)) return raw.map((k) => String(k).trim());
  if (typeof raw === "object") return Object.values(raw).map((k) => String(k).trim());
  if (typeof raw === "string") return raw.split(",").map((k) => k.trim());
  return;
}


export function buildMetadata({
  title,
  description,
  canonical,
  focusKeywords,
  robots,
  openGraph,
}: {
  title: string;
  description: string;
  canonical: string;
  focusKeywords?: string[];
  robots?: Metadata["robots"];
  openGraph: OpenGraphFixed;
}): Metadata {
  return {
    title,
    description,
    keywords: focusKeywords,
    robots,
    alternates: { canonical },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: getOgImageUrl(openGraph),
    },
  };
}

export function buildJsonLd({
  node,
  title,
  description,
  canonical,
  openGraph,
}: {
  node?: any;
  title: string;
  description: string;
  canonical: string;
  openGraph: OpenGraphFixed;
}): Array<Record<string, any>> {
  const PUBLISHER_ORG = {
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    url: SITE_URL,
    foundingDate: "2025-10-02",
    legalName: SITE_NAME,
    logo: { "@type": "ImageObject", url: SITE_LOGO_URL, width: 512, height: 512 },
    sameAs: [
      "https://www.facebook.com/finanstidning/",
      "https://twitter.com/finanstidning",
      "https://www.linkedin.com/company/finanstidning/",
    ],
  };

  if (node?.__typename === "Post") {
    return [
      {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        mainEntityOfPage: canonical,
        headline: title,
        description,
        image: getOgImageUrl(openGraph),
        author: node.author
          ? { "@type": "Person", name: node.author.node.name, url: `${SITE_URL}${node.author.node.uri}` }
          : undefined,
        publisher: PUBLISHER_ORG,
        datePublished: node.date,
        dateModified: node.modified ?? node.date,
      },
    ];
  }

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      inLanguage: "sv-SE",
      isAccessibleForFree: true,
      identifier: SITE_URL,
      name: title,
      description,
      url: canonical,
      publisher: PUBLISHER_ORG,
    },
  ];
}

// ----------------------
// ✅ FALLBACK BUILDER (DRY version)
// ----------------------

export function buildFallback(uri: string): {
  metadata: Metadata;
  jsonLd: Array<Record<string, any>>;
} {
  const normalizedUri = uri.startsWith("/") ? uri : `/${uri}`;
  const canonical = `${SITE_URL}${normalizedUri}`;
  const fallbackTitle = `Dagliga nyheter inom finansnyheter, aktier och börsen`;
  const fallbackDesc = SITE_DESC;

  const fallbackOG: OpenGraphFixed = {
    title: fallbackTitle,
    description: fallbackDesc,
    url: canonical,
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: SITE_LOGO_URL, width: 512, height: 512 }],
  };

  return {
    metadata: buildMetadata({
      title: fallbackTitle,
      description: fallbackDesc,
      canonical,
      openGraph: fallbackOG,
    }),
    jsonLd: buildJsonLd({
      title: fallbackTitle,
      description: fallbackDesc,
      canonical,
      openGraph: fallbackOG,
    }),
  };
}
