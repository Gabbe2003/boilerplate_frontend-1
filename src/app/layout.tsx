import Footer from "@/components/Footer/Footer";
import "../styles/globals.css";
import ReadPeakProvider from "@/components/Ads/Ads/Readpeak/ReadProvider";
import HeaderWrapper from "@/components/Header/HeaderWrapper";
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from "next/script";
import PopupAd from "@/components/Ads/Popup/PopupAd";
import { getNextSectionAd } from "@/lib/ads/getAds";



export default async function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  const popupAd = await getNextSectionAd("popup");

  return (
    <html lang="sv">
      <head>
        <Script
  src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
  strategy="afterInteractive"
  crossOrigin="anonymous"
/>
      </head>
      <body>
        <div className="w-full flex flex-col items-center">
          <ReadPeakProvider />
          <HeaderWrapper />
            {children}
            <GoogleAnalytics gaId="G-F4PXY0E4LD" />

          <PopupAd ad={popupAd} />
          <Footer />
        </div>
      </body>
    </html>
  );
}
