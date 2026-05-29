import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { wpRestCached } from "@/lib/WpCachedResponse";
import { WP_REST_BASE } from "./config";
import type { Ad, AdSection, AdsResponse } from "./types";

export async function getSectionAds(
  section: AdSection
): Promise<AdsResponse | null> {
  return wpRestCached<AdsResponse>(
    `${WP_REST_BASE}/ads/${section}`,
    { revalidate: 60, tags: [`ads:${section}`] }
  );
}

// Round-robin cursor per section, kept in server memory. Each load serves the
// next ad; the next load shows the following one, cycling at the end.
const cursors: Partial<Record<AdSection, number>> = {};

export async function getNextSectionAd(
  section: AdSection
): Promise<Ad | null> {
  noStore(); // run per request so the cursor advances on every load
  const ads = (await getSectionAds(section))?.ads ?? [];
  if (!ads.length) return null;

  const i = cursors[section] ?? 0;
  cursors[section] = i + 1;
  return ads[i % ads.length];
}
