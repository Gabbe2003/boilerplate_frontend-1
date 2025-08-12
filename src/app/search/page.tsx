import Link from "next/link";
import SearchPosts from "../api/search/SearchPosts";
import { Sidebar } from "../components/Main-page/SideBar";


export const metadata = {
  title: `${process.env.NEXT_PUBLIC_HOSTNAME} | Search`
}

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

// Server-side fetch for initial 6 + pageInfo
async function fetchSearchResultsWithPageInfo(q: string, first = 6): Promise<{
  nodes: GQLPost[];
  pageInfo: PageInfo;
}> {
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

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store", // fresh search
    body: JSON.stringify({ query: gql, variables: { search: q, first } }),
  });

  if (!res.ok) throw new Error(`GraphQL request failed: ${res.statusText}`);
  const json = await res.json();

  const nodes = (json?.data?.posts?.nodes ?? []) as GQLPost[];
  const pageInfo =
    (json?.data?.posts?.pageInfo ?? { hasNextPage: false, endCursor: null }) as PageInfo;

  return { nodes, pageInfo };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = (searchParams?.q || "").trim();

  if (!q) {
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
              <p className="text-lg font-semibold text-gray-600 mb-4">
                No results found.
              </p>
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
