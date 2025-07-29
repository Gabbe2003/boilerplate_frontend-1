import type { ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { getLogo } from '@/lib/graph_queries/getLogo'
import { getAllPosts } from '@/lib/graph_queries/getFullposts'
import '@/styles/globals.css'
import { DEFAULT_LINKS } from '@/store/AppContext'
import RootClientProviders from './client-wrapper'

const Footer = dynamic(() => import('./components/Footer'), {
  loading: () => <div className="w-full h-24 bg-gray-100" />
})

export async function generateMetadata() {
  return {
    title: process.env.HOSTNAME || 'Default Title',
    description: "Up-to-date tutorials, deep technical deep dives and thought pieces on web development, React, Next.js, and more.",
    keywords: ["blog", "next.js", "react", "web development", "tutorials"],
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const { favicon } = await getLogo();
  const posts = await getAllPosts();

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <RootClientProviders links={DEFAULT_LINKS} logo={favicon} posts={posts}>
          <main className="flex-1">{children}</main>
        </RootClientProviders>
        <Footer />
      </body>
    </html>
  );
}
