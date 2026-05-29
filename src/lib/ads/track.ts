import { WP_REST_BASE } from "./config";
import type { AdSection } from "./types";

const TRACK_BASE = `${WP_REST_BASE}/track`;

function send(url: string) {
  if (typeof window === "undefined") return;
  try {
    if ("sendBeacon" in navigator && navigator.sendBeacon(url)) return;
  } catch {
    /* fall through to fetch */
  }
  fetch(url, { method: "POST", keepalive: true }).catch(() => {});
}

export function trackImpression(section: AdSection, id: number) {
  send(`${TRACK_BASE}/impression/${section}/${id}`);
}

export function trackClick(section: AdSection, id: number) {
  send(`${TRACK_BASE}/click/${section}/${id}`);
}
