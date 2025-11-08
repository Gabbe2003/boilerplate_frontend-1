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

// Centralized, safe JSON fetcher: never throws, returns null on failure.
async function fetchJSON<T = unknown>(url: string, init: SignedInit = {}): Promise<T | null> {
  try {
    const { json, headers: initHeaders, ...rest } = init;

    const headers = new Headers(initHeaders ?? {});
    headers.set('Accept', 'application/json');

    if (json !== undefined) {
      rest.method = rest.method ?? 'POST';
      (rest as RequestInit).body = JSON.stringify(json);
      headers.set('Content-Type', 'application/json');
    } else if ((rest.method ?? 'GET').toUpperCase() === 'POST') {
      if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
    }

    const res = await fetch(url, { cache: 'no-store', headers, ...rest });

    const text = await res.text().catch(() => '');
    if (!res.ok) {
      console.error(`[fetchJSON] HTTP ${res.status} ${res.statusText} — ${url}\n${text?.slice(0, 500)}`);
      return null;
    }

    try {
      return JSON.parse(text) as T;
    } catch (e) {
      console.error('[fetchJSON] Failed to parse JSON:', e);
      return null;
    }
  } catch (err) {
    console.error('[fetchJSON] Request failed:', err);
    return null;
  }
}

/** Cached GraphQL call (WPGraphQL). Safe: returns null on any failure (including GraphQL-level errors). */
export async function wpGraphQLCached<T>(
  query: string,
  variables: Record<string, unknown> = {},
  opts: CacheOpts = {}
): Promise<T | null> {
  const endpoint = process.env.WP_GRAPHQL_URL;
  if (!endpoint) {
    console.error('WP_GRAPHQL_URL is not set');
    return null;
  }

  const key = ['wp:gql', stableHash(query), stableHash(variables)];

  const runner = cache(
    async () => {
      try {
        const json = await fetchJSON<any>(endpoint, { json: { query, variables } });
        if (!json) return null;

        // Normalize GraphQL errors (200 OK with { errors: [...] })
        if (json.errors) {
          console.error('[wpGraphQLCached] GraphQL errors:', json.errors);
          return null;
        }

        return json as T;
      } catch (e) {
        console.error('[wpGraphQLCached] Runner failed:', e);
        return null;
      }
    },
    key,
    { revalidate: opts.revalidate ?? 300, tags: opts.tags ?? [] }
  );

  try {
    return await runner();
  } catch (e) {
    // Extra guard: cache layer exceptions
    console.error('[wpGraphQLCached] Cache wrapper failed:', e);
    return null;
  }
}

/** Cached REST call (WP REST endpoints). Safe: returns null on any failure. */
export async function wpRestCached<T>(
  url: string,
  opts: CacheOpts = {},
  init?: SignedInit
): Promise<T | null> {
  const method = (init?.method ?? 'GET').toUpperCase();
  const headersObj = Object.fromEntries(new Headers(init?.headers ?? {}));
  const bodyOrJson = init?.json ?? init?.body ?? null;

  const key = ['wp:rest', stableHash(url), stableHash({ method, headers: headersObj, body: bodyOrJson })];

  const runner = cache(
    async () => {
      try {
        const json = await fetchJSON<T>(url, init);
        return json; // may be null on failures
      } catch (e) {
        console.error('[wpRestCached] Runner failed:', e);
        return null;
      }
    },
    key,
    { revalidate: opts.revalidate ?? 300, tags: opts.tags ?? [] }
  );

  try {
    return await runner();
  } catch (e) {
    console.error('[wpRestCached] Cache wrapper failed:', e);
    return null;
  }
}

/** Raw (uncached) WPGraphQL call. Safe: returns null on any failure (including GraphQL-level errors). */
export async function wpGraphQLRaw<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T | null> {
  const endpoint = process.env.WP_GRAPHQL_URL;
  if (!endpoint) {
    console.error('WP_GRAPHQL_URL is not set');
    return null;
  }

  const json = await fetchJSON<any>(endpoint, { json: { query, variables } });
  if (!json) return null;

  if (json.errors) {
    console.error('[wpGraphQLRaw] GraphQL errors:', json.errors);
    return null;
  }

  return json as T;
}

/** Pick the smallest bucket >= n; otherwise return the largest bucket. */
export function pickBucket(n: number, buckets: number[]): number {
  const sorted = [...buckets].sort((a, b) => a - b);
  for (const b of sorted) if (n <= b) return b;
  return sorted[sorted.length - 1];
}
