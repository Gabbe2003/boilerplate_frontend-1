"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

type Props = {
  slot?: string;
  format?: "auto" | "horizontal" | "vertical" | "rectangle";
  style?: React.CSSProperties;
  className?: string;
};

export default function AdSenseBanner({
  slot = process.env.NEXT_PUBLIC_ADSENSE_CLIENT,
  format = "auto",
  style,
  className,
}: Props) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  useEffect(() => {
    if (!client || !slot) return;

    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers + hydration quirks can cause push to fail; safe to ignore.
    }
  }, [client, slot]);

  if (!client || !slot) return null;

  return (
    <ins
      className={`adsbygoogle ${className ?? ""}`}
      style={{
        display: "block",
        ...style,
      }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
