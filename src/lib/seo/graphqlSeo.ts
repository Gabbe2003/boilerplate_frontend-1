import "server-only";
import { wpGraphQLCached } from "../WpCachedResponse";
import {
  SITE_URL,
  fetchGraphQL,
  parseRobots,
  normalizeFocusKeywords,
  buildMetadata,
  buildJsonLd,
  buildFallback,
  OpenGraphFixed,
  OGType,
  SITE_DESC,
  SITE_NAME,
  SITE_LOGO_URL,
} from "./helpers/helpers";

// GraphQL query
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

export async function getWpSeo(uri: string, isSlug?: boolean) {
  const normalizedUri = uri.startsWith("/") ? uri : `/${uri}`;

  try {
    const rawData = isSlug
      ? await fetchGraphQL<any>(SEO_BY_URI, { uri: normalizedUri })
      : await wpGraphQLCached<any>(SEO_BY_URI, { uri: normalizedUri });

    const data = rawData?.data ?? rawData;
    const node = data?.nodeByUri ?? null;
    const general = data?.generalSettings ?? {};

    if (!node || !node.seo?.title) {
      console.warn(`⚠️ No SEO data for "${normalizedUri}" – using fallback.`);
      return buildFallback(normalizedUri);
    }

    const seo = node.seo ?? {};
    const title = seo.title ?? node.title ?? general.title ?? SITE_NAME;
    const description = seo.description ?? general.description ?? SITE_DESC;
    const canonical = seo.canonicalUrl ?? `${SITE_URL}${normalizedUri}`;
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
    console.error("❌ getWpSeo failed:", err);
    return buildFallback(uri);
  }
}
