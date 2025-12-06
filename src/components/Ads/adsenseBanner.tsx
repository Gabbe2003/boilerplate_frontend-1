// components/AdSlot.tsx
"use client";

import { useEffect, useRef } from "react";

type Props = {
  adSlot: string; // the slot id from AdSense
  adFormat?: "auto" | "fluid";
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties; // optional size overrides
};

export default function AdSlot({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  style,
}: Props) {
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!adRef.current) return;

    const tryPush = () => {
      const width = adRef.current?.offsetWidth ?? 0;
      if (width === 0) return false;

      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // avoid crashing on navigation / ad blockers
        console.warn("AdSense push failed", e);
      }
      return true;
    };

    // Run once if slot already has a measurable width
    if (tryPush()) return;

    // Retry when the slot gains width (avoids "availableWidth=0")
    const resizeObserver = new ResizeObserver(() => {
      if (tryPush()) resizeObserver.disconnect();
    });

    resizeObserver.observe(adRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  return (
    <ins
      ref={adRef}
      className="adsbygoogle"
      style={{ display: "block", width: "100%", minHeight: "250px", ...style }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}
