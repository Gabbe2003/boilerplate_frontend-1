"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    adsbygoogle?: any[];
  }
}

export default function AdsenseRouteRefresh() {
  const pathname = usePathname();

  useEffect(() => {
    // Kick AdSense after route changes (helps auto ads in SPAs)
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // ignore
    }
  }, [pathname]);

  return null;
}
