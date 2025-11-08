import "server-only";
import type { Metadata } from "next";
import { wpGraphQLCached } from "../WpCachedResponse";

// ----------------------
// ✅ CONFIGURATION
// ----------------------

const SITE_URL = process.env.SITE_URL ?? "https://finanstidning.se";
const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL;
const SITE_LOGO_URL = process.env.SITE_LOGO_URL ?? `${SITE_URL}/favicon.ico`;
const SITE_NAME = process.env.SITE_NAME ?? "Finanstidning";

// Fix a better description
const SITE_DESC =
  "Få dagliga nyheter om finans, aktier, finansnyheter och börsen. Håll dig uppdaterad med de senaste marknadstrenderna och ekonominyheterna.";

if (!WP_GRAPHQL_URL) throw new Error("Missing WP_GRAPHQL_URL");

// ----------------------
// ✅ LOCAL OG TYPES (fixes `images[0]?.url` errors)
// ----------------------
type OGImageInput = string | { url: string; width?: number; height?: number };

// Derive the base OG type from Next's Metadata, then force-include `type`
type OGBase = NonNullable<Metadata["openGraph"]>;
type OGType = OGBase extends { type?: infer T } ? T : string;

type OpenGraphFixed = Omit<OGBase, "images"> & {
  images?: OGImageInput | OGImageInput[];
  /** Ensure `type` exists across Next versions */
  type?: OGType;
};

// Helper to safely pick one image URL from OpenGraphFixed.images
function getOgImageUrl(og?: OpenGraphFixed): string | undefined {
  const images = og?.images;
  if (Array.isArray(images)) {
    const first = images[0];
    return typeof first === "string" ? first : first?.url;
  }
  return typeof images === "string" ? images : images?.url;
}

// ----------------------
// ✅ SHARED QUERY
// ----------------------

const SEO_BY_URI = /* GraphQL */ `
  query SeoByUri($uri: String!) {
    nodeByUri(uri: $uri) {
      __typename
      ... on NodeWithRankMathSeo {
        seo {
          title
          description
          canonicalUrl
          focusKeywords
          robots
          openGraph {
            title
            description
            type
            url
            siteName
            image { url }
          }
        }
      }
      ... on NodeWithTitle { title }
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            sourceUrl
            mediaDetails { width height }
          }
        }
      }
      ... on NodeWithAuthor {
        author { node { name uri } }
      }
      ... on Post { date modified }
      ... on Page { date modified }
    }
    generalSettings { title description }
  }
`;

// ----------------------
// ✅ HELPERS
// ----------------------

async function fetchGraphQL<T>(query: string, variables: Record<string, any>): Promise<T> {
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

function parseRobots(content?: unknown): Metadata["robots"] | undefined {
  if (!content) return;
  if (typeof content === "object" && !Array.isArray(content)) {
    const obj = content as Record<string, boolean>;
    return { index: obj.index !== false, follow: obj.follow !== false };
  }
  const arr = Array.isArray(content) ? content.map(String) : String(content).split(",");
  const lower = arr.map((v) => v.trim().toLowerCase());
  return { index: !lower.includes("noindex"), follow: !lower.includes("nofollow") };
}

function normalizeFocusKeywords(raw: any): string[] | undefined {
  if (!raw) return;
  if (Array.isArray(raw)) return raw.map((k) => String(k).trim());
  if (typeof raw === "object") return Object.values(raw).map((k) => String(k).trim());
  if (typeof raw === "string") return raw.split(",").map((k) => k.trim());
  return;
}

function buildMetadata({
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
      // Twitter expects string | URL | (string|URL)[]
      images: getOgImageUrl(openGraph),
    },
  };
}

function buildJsonLd({
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
    legalName: `${SITE_NAME}`,
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
// ✅ MAIN FUNCTION
// ----------------------

export async function getWpSeo(uri: string): Promise<{
  metadata: Metadata;
  jsonLd: Array<Record<string, any>>;
}> {
  try {
    const data = await wpGraphQLCached<any>(SEO_BY_URI, { uri });
    const node = data.nodeByUri;
    const general = data.generalSettings ?? {};

    // --------------------------------------------------
    // ✅ Fallback if node not found (page missing)
    // --------------------------------------------------
    if (!node) {
      console.warn(`⚠️ No node found for URI "${uri}" – using fallback SEO.`);
      const fallbackTitle = `Dagliga nyheter inom finansnyheter, aktier och börsen`;
      const fallbackDesc = SITE_DESC;
      const canonical = `${SITE_URL}${uri}`;

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

    // --------------------------------------------------
    // ✅ Build Metadata + JSON-LD for existing node
    // --------------------------------------------------
    const seo = node.seo ?? {};
    const title = seo.title ?? node.title ?? general.title ?? SITE_NAME;
    const description = seo.description ?? general.description ?? SITE_DESC;
    const canonical = seo.canonicalUrl ?? `${SITE_URL}${uri}`;
    const robots = parseRobots(seo.robots);
    const focusKeywords = normalizeFocusKeywords(seo.focusKeywords);

    const og = seo.openGraph ?? {};
    const featuredImage = node.featuredImage?.node;

    const openGraph: OpenGraphFixed = {
      title: og.title ?? title,
      description: og.description ?? description,
      url: og.url ?? canonical,
      type: (og.type as OGType) ?? "article",
      siteName: og.siteName ?? general.title ?? SITE_NAME,
      images: featuredImage
        ? [
            {
              url: featuredImage.sourceUrl,
              width: featuredImage.mediaDetails?.width,
              height: featuredImage.mediaDetails?.height,
            },
          ]
        : og.image?.url
        ? [{ url: og.image.url }]
        : [{ url: SITE_LOGO_URL }],
    };

    return {
      metadata: buildMetadata({
        title,
        description,
        canonical,
        focusKeywords,
        robots,
        openGraph,
      }),
      jsonLd: buildJsonLd({ node, title, description, canonical, openGraph }),
    };
  } catch (err) {
    const fallbackTitle = `Dagliga nyheter inom finansnyheter, aktier och börsen`;
    const fallbackDesc = SITE_DESC;
    const canonical = `${SITE_URL}${uri}`;

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
}
