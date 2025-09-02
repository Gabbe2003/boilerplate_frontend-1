import type { ReactNode } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Script from "next/script";

import "@/styles/globals.css";

import { AppProvider } from "@/store/AppContext";
import { getLogo } from "@/lib/graph_queries/getLogo";
import HeaderServer from "./components/Main-page/HeaderServer";
import Analytics from "./components/Analytics";

const Footer = dynamic(() => import("./components/Main-page/Footer"), {
  loading: () => <div className="w-full h-24 bg-gray-100" />,
});

export async function generateMetadata(): Promise<Metadata> {
  const logo = await getLogo().catch(() => null);

  return {
    title: process.env.NEXT_PUBLIC_HOSTNAME ?? "Default Title",
    description: "Dina dagliga nyheter inom finans, aktier och börsen",
    keywords: ["ekonominyheter", "börsen", "aktier", "ekonomi", "finans"],
    icons: {
      icon: (typeof logo === "string" && logo) || "/full_logo_with_slogan.png",
    },
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const logo = await getLogo().catch(() => null);
  const gaId = process.env.NEXT_PUBLIC_GA_ID;


  return (
    <html lang="en">

      <head>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { send_page_view: false });
              `}
            </Script>
          </>
        )}
      </head>
      
      <body className="flex min-h-screen flex-col">
        <AppProvider logo={logo} >
          <HeaderServer />
          <Analytics />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
