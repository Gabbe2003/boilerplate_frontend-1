// src/app/layout.tsx
import type { ReactNode } from 'react'
import { AppProvider, DEFAULT_LINKS } from '@/store/AppContext'
import { getLogo } from '@/lib/graph_queries/getLogo'
import Header from './components/Header'
import Footer from './components/Footer'
import '@/styles/globals.css'
import { getAllPosts } from '@/lib/graph_queries/getFullposts'




export const metadata = {
  title: "My Awesome Blog – Deep Dives & Tutorials",
  description: "Up-to-date tutorials, deep technical deep dives and thought pieces on web development, React, Next.js, and more.",
  keywords: ["blog", "next.js", "react", "web development", "tutorials"],
};



interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const {favicon} = await getLogo();
  const posts = await getAllPosts();

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AppProvider links={DEFAULT_LINKS} logo={favicon} posts={posts}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
