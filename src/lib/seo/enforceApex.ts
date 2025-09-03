import type { Metadata } from 'next';

function getHost() {
  return (process.env.NEXT_PUBLIC_HOST_URL || '').replace(/\/$/, '');
}

function getCms() {
  return process.env.NEXT_PUBLIC_CMS_URL?.replace(/\/$/, '');
}

export function sanitizeJsonLd(json: string): string {
  const cms = getCms();
  const host = getHost();
  return cms ? json.replaceAll(cms, host) : json;
}

export function enforceApex(meta: Metadata, path: string): Metadata {
  const host = getHost();
  const withLead = path.startsWith('/') ? path : `/${path}`;
  const canonical = `${host}${withLead.endsWith('/') ? withLead : `${withLead}/`}`;
  meta.alternates = { ...(meta.alternates ?? {}), canonical };
  meta.openGraph = { ...(meta.openGraph ?? {}), url: canonical };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = (meta.other as any)?.jsonLd as string | undefined;
  if (raw) {
    try {
      JSON.parse(raw);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (meta.other as any).jsonLd = sanitizeJsonLd(raw);
    } catch {
      /* ignore invalid JSON */
    }
  }
  return meta;
}
