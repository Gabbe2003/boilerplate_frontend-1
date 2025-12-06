import type { ReactNode } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";

import Footer from "@/components/Footer/Footer";
import HeaderWrapper from "@/components/Header/HeaderWrapper";
import "../styles/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  const adsenseClient = process.env.ADSENSE_CLIENT;

  return (
    <html lang="sv">
      <body>
         <>
      {adsenseClient ? (
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
          crossOrigin="anonymous"
        />
      ) : null}
    </>

        <div className="w-full flex flex-col items-center">
          <HeaderWrapper />
          <div className="w-full max-w-[1100px] px-4 my-4">
            {/* <AdSenseBanner /> */}
          </div>

          {children}
          <Footer />
        </div>

        <GoogleAnalytics gaId="G-F4PXY0E4LD" />
      </body>
    </html>
  );
}
