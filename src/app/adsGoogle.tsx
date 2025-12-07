"use client";

import { useEffect } from "react";

type Props = {
  client: string; // ca-pub-...
  slot: string;   // data-ad-slot
  format?: string;
  layout?: string;
  layoutKey?: string;
  style?: React.CSSProperties;
};

export default function AdsenseBlock({
  client,
  slot,
  format = "fluid",
  layout = "in-article",
  layoutKey,
  style = { display: "block" },
}: Props) {
  useEffect(() => {
    // Trigger ad render after the <ins> is in the DOM
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
     console.log("error during render")
        // Ignore (AdBlock, double-render in dev, etc.)
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={style}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout={layout}
      {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
    />
  );
}
