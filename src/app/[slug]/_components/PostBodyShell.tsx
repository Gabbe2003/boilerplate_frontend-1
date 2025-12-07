/* eslint-disable @typescript-eslint/no-explicit-any */
// PostBodyShell.tsx
import React from "react";

import type { Post } from "@/lib/types";
import AdsenseAd from "@/app/adsGoogle";

type FeaturedNode = NonNullable<Post["featuredImage"]>["node"];

// ✅ Configure here (no prop changes)
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";
const SLOT_AFTER_H2_1 = "2090091228";
const SLOT_AFTER_H2_2 = "2090091228";

// Insert after which heading sections? (1 = after first matched section)
const INSERT_AFTER: [number, number] = [1, 2];

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

            let headingCount = 0;

            return sections.map((chunk, i) => {
              const trimmed = chunk.trim();
              const startsWithH2 = /^<h2\b/i.test(trimmed);
              const startsWithH3 = /^<h3\b/i.test(trimmed);
              const isHeadingSection = startsWithH2 || startsWithH3;

              if (isHeadingSection) headingCount++;

              if (isHeadingSection) {
                console.log(
                  `[PostBodyShell] section ${i} heading #${headingCount} type=${
                    startsWithH2 ? "h2" : "h3"
                  }`
                );
              }

              const shouldInsertFirst = isHeadingSection && headingCount === INSERT_AFTER[0];
              const shouldInsertSecond = isHeadingSection && headingCount === INSERT_AFTER[1];

              if (shouldInsertFirst) console.log("[PostBodyShell] inserting ad #1 after headingCount", headingCount);
              if (shouldInsertSecond) console.log("[PostBodyShell] inserting ad #2 after headingCount", headingCount);

              return (
                <div key={i}>
                  <div dangerouslySetInnerHTML={{ __html: chunk }} />

                  {shouldInsertFirst ? (
                    <AdsenseAd client={ADSENSE_CLIENT} slot={SLOT_AFTER_H2_1} format="auto" />
                  ) : null}

                  {shouldInsertSecond ? (
                    <AdsenseAd client={ADSENSE_CLIENT} slot={SLOT_AFTER_H2_2} format="auto" />
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
