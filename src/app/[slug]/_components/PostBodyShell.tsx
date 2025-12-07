/* eslint-disable @typescript-eslint/no-explicit-any */
// PostBodyShell.tsx
import React from "react";

import type { Post } from "@/lib/types";
import AdsenseAd from "@/app/adsGoogle";

type FeaturedNode = NonNullable<Post["featuredImage"]>["node"];

// ✅ Configure here (no prop changes)
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

// Use your 3 ad slots here (can be same, but better to use 3 distinct units)
const SLOT_1 = "2435089044";
const SLOT_2 = "2219466628";
const SLOT_3 = "4485154423";

const TOTAL_ADS = 3;

// Keep ads spaced out: at least this many heading-sections between ads
const MIN_GAP_BETWEEN_ADS = 1;

// Ensure there are enough candidate headings before placing ads
const MIN_CANDIDATE_HEADINGS = 2;

/**
 * Split HTML into: [introBeforeFirstH2orH3, section1, section2, ...]
 * where each section starts with <h2> or <h3> and runs until the next <h2>/<h3>.
 */
function splitByH2H3Sections(html: string): string[] {
  const re = /<(h2|h3)\b[^>]*>/gi;
  const starts: number[] = [];

  let match: RegExpExecArray | null;
  while ((match = re.exec(html)) !== null) starts.push(match.index);

  if (starts.length === 0) return [html].filter((s) => s.trim().length > 0);

  const sections: string[] = [];
  sections.push(html.slice(0, starts[0])); // intro

  for (let i = 0; i < starts.length; i++) {
    const start = starts[i];
    const end = i + 1 < starts.length ? starts[i + 1] : html.length;
    sections.push(html.slice(start, end));
  }

  return sections.filter((s) => s.trim().length > 0);
}

/**
 * Recursively walk children to find an element that uses dangerouslySetInnerHTML,
 * OR a raw HTML string.
 */
function extractHtmlFromChildren(node: React.ReactNode): string | null {
  if (typeof node === "string") return node;

  if (Array.isArray(node)) {
    for (const child of node) {
      const found = extractHtmlFromChildren(child);
      if (found) return found;
    }
    return null;
  }

  if (React.isValidElement(node)) {
    const props: any = node.props;

    const html = props?.dangerouslySetInnerHTML?.__html;
    if (typeof html === "string" && html.trim().length > 0) return html;

    return extractHtmlFromChildren(props?.children);
  }

  return null;
}

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashStringToSeed(s: string): number {
  // deterministic seed from content (so it doesn't change every request)
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Choose up to `count` heading indices (1-based headingCount) to inject ads after,
 * spaced out by `minGap` headings so they don't render right after each other.
 * Deterministic per-article (seeded by html), randomized across articles.
 */
function chooseInjectionHeadingCounts(
  headingTotal: number,
  count: number,
  minGap: number,
  seed: number
): number[] {
  // We only inject after a heading section, so headingCount ranges [1..headingTotal]
  if (headingTotal < MIN_CANDIDATE_HEADINGS) return [];

  const maxAds = Math.min(count, headingTotal);
  const rng = mulberry32(seed);

  // Build candidate positions but avoid the very first heading (often too early)
  const candidates: number[] = [];
  for (let i = 2; i <= headingTotal; i++) candidates.push(i);

  // Shuffle candidates deterministically
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const chosen: number[] = [];
  for (const c of candidates) {
    const ok = chosen.every((x) => Math.abs(x - c) > minGap);
    if (ok) chosen.push(c);
    if (chosen.length >= maxAds) break;
  }

  // If spacing constraint prevented enough picks, relax spacing progressively
  if (chosen.length < maxAds) {
    for (let gap = Math.max(0, minGap - 1); gap >= 0 && chosen.length < maxAds; gap--) {
      for (const c of candidates) {
        if (chosen.includes(c)) continue;
        const ok2 = chosen.every((x) => Math.abs(x - c) > gap);
        if (ok2) chosen.push(c);
        if (chosen.length >= maxAds) break;
      }
    }
  }

  // Sort so they appear in-page order
  chosen.sort((a, b) => a - b);
  return chosen;
}

export default function PostBodyShell({
  children,
}: {
  children: React.ReactNode;
  featured?: FeaturedNode | null;
}) {
  const html = extractHtmlFromChildren(children);

  // ✅ Logs (server component logs appear in server terminal)
  console.log("[PostBodyShell] ADSENSE_CLIENT present:", Boolean(ADSENSE_CLIENT));
  console.log("[PostBodyShell] extracted html length:", html?.length ?? 0);
  console.log("[PostBodyShell] has <h2>:", html ? /<h2\b/i.test(html) : false);
  console.log("[PostBodyShell] has <h3>:", html ? /<h3\b/i.test(html) : false);

  return (
    <article className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div
        className="
          prose prose-lg sm:prose-xl prose-neutral dark:prose-invert
          break-words
          [&_pre]:break-all
          [&_pre]:whitespace-pre-wrap
          [&_pre]:overflow-x-auto
          [&_code]:break-all
          w-full sm:w-[75%] lg:w-[65%]

          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-a:no-underline hover:prose-a:underline
          prose-a:visited:text-blue-700 dark:prose-a:visited:text-blue-500

          [&_h2]:mt-10 [&_h2]:mb-4
          [&_h3]:mt-8 [&_h3]:mb-3
          [&_h4]:mt-6 [&_h4]:mb-2

          [&_p]:text-base
          [&_p]:leading-relaxed
          [&_p]:mb-5
        "
      >
        {html && ADSENSE_CLIENT ? (
          (() => {
            const sections = splitByH2H3Sections(html);
            console.log("[PostBodyShell] total sections:", sections.length);

            // First pass: count heading sections
            let headingTotal = 0;
            for (const chunk of sections) {
              const t = chunk.trim();
              if (/^<(h2|h3)\b/i.test(t)) headingTotal++;
            }

            console.log("[PostBodyShell] headingTotal(h2/h3):", headingTotal);

            const seed = hashStringToSeed(html);
            const injectionHeadingCounts = chooseInjectionHeadingCounts(
              headingTotal,
              TOTAL_ADS,
              MIN_GAP_BETWEEN_ADS,
              seed
            );

            console.log("[PostBodyShell] chosen injection headingCounts:", injectionHeadingCounts);

            // Map headingCount -> which slot to use (in order chosen appears)
            const slots = [SLOT_1, SLOT_2, SLOT_3];
            const headingCountToSlot: Record<number, string> = {};
            injectionHeadingCounts.forEach((hc, idx) => {
              headingCountToSlot[hc] = slots[idx] ?? slots[slots.length - 1];
            });

            // Render pass
            let headingCount = 0;

            return sections.map((chunk, i) => {
              const trimmed = chunk.trim();
              const isHeadingSection = /^<(h2|h3)\b/i.test(trimmed);

              if (isHeadingSection) headingCount++;

              const slotToInsert = isHeadingSection ? headingCountToSlot[headingCount] : undefined;

              if (isHeadingSection) {
                const type = /^<h2\b/i.test(trimmed) ? "h2" : "h3";
                console.log(
                  `[PostBodyShell] section ${i} heading #${headingCount} type=${type} insert=${
                    slotToInsert ? "YES" : "no"
                  }`
                );
              }

              return (
                <div key={i}>
                  <div dangerouslySetInnerHTML={{ __html: chunk }} />

                  {slotToInsert ? (
                    <AdsenseAd client={ADSENSE_CLIENT} slot={slotToInsert} format="auto" />
                  ) : null}
                </div>
              );
            });
          })()
        ) : (
          children
        )}
      </div>
    </article>
  );
}
