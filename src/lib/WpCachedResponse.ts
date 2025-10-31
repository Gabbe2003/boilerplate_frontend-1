// src/lib/wpCached.ts
import { unstable_cache as cache } from 'next/cache';
import crypto from 'node:crypto';

function stableStringify(value: unknown): string {
  if (value === undefined) return 'undefined';
  if (value === null) return 'null';
  if (typeof value === 'string') return value;

  // Sort object keys for deterministic hashing
  const seen = new WeakSet();
  const replacer = (_key: string, val: any) => {
    if (val && typeof val === 'object') {
      if (seen.has(val)) return '[Circular]';
      seen.add(val);
      if (Array.isArray(val)) return val;
      // Sort plain-object keys
      const entries = Object.entries(val).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
      return Object.fromEntries(entries);
    }
    return val;
  };
  return JSON.stringify(value, replacer);
}

function stableHash(input: unknown): string {
  const str = stableStringify(input);
  return crypto.createHash('sha1').update(str).digest('hex');
}

type CacheOpts = {
  revalidate?: number;
  tags?: string[];
};

// Let fetchJSON accept a `json` shortcut like signedFetch does.
type SignedInit = RequestInit & { json?: unknown };

async function fetchJSON(url: string, init: SignedInit = {}) {
  const { json, headers: initHeaders, ...rest } = init;

  const headers = new Headers(initHeaders ?? {});
  headers.set('Accept', 'application/json');

  if (json !== undefined) {
    rest.method = rest.method ?? 'POST';
    rest.body = JSON.stringify(json);
    headers.set('Content-Type', 'application/json');
  } else if ((rest.method ?? 'GET').toUpperCase() === 'POST') {
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }
  }

  const res = await fetch(url, { cache: 'no-store', headers, ...rest });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`[fetchJSON] ${res.status} ${res.statusText} ${body}`);
  }
  return res.json();
}

/** Cached GraphQL call (WPGraphQL). */
export async function wpGraphQLCached<T>(
  query: string,
  variables: Record<string, unknown> = {},
  opts: CacheOpts = {}
): Promise<T> {
  const endpoint = process.env.WP_GRAPHQL_URL;
  if (!endpoint) throw new Error('WP_GRAPHQL_URL is not set');

  const key = ['wp:gql', stableHash(query), stableHash(variables)];

  const runner = cache(
    async () => {
      const data = await fetchJSON(endpoint, {
        json: { query, variables },
      });
      return data as T;
    },
    key,
    { revalidate: opts.revalidate ?? 300, tags: opts.tags ?? [] }
  );

  return runner();
}

/** Cached REST call (WP REST endpoints). */
export async function wpRestCached<T>(
  url: string,
  opts: CacheOpts = {},
  init?: SignedInit
): Promise<T> {
  const method = (init?.method ?? 'GET').toUpperCase();
  const headersObj = Object.fromEntries(new Headers(init?.headers ?? {}));
  const bodyOrJson = init?.json ?? init?.body ?? null;

  const key = [
    'wp:rest',
    stableHash(url),
    stableHash({ method, headers: headersObj, body: bodyOrJson }),
  ];

  const runner = cache(
    async () => {
      const data = await fetchJSON(url, init);
      return data as T;
    },
    key,
    { revalidate: opts.revalidate ?? 300, tags: opts.tags ?? [] }
  );

  return runner();
}



/** Raw (uncached) WPGraphQL call. */
export async function wpGraphQLRaw<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const endpoint = process.env.WP_GRAPHQL_URL;
  if (!endpoint) throw new Error('WP_GRAPHQL_URL is not set');
  return fetchJSON(endpoint, { json: { query, variables } });
}

/** Pick the smallest bucket >= n; otherwise return the largest bucket. */
export function pickBucket(n: number, buckets: number[]): number {
  const sorted = [...buckets].sort((a, b) => a - b);
  for (const b of sorted) if (n <= b) return b;
  return sorted[sorted.length - 1];
}
