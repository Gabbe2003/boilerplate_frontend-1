/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

type Props = {
  client: string;           // ca-pub-...
  slot: string;             // data-ad-slot
  format?: "fluid" | "auto";
  fullWidthResponsive?: boolean; // only relevant if format="auto"
  insStyle?: React.CSSProperties;

  /** Wrapper layout controls (defaults match your snippet) */
  widthPercent?: number;    // default 80
  maxWidth?: number;        // default 1100
  paddingY?: number;        // default 10
  marginY?: number;         // default 20

  enabled?: boolean;
};

export default function AdsenseAd({
  client,
  slot,
  format = "fluid",
  fullWidthResponsive = true,
  insStyle = { display: "block" },

  widthPercent = 80,
  maxWidth = 1100,
  paddingY = 10,
  marginY = 20,

  enabled = true,
}: Props) {
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const el = insRef.current as any as HTMLElement | null;
    if (!el) return;

    // Avoid StrictMode/HMR double init
    if (el.getAttribute("data-ad-status")) return;

    // Avoid "no_div" timing issues
    if (!document.contains(el)) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense push failed", e);
    }
  }, [enabled, client, slot, format]);

  if (!enabled) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: `${paddingY}px 0`,
        margin: `${marginY}px 0`,
      }}
    >
      <div style={{ width: `${widthPercent}%`, maxWidth, margin: "0 auto" }}>
        <ins
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={insRef as any}
          className="adsbygoogle"
          style={insStyle}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={
            format === "auto" ? (fullWidthResponsive ? "true" : "false") : undefined
          }
        />
      </div>
    </div>
  );
};