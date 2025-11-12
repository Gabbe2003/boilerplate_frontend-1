'use client';

import Script from 'next/script';

/**
 * Loads ReadPeak SDK and triggers the ready event.
 * Should be placed once globally, e.g. in root layout or app provider.
 */
export default function ReadPeakProvider() {
  return (
    <>
      {/* Load ReadPeak SDK */}
      <Script
        src="https://static.readpeak.com/js/rp-int.js"
        strategy="beforeInteractive"
      />

      {/* Fire rpplc:ready on load */}
      <Script id="rpplc-onpageload" strategy="afterInteractive">
        {`
          (function triggerRpplcReady() {
            try {
              function fireReady() {
                window._rpplc = window._rpplc || [];
                if (!window.__rpplcReady) {
                  window.__rpplcReady = true;
                  window.dispatchEvent(new Event('rpplc:ready'));
                }
              }
              if (document.readyState === 'complete' || document.readyState === 'interactive') {
                fireReady();
              } else {
                window.addEventListener('load', fireReady, { once: true });
              }
            } catch (err) {
              console.error('[ReadPeak] error triggering rpplc:ready', err);
            }
          })();
        `}
      </Script>
    </>
  );
}
