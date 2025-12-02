import Footer from "@/components/Footer/Footer";
import "../styles/globals.css";
import ReadPeakProvider from "@/components/Ads/Ads/Readpeak/ReadProvider";
import HeaderWrapper from "@/components/Header/HeaderWrapper";
import { GoogleAnalytics } from '@next/third-parties/google'
import Script from "next/script";


<Script
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4868110039996635"
      strategy="afterInteractive"
      crossOrigin="anonymous"
    />

export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <head>
       
      </head>
      <body>
        <div className="w-full flex flex-col items-center">
          <ReadPeakProvider />
          <HeaderWrapper />
            {children}
            <GoogleAnalytics gaId="G-F4PXY0E4LD" />

          <Footer />
        </div>
      </body>
    </html>
  );
}
