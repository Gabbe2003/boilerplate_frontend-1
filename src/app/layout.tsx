// src/app/layout.tsx
import type { ReactNode } from 'react';
import { AppProvider } from '@/store/AppContext';
import { getLogo } from '@/lib/graph_queries/getLogo';
import Header from './components/Header';
import Footer from './components/Footer';
import '@/styles/globals.css';

const DEFAULT_LINKS = [
  { title: 'About', href: '/about' },
  { title: 'Links', href: '/links' },
  { title: 'Contact', href: '/contact' },
  { title: 'Privacy', href: '/privacy' },
  { title: 'Terms', href: '/terms' },
  { title: 'Archive', href: '/archive' },
];

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const { favicon } = await getLogo();
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AppProvider links={DEFAULT_LINKS} logo={favicon}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
