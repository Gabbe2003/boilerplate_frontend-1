import Footer from "@/components/Footer/Footer";
import "../styles/globals.css";
import ReadPeakProvider from "@/components/Ads/Ads/Readpeak/ReadProvider";
import HeaderWrapper from "@/components/Header/HeaderWrapper";


export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
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
