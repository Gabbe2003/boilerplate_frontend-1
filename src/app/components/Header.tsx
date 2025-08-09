'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { useState, useEffect } from 'react';
import DesktopNav from './navigation/DesktopNav';
import MobileNav from './navigation/MobileNav';
import PopupModal from './Rule_sub';
import SearchDrawer from './navigation/Searchbar';
import { getAllCategories } from '@/lib/graph_queries/getAllCategories';

// Category type for local state
type Category = { id: string | number; name: string; slug: string };

// Normalize various API shapes into a simple array of { id, name, slug }
function normalizeCategories(raw: any): Category[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as Category[];

  // Common WPGraphQL shape: { data: { categories: { nodes: [...] } } }
  if (raw?.data?.categories?.nodes) {
    return raw.data.categories.nodes.map((n: any) => ({
      id: n.databaseId ?? n.id ?? n.slug,
      name: n.name,
      slug: n.slug,
    }));
  }

  // Alternate shape: { categories: [...] }
  if (raw?.categories) {
    return raw.categories.map((n: any) => ({
      id: n.id ?? n.slug,
      name: n.name,
      slug: n.slug,
    }));
  }

  return [];
}

export default function Header() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const { logo, links, searchBarHeader, setSearchBarHeader } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let active = true;

    async function fetchCategories() {
      try {
        const res = await getAllCategories();
        // Support both fetch Response and plain object return
        const json = typeof (res as any)?.json === 'function' ? await (res as any).json() : res;
        const normalized = normalizeCategories(json);
        if (active) setCategories(normalized || []);
      } catch {
        if (active) setCategories([]);
      }
    }

    fetchCategories();
    return () => {
      active = false;
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBarHeader(e.target.value);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-[#f6e4d3]/50 backdrop-blur-md">
        {/* Top row: logo + navs + search */}
        <div className="w-[90%] lg:w-[70%] mx-auto flex items-center justify-between py-1">
          {/* Logo */}
          <div className="flex flex-col items-start">
            <Link href="/" className="flex-shrink-0">
              {logo?.sourceUrl ? (
                <Image
                  src={logo.sourceUrl}
                  alt={logo.altText || 'Logo'}
                  width={48}
                  height={48}
                  className="rounded object-cover bg-white"
                />
              ) : (
                <span className="font-bold text-gray-900 text-base">
                  {host}
                </span>
              )}
            </Link>
          </div>
          {/* /Logo */}

          {/* Navigation and Controls */}
          <div className="flex items-center gap-2">
            {/* MOBILE */}
            <div className="[@media(min-width:1050px)]:hidden flex items-center gap-1">
              <SearchDrawer
                value={searchBarHeader}
                onChange={handleSearchChange}
              />
              <MobileNav
                links={links}
                onNewsletterClick={() => setIsModalOpen(true)}
                categories={categories}
              />
            </div>

            {/* DESKTOP */}
            <div className="hidden [@media(min-width:1050px)]:flex items-center gap-2">
              <DesktopNav
                links={links}
                onNewsletterClick={() => setIsModalOpen(true)}
                categories={categories}
              />
              <div className="ml-2">
                <SearchDrawer
                  value={searchBarHeader}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
          {/* /Navigation and Controls */}
        </div>

       
      </header>

      {/* Newsletter Modal */}
      <PopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
