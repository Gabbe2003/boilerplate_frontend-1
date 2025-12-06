// components/AdSlot.tsx
"use client";

import { useEffect } from "react";

type Props = {
  adSlot: string;              // the slot id from AdSense
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
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // avoid crashing on navigation / ad blockers
      console.warn("AdSense push failed", e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: "block", ...style }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT}
      data-ad-slot={adSlot}
      data-ad-format={adFormat}
      data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
    />
  );
}
