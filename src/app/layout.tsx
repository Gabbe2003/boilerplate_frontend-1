import type { Metadata } from "next";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
<<<<<<< HEAD
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from 'next/script'; 
=======
 import { GoogleAnalytics } from "@next/third-parties/google";
>>>>>>> e5905b196b20d97a21bd36c6f9f83ecc04f86838

import "@/styles/globals.css";

import { AppProvider } from "@/store/AppContext";
import { getLogo } from "@/lib/graph_queries/getLogo";
import HeaderServer from "./components/Main-page/HeaderServer";

const Footer = dynamic(() => import("./components/Main-page/Footer"), {
  loading: () => <div className="w-full h-24 bg-gray-100" />,
});

export async function generateMetadata(): Promise<Metadata> {

  return {
    title: process.env.NEXT_PUBLIC_HOSTNAME ?? "Default Title",
    description: "Dina dagliga nyheter inom finans, aktier och börsen",
    keywords: ["ekonominyheter", "börsen", "aktier", "ekonomi", "finans"],
      icons: [{ rel: "icon", url: "/full_logo_with_slogan.png" }],
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const logo = await getLogo().catch(() => null);

  return (
<<<<<<< HEAD
    <html lang="sv">
      <head>
        <Script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4868110039996635" crossOrigin="anonymous"></Script>
        <Script
          src="https://static.readpeak.com/js/rp-int.js"
          strategy="beforeInteractive"
        />
        <Script id="rpplc-onpageload" strategy="afterInteractive">
          {`
            (function triggerRpplcReady() {
              try {
                function fireReady() {
                  window._rpplc = window._rpplc || [];
                  if (!window.__rpplcReady) {
                    window.__rpplcReady = true;
                    window.dispatchEvent(new Event('rpplc:ready'));
                  }
                }

                if (document.readyState === 'complete' || document.readyState === 'interactive') {
                  fireReady(); // if already loaded, fire immediately
                } else {
                  window.addEventListener('load', fireReady, { once: true });
                }
              } catch (err) {
                console.error('[ReadPeak] error triggering rpplc:ready', err);
              }
            })(); `}
            
        </Script>
=======
    <html lang="en">
      <head>
             <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4868110039996635"
     crossOrigin="anonymous"></script>
>>>>>>> e5905b196b20d97a21bd36c6f9f83ecc04f86838
      </head>
      <body className="flex min-h-screen flex-col">

        <AppProvider logo={logo}>
          <HeaderServer />
          <GoogleAnalytics gaId="G-F4PXY0E4LD" />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
