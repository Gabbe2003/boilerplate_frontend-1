"use client";

import React, { useEffect, useMemo, useRef } from "react";

declare global {
  interface Window {
    __rpplc?: unknown[];
  }
}

export interface AdSlotProps {
  id: string;
  numberOfAds?: number;  // 0–3
  width?: number;        // preview-only
  height?: number;       // preview-only
  gdprConsent?: string;
  cats?: string[];
  tags?: string[];
  className?: string;
  style?: React.CSSProperties;
}

export const AdSlot: React.FC<AdSlotProps> = ({
  id,
  numberOfAds = 1,
  width = 1450,
  height = 450,
  gdprConsent = "",
  cats = [],
  tags = [],
  className,
  style,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);

  // Make stable, simple dependency keys (no JSON.stringify in deps)
  const catsKey = useMemo(() => cats.join(","), [cats]);
  const tagsKey = useMemo(() => tags.join(","), [tags]);

  useEffect(() => {
    if (!hostRef.current) return;

    // clear previous render
    hostRef.current.innerHTML = "";

    const script = document.createElement("script");
    script.type = "text/javascript";

    // clamp per vendor (0–3)
    const safeCount = Math.max(0, Math.min(3, Number(numberOfAds) || 0));

    script.innerHTML = `
      (function(){
        var settings = {
          id: '${id}',
          width: '${width}',
          height: '${height}',
          gdpr_consent: '${gdprConsent || ""}',
          cats: ${JSON.stringify(cats)},
          tags: ${JSON.stringify(tags)},
          numberOfAds: ${safeCount}
        };
        var element = document.currentScript || (function(){
          var s = document.querySelectorAll('script');
          return s[s.length - 1];
        })();
        window._rpplc = window._rpplc || [];
        window.__rpplc.push(settings, element);
      })();
    `;

    hostRef.current.appendChild(script);
  }, [
    id,
    numberOfAds,
    width,
    height,
    gdprConsent,
    catsKey, // <- simple strings in deps
    tagsKey,
  ]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{ width: "100%", ...style }}
      aria-label="Advertisement"
      role="region"
    />
  );
};