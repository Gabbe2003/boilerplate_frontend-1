// app/sitemap.ts
import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_HOST_URL!;

type WpNode = { uri: string; modifiedGmt?: string | null };
type TermNode = { uri: string };

type PageInfo = { hasNextPage: boolean; endCursor: string | null };

type ContentResponse = {
  data: {
    contentNodes?: {
      nodes: WpNode[];
      pageInfo: PageInfo;
    };
    categories?: {
      nodes: TermNode[];
      pageInfo: PageInfo;
    };
  };
  errors?: unknown;
};

const CONTENT_QUERY = `
  query Content($first: Int!, $after: String) {
    contentNodes(
      first: $first
      after: $after
      where: { status: PUBLISH, contentTypes: [POST, PAGE] }
    ) {
      nodes {
        ... on Post { uri modifiedGmt }
        ... on Page { uri modifiedGmt }
      }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

const CATEGORIES_QUERY = `
  query Categories($first: Int!, $after: String) {
    categories(first: $first, after: $after, where: { hideEmpty: true }) {
      nodes { uri }
      pageInfo { hasNextPage endCursor }
    }
  }
`;

const staticRoutes = ["/", "/about", "/contact", "/work", "/privacy"];

async function fetchAllPaginated<T extends WpNode | TermNode>(
  query: string,
  rootKey: "contentNodes" | "categories",
  first = 250
): Promise<T[]> {
  const results: T[] = [];
  const endpoint = process.env.WP_GRAPHQL_URL!;
  let after: string | null = null;
  let prevCursor: string | null = null;
  let safetyCount = 0;

  while (true) {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ query, variables: { first } }),
      next: { revalidate: 3600, tags: ["sitemap", rootKey] },
    });

    if (!res.ok) {
      console.error(`[Sitemap] GQL error ${res.status}: ${await res.text()}`);
      break;
    }

    const json = (await res.json()) as ContentResponse;

    if (!json?.data?.[rootKey]) break;
    const conn = json.data[rootKey]!;
    results.push(...(conn.nodes as T[]));

    // 🧠 Safe pagination control
    const cursor = conn.pageInfo?.endCursor ?? null;
    if (!conn.pageInfo?.hasNextPage || cursor === prevCursor) break;
    prevCursor = cursor;
    after = cursor;

    if (++safetyCount > 100) {
      console.warn("[Sitemap] Safety stop: pagination exceeded 100 pages");
      break;
    }
  }

  return results;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  const now = new Date();

  // Static routes
  for (const path of staticRoutes) {
    urls.push({
      url: new URL(path, BASE_URL).toString(),
      lastModified: now,
    });
  }

  // Posts + Pages
  const contentNodes = await fetchAllPaginated<WpNode>(CONTENT_QUERY, "contentNodes");
  for (const node of contentNodes) {
    urls.push({
      url: new URL(node.uri, BASE_URL).toString(),
      lastModified: node.modifiedGmt ? new Date(node.modifiedGmt) : now,
    });
  }

  // Categories
  const categories = await fetchAllPaginated<TermNode>(CATEGORIES_QUERY, "categories");
  for (const term of categories) {
    urls.push({
      url: new URL(term.uri, BASE_URL).toString(),
      lastModified: now,
    });
  }

  return urls;
}
