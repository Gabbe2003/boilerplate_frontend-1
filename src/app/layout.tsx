// src/app/layout.tsx
import type { ReactNode } from 'react';
import { AppProvider } from '@/store/AppContext';
import { getLogo } from '@/lib/graph_queries/getLogo';
import Header from './components/Header';
import Footer from './components/Footer';
import '@/styles/globals.css';

const DEFAULT_LINKS = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Privacy', href: '/privacy' },
  { title: 'Contact', href: '/contact' },
  { title: 'Links', href: '/links' },
  { title: 'FAQ', href: '/faq' },
  { title: 'Terms', href: '/terms' },
  { title: 'Author', href: '/author' },
  { title: 'Search', href: '/search' },
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
