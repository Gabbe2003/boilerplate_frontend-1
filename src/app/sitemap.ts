// app/sitemap.ts
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_HOST_URL!
const WP_GRAPHQL_ENDPOINT = process.env.WP_GRAPHQL_URL!
export const revalidate = 3600 // 1 hour

type WpNode = { uri: string; modifiedGmt?: string | null }
type TermNode = { uri: string }

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
`

const CATEGORIES_QUERY = `
  query Categories($first: Int!, $after: String) {
    categories(first: $first, after: $after, where: { hideEmpty: true }) {
      nodes { uri }
      pageInfo { hasNextPage endCursor }
    }
  }
`

const staticRoutes = ['/', '/about', '/contact', '/work', '/privacy']

// Cursor pagination helper
async function* paginate(
  query: string,
  rootKey: 'contentNodes' | 'categories',
  first = 500
) {
  let after: string | null = null
  do {
    const res = await fetch(WP_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { first, after } }),
      next: { revalidate },
    })
    const json = await res.json()
    if (json.errors) throw new Error(JSON.stringify(json.errors))
    const conn = json.data[rootKey]
    for (const node of conn.nodes as unknown[]) yield node
    after = conn.pageInfo?.hasNextPage ? conn.pageInfo.endCursor : null
  } while (after)
}

// Single sitemap (no chunks, no id)
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = []
  const now = new Date()

  // 1) Static routes
  for (const path of staticRoutes) {
    urls.push({
      url: new URL(path, BASE_URL).toString(),
      lastModified: now,
    })
  }

  // 2) Posts + Pages
  for await (const n of paginate(CONTENT_QUERY, 'contentNodes')) {
    const node = n as WpNode
    urls.push({
      url: new URL(node.uri, BASE_URL).toString(),
      lastModified: node.modifiedGmt ? new Date(node.modifiedGmt) : undefined,
    })
  }

  // 3) Categories
  for await (const n of paginate(CATEGORIES_QUERY, 'categories')) {
    const term = n as TermNode
    urls.push({
      url: new URL(term.uri, BASE_URL).toString(),
    })
  }

  return urls
}
