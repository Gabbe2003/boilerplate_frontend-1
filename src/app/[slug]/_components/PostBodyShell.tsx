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

// Insert after which H2 sections? (1 = after first H2 section)
const INSERT_AFTER_H2: [number, number] = [1, 2];

function splitByH2Sections(html: string): string[] {
  // [introBeforeFirstH2, (h2 + content until next h2), (h2 + content), ...]
  const re = /<h2\b[^>]*>/gi;
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

function extractHtmlFromChildren(children: React.ReactNode): string | null {
  // Case 1: children is just an HTML string
  if (typeof children === "string") return children;

  // Case 2: children is an element that already uses dangerouslySetInnerHTML
  if (React.isValidElement(children)) {
    const props: any = children.props;
    const html = props?.dangerouslySetInnerHTML?.__html;
    if (typeof html === "string") return html;
  }

  // Otherwise we can't safely inject "inside text"
  return null;
}

export default function PostBodyShell({
  children,
}: {
  children: React.ReactNode;
  featured?: FeaturedNode | null;
}) {
  const html = extractHtmlFromChildren(children);

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
            const sections = splitByH2Sections(html);
            let h2Count = 0;

            return sections.map((chunk, i) => {
              const isH2Section = /^<h2\b/i.test(chunk.trim());
              if (isH2Section) h2Count++;

              return (
                <div key={i}>
                  <div dangerouslySetInnerHTML={{ __html: chunk }} />

                  {isH2Section && h2Count === INSERT_AFTER_H2[0] ? (
                    <AdsenseAd
                      client={ADSENSE_CLIENT}
                      slot={SLOT_AFTER_H2_1}
                      format="auto"
                    />
                  ) : null}

                  {isH2Section && h2Count === INSERT_AFTER_H2[1] ? (
                    <AdsenseAd
                      client={ADSENSE_CLIENT}
                      slot={SLOT_AFTER_H2_2}
                      format="auto"
                    />
                  ) : null}
                </div>
              );
            });
          })()
        ) : (
          // Fallback: if children isn't HTML we can split, render normally
          children
        )}
      </div>
    </article>
  );
}
