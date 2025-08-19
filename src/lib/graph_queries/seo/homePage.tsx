// components/HomePageSEO.tsx
import React from "react";

const WP_GRAPHQL_URL =
  process.env.WP_GRAPHQL_URL ?? "http://boilerplate.local/graphql";

type Robots = string[];

type OGImage = {
  url: string | null;
  width: number | null;
  height: number | null;
} | null;

type RankMathOpenGraph = {
  title: string | null;
  description: string | null;
  image: OGImage;
} | null;

type RankMathJsonLd = { raw: string | null } | null;

type Breadcrumb = { text: string; url: string };

type SeoCommon = {
  title: string | null;
  description: string | null;
  canonicalUrl: string | null;
  robots: Robots | null;
  openGraph: RankMathOpenGraph;
  jsonLd: RankMathJsonLd;
  breadcrumbs: Breadcrumb[] | null;
};

type PageSeo = SeoCommon; // seoScore removed for now

type GeneralSettings = {
  title: string;
  description: string;
  url: string;
};

type NodeByUri =
  | {
      __typename: "Page";
      id: string;
      uri: string;
      isFrontPage: boolean;
      seo: PageSeo;
    }
  | {
      __typename: "ContentType";
      isFrontPage: boolean;
      seo: SeoCommon; // archives often don't expose score anyway
    };

const QUERY = /* GraphQL */ `
  query LayoutHome($homeUri: String = "/") {
    generalSettings {
      title
      description
      url
    }
    nodeByUri(uri: $homeUri) {
      __typename
      ... on Page {
        id
        uri
        isFrontPage
        seo {
          title
          description
          canonicalUrl
          robots
          openGraph {
            title
            description
            image {
              url
              width
              height
            }
          }
          jsonLd { raw }
          breadcrumbs { text url }
          # seoScore { value color }  <-- uncomment if your schema supports these fields
        }
      }
      ... on ContentType {
        isFrontPage
        seo {
          title
          description
          canonicalUrl
          robots
          openGraph {
            title
            description
            image {
              url
              width
              height
            }
          }
          jsonLd { raw }
          breadcrumbs { text url }
        }
      }
    }
  }
`;

async function fetchLayoutHome(): Promise<{
  generalSettings: GeneralSettings;
  nodeByUri: NodeByUri;
}> {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ query: QUERY, variables: { homeUri: "/" } }),
  });
  const json = await res.json();
  if (json.errors?.length) {
    const msg = json.errors.map((e: any) => e.message).join(" | ");
    throw new Error(`GraphQL error: ${msg}`);
  }
  return json.data;
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-3 py-1">
      <div className="font-medium text-sm opacity-80">{label}</div>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function RobotsBadges({ robots }: { robots: Robots | null | undefined }) {
  if (!robots?.length) return <em className="opacity-60">none</em>;
  return (
    <div className="flex flex-wrap gap-2">
      {robots.map((r) => (
        <span key={r} className="rounded-xl border px-2 py-0.5 text-xs">
          {r}
        </span>
      ))}
    </div>
  );
}

/**
 * Server Component: fetches SEO for the homepage and renders it for quick visual comparison.
 * Import into any App Router server component/page and render as <HomePageSEO />.
 */
export default async function HomePageSEO() {
  const { generalSettings, nodeByUri } = await fetchLayoutHome();
  const seo = (nodeByUri as any).seo as PageSeo;

  return (
    <section className="mx-auto max-w-3xl p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Home Page SEO (Rank Math)</h2>

      <div className="rounded-2xl border p-4">
        <h3 className="text-lg font-semibold mb-2">General Settings</h3>
        <Row label="Site Title">{generalSettings.title}</Row>
        <Row label="Site Description">{generalSettings.description}</Row>
        <Row label="Site URL">{generalSettings.url}</Row>
      </div>

      <div className="rounded-2xl border p-4">
        <h3 className="text-lg font-semibold mb-2">Resolved Node</h3>
        <Row label="__typename">{nodeByUri.__typename}</Row>
        {"isFrontPage" in nodeByUri && (
          <Row label="isFrontPage">{String(nodeByUri.isFrontPage)}</Row>
        )}
        {"uri" in nodeByUri && (nodeByUri as any).uri && (
          <Row label="uri">{(nodeByUri as any).uri}</Row>
        )}
      </div>

      <div className="rounded-2xl border p-4">
        <h3 className="text-lg font-semibold mb-2">Meta</h3>
        <Row label="title">{seo?.title ?? <em className="opacity-60">null</em>}</Row>
        <Row label="description">
          {seo?.description ?? <em className="opacity-60">null</em>}
        </Row>
        <Row label="canonicalUrl">
          {seo?.canonicalUrl ?? <em className="opacity-60">null</em>}
        </Row>
        <Row label="robots">
          <RobotsBadges robots={seo?.robots ?? null} />
        </Row>
      </div>

      <div className="rounded-2xl border p-4">
        <h3 className="text-lg font-semibold mb-2">Open Graph</h3>
        <Row label="og:title">{seo?.openGraph?.title ?? <em className="opacity-60">null</em>}</Row>
        <Row label="og:description">
          {seo?.openGraph?.description ?? <em className="opacity-60">null</em>}
        </Row>

        <div className="mt-2">
          <div className="text-sm font-medium opacity-80 mb-2">og:image</div>
          {seo?.openGraph?.image?.url ? (
            <div className="flex items-start gap-4">
              <img
                src={seo.openGraph.image.url}
                alt="OG"
                className="h-24 w-auto rounded-lg border"
              />
              <div className="text-sm">
                <div>url: {seo.openGraph.image.url}</div>
                <div>width: {seo.openGraph.image.width ?? "?"}</div>
                <div>height: {seo.openGraph.image.height ?? "?"}</div>
              </div>
            </div>
          ) : (
            <em className="opacity-60">null</em>
          )}
        </div>
      </div>

      <div className="rounded-2xl border p-4">
        <h3 className="text-lg font-semibold mb-2">JSON‑LD (raw)</h3>
        <pre className="whitespace-pre-wrap text-xs bg-black/5 p-3 rounded-md overflow-x-auto">
{seo?.jsonLd?.raw ?? "null"}
        </pre>
      </div>

      <div className="rounded-2xl border p-4">
        <h3 className="text-lg font-semibold mb-2">Breadcrumbs</h3>
        {seo?.breadcrumbs?.length ? (
          <ol className="list-decimal ml-5 space-y-1 text-sm">
            {seo.breadcrumbs.map((b, i) => (
              <li key={`${b.url}-${i}`}>
                <a href={b.url} className="underline" target="_blank" rel="noreferrer">
                  {b.text}
                </a>
              </li>
            ))}
          </ol>
        ) : (
          <em className="opacity-60">none</em>
        )}
      </div>

      <div className="rounded-2xl border p-4">
        <h3 className="text-lg font-semibold mb-2">Raw JSON</h3>
        <pre className="text-xs bg-black/5 p-3 rounded-md overflow-x-auto">
{JSON.stringify({ generalSettings, nodeByUri }, null, 2)}
        </pre>
      </div>
    </section>
  );
}
