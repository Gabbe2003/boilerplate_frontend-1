"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  client: string; // ca-pub-...
  slot: string;   // data-ad-slot
  style?: React.CSSProperties;
};

export default function AdsenseInFeed({ client, slot, style }: Props) {
  const insRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    const el = insRef.current;
    if (!el) return;

    // prevent double init (StrictMode/HMR)
    if (el.getAttribute("data-ad-status")) return;

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.warn("AdSense push failed", e);
    }
  }, []);

  return (
    <ins
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={insRef as any}
      className="adsbygoogle"
      style={style ?? { display: "block" }}
      data-ad-format="fluid"
      data-ad-client={client}
      data-ad-slot={slot}
    />
  );
}
