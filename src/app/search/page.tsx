// app/search/page.tsx
import Link from "next/link";
import SearchPosts from "../api/search/SearchPosts";
import { Sidebar } from "../components/Main-page/SideBar";
import type { Metadata } from "next";

/* ------------------------- Logging utilities ------------------------- */

const DEBUG_SEARCH =
  process.env.NODE_ENV !== "production" || process.env.DEBUG_SEARCH === "1";

function stripHtml(s?: string) {
  return s ? s.replace(/<[^>]*>/g, "") : "";
}

function sanitize(s?: string) {
  return s ? stripHtml(s).replace(/[\r\n\t]/g, " ").trim() : "";
}

function logSearch(payload: Record<string, unknown>) {
  if (!DEBUG_SEARCH) return;
  try {
    console.log("[search]", JSON.stringify(payload));
  } catch {
    console.log("[search]", payload);
  }
}

/* ------------------------------ Helpers ------------------------------ */

type SearchDict = { [key: string]: string | string[] | undefined };

function getQ(sp?: SearchDict): string {
  const raw = sp?.q;
  const val = Array.isArray(raw) ? raw[0] : raw || "";
  return val.trim();
}

/* ------------------------------ Metadata ----------------------------- */

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchDict>;
}): Promise<Metadata> {
  const sp = await searchParams;
  const q = getQ(sp);
  const SITE = process.env.NEXT_PUBLIC_HOSTNAME ?? "Home";

  // Best practice: noindex search results
  const robots = { index: false, follow: true as const };

  if (!q) {
    return {
      title: "Sökresultat",
      description: `Sökresultat från ${SITE}`,
      robots,
    };
  }

  return {
    title: `Sökresultat för "${q}" - ${SITE}`,
    description: `Sökresultat för "${q}" från ${SITE}`,
    robots,
  };
}

/* ------------------------------- Types -------------------------------- */

type GQLPost = {
  id?: string;
  databaseId?: number;
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  featuredImage?: { node?: { sourceUrl?: string; altText?: string } };
  author?: { node?: { name?: string; slug?: string; avatar?: { url?: string } } };
};

type PageInfo = { hasNextPage: boolean; endCursor?: string | null };

/* --------------------------- Server-side fetch ------------------------ */

async function fetchSearchResultsWithPageInfo(
  q: string,
  first = 6
): Promise<{ nodes: GQLPost[]; pageInfo: PageInfo }> {
  const GRAPHQL_URL = process.env.WP_GRAPHQL_URL!;
  const gql = `
    query SearchPostsFull($search: String!, $first: Int!) {
      posts(
        first: $first,
        where: { search: $search, orderby: { field: DATE, order: DESC }, status: PUBLISH }
      ) {
        pageInfo { hasNextPage endCursor }
        nodes {
          id
          databaseId
          slug
          title(format: RENDERED)
          excerpt(format: RENDERED)
          date
          featuredImage { node { sourceUrl altText } }
          author { node { name slug avatar { url } } }
        }
      }
    }
  `;

  const started = Date.now();
  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", // fresh search results
    body: JSON.stringify({ query: gql, variables: { search: q, first } }),
  });
  const durationMs = Date.now() - started;

  if (!res.ok) {
    logSearch({ q: sanitize(q), first, error: res.statusText, durationMs });
    throw new Error(`GraphQL request failed: ${res.statusText}`);
  }

  const json = await res.json();
  const nodes = (json?.data?.posts?.nodes ?? []) as GQLPost[];
  const pageInfo =
    (json?.data?.posts?.pageInfo ?? { hasNextPage: false, endCursor: null }) as PageInfo;

  // Compact log (query, counts, pagination, timing, sample)
  logSearch({
    q: sanitize(q),
    first,
    count: nodes.length,
    hasNextPage: !!pageInfo?.hasNextPage,
    endCursor: pageInfo?.endCursor ?? null,
    durationMs,
    sample: nodes.slice(0, 3).map((n) => ({
      id: n.id ?? n.databaseId,
      slug: n.slug,
      title: sanitize(n.title),
      date: n.date,
      author: n.author?.node?.name,
    })),
  });

  return { nodes, pageInfo };
}

/* -------------------------------- Page -------------------------------- */

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<SearchDict>;
}) {
  const sp = await searchParams;
  const q = getQ(sp);

  if (!q) {
    logSearch({ q: "", count: 0, reason: "empty-query" });
    return (
      <div className="container mx-auto py-10 px-4">
        <h1 className="text-3xl font-bold mb-4">Search</h1>
        <p className="text-muted-foreground">
          Type a query in the search bar above to see results.
        </p>
      </div>
    );
  }

  // Fetch the first 6 results + pageInfo for button-based pagination
  const { nodes, pageInfo } = await fetchSearchResultsWithPageInfo(q, 6);

  if (nodes.length === 0) {
    logSearch({ q: sanitize(q), count: 0, hasNextPage: false, reason: "no-results" });
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-2">Search results for “{q}”</h1>
      <div className="text-sm text-muted-foreground mb-6">
        Showing {nodes.length} result{nodes.length === 1 ? "" : "s"}.
      </div>

      {/* Main grid: posts and sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Posts */}
        <div className="lg:col-span-2 flex flex-col">
          {nodes.length === 0 ? (
            <div className="mb-8 p-6 rounded-sm border border-gray-200 bg-gray-50 text-center">
              <p className="text-lg font-semibold text-gray-600 mb-4">No results found.</p>
              <div className="text-gray-500 mb-2">
                Try a different keyword or browse our{" "}
                <Link href="/" className="underline">
                  latest posts
                </Link>
                .
              </div>
            </div>
          ) : (
            <SearchPosts
              q={q}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              initialPosts={nodes as any}
              initialPageInfo={pageInfo}
              pageSize={6}
            />
          )}
        </div>

        {/* Sidebar (sticky on large screens) */}
        <aside className="w-full h-full hidden lg:block">
          <div className="sticky top-24 w-[60%]">
            <Sidebar />
          </div>
        </aside>
      </div>
    </div>
  );
}
