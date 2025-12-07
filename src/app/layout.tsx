import type { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

import Footer from "@/components/Footer/Footer";
import HeaderWrapper from "@/components/Header/HeaderWrapper";
import ReadPeakProvider from "@/components/Ads/Ads/Readpeak/ReadProvider";

import "../styles/globals.css";
import Script from "next/script";

export default function RootLayout({ children }: { children: ReactNode }) {
  const adsenseClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;

  return (
    <html lang="sv">
      <head>
        {adsenseClient ? (
          <Script
            id="adsense-auto"
            strategy="afterInteractive"
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(
              adsenseClient
            )}`}
            crossOrigin="anonymous"
          />
        ) : null}
      </head>


      <body>
        <div className="w-full flex flex-col items-center">
          <ReadPeakProvider />
          <HeaderWrapper />
          <div className="w-full max-w-[1100px] px-4 my-4">
          </div>
          {/* Place your ad where you want it */}
          

          {children}
          <Footer />
        </div>

        <GoogleAnalytics gaId="G-F4PXY0E4LD" />
      </body>
    </html>
  );
}
