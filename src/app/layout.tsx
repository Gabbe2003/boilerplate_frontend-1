import type { ReactNode } from "react";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";

import Footer from "@/components/Footer/Footer";
import HeaderWrapper from "@/components/Header/HeaderWrapper";
import ReadPeakProvider from "@/components/Ads/Ads/Readpeak/ReadProvider";

import "../styles/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="sv">
      <head>
        {/* AdSense (only render if env var exists) */}
 {adsenseClient ? (
    <script
      id="adsense-script"
      async
      crossOrigin="anonymous"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
        adsenseClient
      )}`}
    ></script>
  ) : null}
</head>

      <body>
        <div className="w-full flex flex-col items-center">
          <ReadPeakProvider />
          <HeaderWrapper />

          {children}

          <Footer />
        </div>

        {/* GA generally fine anywhere; keeping it near end is common */}
        <GoogleAnalytics gaId="G-F4PXY0E4LD" />
      </body>
    </html>
  );
}
