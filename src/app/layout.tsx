// app/layout.tsx (or wherever this lives)
import type { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { getLogo } from '@/lib/graph_queries/getLogo';
import '@/styles/globals.css';
import { AppProvider } from '@/store/AppContext';
import { getAllPosts } from '@/lib/graph_queries/getPost';
import { getTagLine } from '@/lib/graph_queries/getTagline';
import HeaderServer from './components/Main-page/HeaderServer';

// ✅ reuse your existing SEO helpers
import { getSeo, buildMetadataFromSeo } from '@/lib/seo/seo';
import type { Metadata } from 'next';

const Footer = dynamic(() => import("./components/Main-page/Footer"), {
  loading: () => <div className="w-full h-24 bg-gray-100" />,
});

// Homepage metadata (applies to this route segment; pages can still override)
export async function generateMetadata(): Promise<Metadata> {
  const base = process.env.NEXT_PUBLIC_HOST_URL || 'http://localhost:3000';
  const siteName = process.env.NEXT_PUBLIC_HOSTNAME || 'Home';
  const defaultOg = process.env.NEXT_PUBLIC_DEFAULT_OG_IMAGE;

  // Pull SEO for "/" from WPGraphQL/RankMath
  const payload = await getSeo('/');

  // Build using your centralized mapper
  const meta = buildMetadataFromSeo(payload, {
    metadataBase: base,
    siteName,
    defaultOgImage: defaultOg,
  });

  // Ensure homepage is a WEBSITE, set canonical to root, add RSS
  const canonical = meta.alternates?.canonical ?? new URL('/', base).toString();

  // If RankMath has no focusKeywords for home, gently fall back to title
  const keywords =
    meta.keywords && meta.keywords.length
      ? meta.keywords
      : [String(meta.title ?? '')].filter(Boolean);

  return {
    ...meta,
    metadataBase: new URL(base),
    keywords,
    openGraph: {
      ...(meta.openGraph || {}),
      type: 'website',
      url: canonical,
    },
    alternates: {
      ...(meta.alternates || {}),
      canonical,
      // optional RSS surface (adjust path if your feed differs)
      types: {
        'application/rss+xml': new URL('/feed/', base).toString(),
      },
    },
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const [favicon, posts, tagline] = await Promise.all([
    getLogo(),
    getAllPosts(),
    getTagLine(),
  ]);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AppProvider logo={favicon} posts={posts} tagline={tagline}>
          <HeaderServer />
          <main className="flex-1">{children}</main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
