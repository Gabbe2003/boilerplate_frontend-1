'use client';

import React, { useEffect, useMemo, useRef } from 'react';

declare global {
  interface Window {
    __rpplc?: unknown[];
    _rpplc?: unknown[];
  }
}

export interface ReadPeakSlotProps {
  /** ReadPeak campaign id */
  id: string;
  numberOfAds?: number;
  width?: number;
  height?: number;
  gdprConsent?: string;
  cats?: string[];
  tags?: string[];
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Dynamically injects a ReadPeak ad slot
 */
export const ReadPeakSlot: React.FC<ReadPeakSlotProps> = ({
  id,
  numberOfAds = 1,
  width = 1450,
  height = 450,
  gdprConsent = '',
  cats = [],
  tags = [],
  className,
  style,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);

  const catsKey = useMemo(() => cats.join(','), [cats]);
  const tagsKey = useMemo(() => tags.join(','), [tags]);

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    container.innerHTML = ''; // reset container before injecting

    const script = document.createElement('script');
    script.type = 'text/javascript';

    const safeCount = Math.max(0, Math.min(4, Number(numberOfAds) || 0));

    script.innerHTML = `
      (function(){
        var settings = {
          id: '${id}',
          width: '${width}',
          height: '${height}',
          gdpr_consent: '${gdprConsent}',
          cats: ${JSON.stringify(cats)},
          tags: ${JSON.stringify(tags)},
          numberOfAds: ${safeCount}
        };
        var element = document.currentScript || (function(){
          var s = document.querySelectorAll('script');
          return s[s.length - 1];
        })();
        window._rpplc = window._rpplc || [];
        window.__rpplc = window.__rpplc || [];
        window.__rpplc.push(settings, element);
      })();
    `;

    container.appendChild(script);
  }, [id, numberOfAds, gdprConsent, catsKey, tagsKey]);
  
  console.log(className);
  return (
    <div
      ref={hostRef}
      className={className}
      aria-label="Sponsored content"
      role="region"
    />
  );
};
