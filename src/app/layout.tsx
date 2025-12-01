import Footer from "@/components/Footer/Footer";
import "../styles/globals.css";
import ReadPeakProvider from "@/components/Ads/Ads/Readpeak/ReadProvider";
import HeaderWrapper from "@/components/Header/HeaderWrapper";
// import Script from "next/script";


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
          <Footer />
        </div>
      </body>
    </html>
  );
}
