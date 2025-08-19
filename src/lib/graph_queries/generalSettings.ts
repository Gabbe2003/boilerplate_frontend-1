// app/server/site-settings.ts
import 'server-only';

/* ----------------------------- Types ----------------------------- */

export type Robots =
  | string
  | {
      index?: string | null;
      follow?: string | null;
      advanced?: (string | null)[] | null;
    }
  | null;

export type NodeSEO = {
  title?: string | null;
  description?: string | null;   // Rank Math GraphQL uses "description"
  canonicalUrl?: string | null;  // ...and "canonicalUrl"
  robots?: Robots;
} | null;

export type SeoSettings = {
  generalSettingsTitle: string | null;
  generalSettingsDescription: string | null;
  generalSettingsUrl: string | null;
  generalSettingsLanguage: string | null;
  generalSettingsTimezone: string | null;
  readingSettingsShowOnFront: 'posts' | 'page' | string | null;
  readingSettingsPageOnFront: number | null;
  readingSettingsPageForPosts: number | null;
  readingSettingsPostsPerPage: number | null;
};

/* ----------------------------- Config ---------------------------- */

const WP_GRAPHQL_URL = process.env.WP_GRAPHQL_URL as string;
if (!WP_GRAPHQL_URL) {
  throw new Error('WP_GRAPHQL_URL is not set (e.g. https://your-site.com/graphql)');
}

/* --------------------------- Fetch helper ------------------------ */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchGraphQL<T = any>(query: string, variables?: Record<string, any>) {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store', // switch to ISR with next: { revalidate: N } once stable
  });
  const json = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!res.ok || (json as any)?.errors) {
    console.error('GraphQL error payload:', JSON.stringify(json, null, 2));
  }
  return json as T;
}

/* -------------------------- Public APIs -------------------------- */

// 1) Small probe to confirm connectivity/schema
export async function probeGraphQL(): Promise<boolean> {
  const q = `query { generalSettings { title url } }`;
  const json = await fetchGraphQL<{ data?: { generalSettings?: { title?: string } } }>(q);
  return !!json?.data?.generalSettings?.title;
}

// 2) Site-wide settings used for SEO fallbacks, base URL, pagination, etc.
export async function getSeoSettings(): Promise<SeoSettings> {
  const q = `
    query SeoSettings {
      allSettings {
        generalSettingsTitle
        generalSettingsDescription
        generalSettingsUrl
        generalSettingsLanguage
        generalSettingsTimezone
      }
    }
  `;
  const json = await fetchGraphQL<{ data?: { allSettings?: SeoSettings } }>(q);
  if (!json?.data?.allSettings) {
    throw new Error('Failed to read allSettings');
  }
  return json.data.allSettings;
}

// 3) Get per-node Rank Math SEO by URI (works for posts/pages/CPTs that resolve via nodeByUri)
export async function getSeoByUri(uri: string): Promise<NodeSEO> {
  const q = `
    query PostSEO($uri: String!) {
      nodeByUri(uri: $uri) {
        __typename
        ... on Post { seo { title description canonicalUrl robots } }
        ... on Page { seo { title description canonicalUrl robots } }
        # Add CPTs if needed:
        # ... on YourCpt { seo { title description canonicalUrl robots } }
      }
    }
  `;
  const json = await fetchGraphQL<{ data?: { nodeByUri?: { seo?: NodeSEO } } }>(q, { uri });
  return json?.data?.nodeByUri?.seo ?? null;
}

// 4) Resolve homepage SEO (handles static front page or posts index)
export async function getHomeSeo(): Promise<NodeSEO> {
  const infoQ = `
    query FrontInfo {
      allSettings {
        readingSettingsShowOnFront
        readingSettingsPageOnFront
      }
    }
  `;
  const info = await fetchGraphQL<{ data?: { allSettings?: { readingSettingsShowOnFront?: string | null; readingSettingsPageOnFront?: number | null } } }>(infoQ);
  const showOnFront = info?.data?.allSettings?.readingSettingsShowOnFront;
  const pageOnFront = info?.data?.allSettings?.readingSettingsPageOnFront;

  // Static front page
  if (showOnFront === 'page' && pageOnFront && Number(pageOnFront) > 0) {
    const q2 = `
      query FrontPageSEO($id: ID!) {
        page(id: $id, idType: DATABASE_ID) {
          seo { title description canonicalUrl robots }
        }
      }
    `;
    const json2 = await fetchGraphQL<{ data?: { page?: { seo?: NodeSEO } } }>(q2, { id: pageOnFront });
    return json2?.data?.page?.seo ?? null;
  }

  // Posts index at "/" (no single Page node)
  // Try root (and optionally alternate blog root if you have one)
  const seo = await getSeoByUri('/');
  if (seo) return seo;
  // Optionally try '/blog/' or another index path if your theme routes posts there:
  // seo = await getSeoByUri('/blog/');
  return seo ?? null;
}

// app/server/site-settings.ts (append at bottom)

export type LatestPostSeo = {
  databaseId: number;
  title: string | null;
  seo: {
    breadcrumbTitle?: string | null;
    canonicalUrl?: string | null;
    description?: string | null;
    title?: string | null;
    robots?: Robots;
    focusKeywords?: string[] | string | null;
    breadcrumbs?: { text?: string | null; url?: string | null; isHidden?: boolean | null }[] | null;
    openGraph?: {
      description?: string | null;
      locale?: string | null;
      siteName?: string | null;
      title?: string | null;
      type?: string | null;
      url?: string | null;
      twitterMeta?: {
        card?: string | null;
        description?: string | null;
        title?: string | null;
      } | null;
    } | null;
    jsonLd?: { raw?: string | null } | null;
  } | null;
};

export async function getLatestPostSeo(): Promise<LatestPostSeo | null> {
  const q = `
    query MyFirstPost {
      posts(first: 1) {
        nodes {
          databaseId
          title
          seo {
            breadcrumbTitle
            canonicalUrl
            description
            title
            robots
            focusKeywords
            breadcrumbs { text url isHidden }
            openGraph {
              description
              locale
              siteName
              title
              type
              url
              twitterMeta {
                card
                description
                title
              }
            }
            jsonLd { raw }
          }
        }
      }
    }
  `;
  const json = await fetchGraphQL<{ data?: { posts?: { nodes?: LatestPostSeo[] } } }>(q);
  const node = json?.data?.posts?.nodes?.[0] ?? null;
  return node;
}



export type UserSeo = {
  name: string | null;
  seo: {
    breadcrumbTitle?: string | null;
    canonicalUrl?: string | null;
    description?: string | null;
    focusKeywords?: string[] | string | null;
    fullHead?: string | null;
    jsonLd?: { raw?: string | null } | null;
    robots?: Robots;
    title?: string | null;
    breadcrumbs?: {
      url?: string | null;
      isHidden?: boolean | null;
    }[] | null;
  } | null;
};

export async function getUsersSeo(): Promise<UserSeo[] | null> {
  const q = `
    query UsersSeo {
      users {
        nodes {
          name
          seo {
            breadcrumbs {
              url
              isHidden
            }
            breadcrumbTitle
            canonicalUrl
            description
            focusKeywords
            fullHead
            jsonLd {
              raw
            }
            robots
            title
          }
        }
      }
    }
  `;
  const json = await fetchGraphQL<{ data?: { users?: { nodes?: UserSeo[] } } }>(q);
  return json?.data?.users?.nodes ?? null;
}


// ---------------------- Sitemap Settings ----------------------

export type SitemapSettings = {
  author?: {
    excludedRoles?: string[] | null;
    excludedUserDatabaseIds?: number[] | null;
    sitemapUrl?: string | null;
    connectedAuthors?: { nodes?: { id?: string | null }[] | null } | null;
  } | null;
  contentTypes?: {
    customImageMetaKeys?: string[] | null;
    isInSitemap?: boolean | null;
    sitemapUrl?: string | null;
    type?: string | null;
    connectedContentNodes?: { nodes?: { uri?: string | null }[] | null } | null;
  }[] | null;
  general?: {
    canPingSearchEngines?: boolean | null;
    excludedPostDatabaseIds?: number[] | null;
    excludedTermDatabaseIds?: number[] | null;
    hasFeaturedImage?: boolean | null;
    hasImages?: boolean | null;
    linksPerSitemap?: number | null;
  } | null;
  taxonomies?: {
    hasEmptyTerms?: boolean | null;
    isInSitemap?: boolean | null;
    sitemapUrl?: string | null;
    type?: string | null;
    connectedTerms?: { nodes?: { uri?: string | null }[] | null } | null;
  }[] | null;
};

export async function getSitemapSettings(): Promise<SitemapSettings | null> {
  const q = `
    query RankMathSitemaps {
      rankMathSettings {
        sitemap {
          author {
            excludedRoles
            excludedUserDatabaseIds
            sitemapUrl
            connectedAuthors {
              nodes {
                id
              }
            }
          }
          contentTypes {
            customImageMetaKeys
            isInSitemap
            sitemapUrl
            type
            connectedContentNodes {
              nodes {
                uri
              }
            }
          }
          general {
            canPingSearchEngines
            excludedPostDatabaseIds
            excludedTermDatabaseIds
            hasFeaturedImage
            hasImages
            linksPerSitemap
          }
          taxonomies {
            hasEmptyTerms
            isInSitemap
            sitemapUrl
            type
            connectedTerms {
              nodes {
                uri
              }
            }
          }
        }
      }
    }
  `;
  const json = await fetchGraphQL<{ data?: { rankMathSettings?: { sitemap?: SitemapSettings } } }>(q);
  return json?.data?.rankMathSettings?.sitemap ?? null;
}


// ---------------------- Rank Math Redirections ----------------------

export type Redirection = {
  databaseId: number;
  dateCreated: string | null;
  dateCreatedGmt: string | null;
  dateLastAccessed: string | null;
  dateLastAccessedGmt: string | null;
  dateModified: string | null;
  dateModifiedGmt: string | null;
  hits: number | null;
  id: string;
  redirectToUrl: string | null;
  sources: {
    comparison?: string | null;
    ignore?: boolean | null;
    pattern?: string | null;
  }[] | null;
  status: string | null;
  type: string | null;
};

export async function getRedirections(): Promise<Redirection[] | null> {
  const q = `
    query RankMathRedirections {
      redirections {
        nodes {
          databaseId
          dateCreated
          dateCreatedGmt
          dateLastAccessed
          dateLastAccessedGmt
          dateModified
          dateModifiedGmt
          hits
          id
          redirectToUrl
          sources {
            comparison
            ignore
            pattern
          }
          status
          type
        }
      }
    }
  `;
  const json = await fetchGraphQL<{ data?: { redirections?: { nodes?: Redirection[] } } }>(q);
  return json?.data?.redirections?.nodes ?? null};