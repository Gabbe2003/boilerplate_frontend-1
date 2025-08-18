import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { getLogo } from '@/lib/graph_queries/getLogo';
 import '@/styles/globals.css';
import { AppProvider } from '@/store/AppContext';
import { getAllPosts } from '@/lib/graph_queries/getPost';
import {getTagLine} from '@/lib/graph_queries/getTagline';
import HeaderServer from './components/Main-page/HeaderServer';

const Footer = dynamic(() => import("./components/Main-page/Footer"), {
  loading: () => <div className="w-full h-24 bg-gray-100" />,
});

export async function generateMetadata() {
  return {
    title: process.env.NEXT_PUBLIC_HOSTNAME || "Default Title",
    description:
      "Up-to-date tutorials, deep technical deep dives and thought pieces on web development, React, Next.js, and more.",
    keywords: ["blog", "next.js", "react", "web development", "tutorials"],
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
const [favicon, posts, tagline] = await Promise.all([
    getLogo(), 
    getAllPosts(), 
    getTagLine()
  ])

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AppProvider logo={favicon} posts={posts} tagline={tagline}>
          <HeaderServer  />
            <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
