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
  /** Hide ad description text if present */
  hideDescription?: boolean;
  /** Additional selectors to target description nodes */
  descriptionSelectors?: string[];
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
  hideDescription = false,
  descriptionSelectors,
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

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    const selectors = [
      '.rpplc-desc',
      '.rpplc-description',
      '.rpplc-item-desc',
      '.rpplc-item-description',
      '.rpplc-text',
      '.readpeak-desc',
      '.readpeak-description',
      ...(descriptionSelectors ?? []),
    ].filter(Boolean);

    if (selectors.length === 0) return;

    const updateVisibility = () => {
      container.querySelectorAll(selectors.join(',')).forEach((element) => {
        const node = element as HTMLElement;
        if (hideDescription) {
          node.style.display = 'none';
          node.setAttribute('data-readpeak-hidden-desc', 'true');
        } else if (node.getAttribute('data-readpeak-hidden-desc') === 'true') {
          node.style.removeProperty('display');
          node.removeAttribute('data-readpeak-hidden-desc');
        }
      });
    };

    updateVisibility();

    if (!hideDescription) return;

    // ReadPeak injects content asynchronously; watch for changes to hide descriptions.
    const observer = new MutationObserver(updateVisibility);
    observer.observe(container, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [hideDescription, descriptionSelectors]);
  
  return (
    <div
      ref={hostRef}
      className={`${className}`}
      aria-label="Sponsored content"
      role="region"
    />
  );
};
