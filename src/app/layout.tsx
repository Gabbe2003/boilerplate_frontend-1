import Footer from "@/components/Footer/Footer";
import Header from "../components/Header/Header";
import "../styles/globals.css";
import ReadPeakProvider from "@/components/Ads/Ads/Readpeak/ReadProvider";
import ScrollToTop from "./scroll-to-top";


export default function RootLayout({ children }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body>
        <div className="w-full flex flex-col items-center">
          <ReadPeakProvider />
          <ScrollToTop />
          <Header />
            {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
