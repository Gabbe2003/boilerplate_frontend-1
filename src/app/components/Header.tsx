'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { useState, useEffect } from 'react';
import DesktopNav from './navigation/DesktopNav';
import MobileNav from './navigation/MobileNav';
import PopupModal from './Rule_sub';
import SearchDrawer from './navigation/Searchbar';

// Match the server util's return type
type Category = { id: string; name: string; slug: string };

export default function Header() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const { logo, links, searchBarHeader, setSearchBarHeader } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const list: Category[] = await res.json();
        if (active) setCategories(list);
      } catch (err) {
        console.error('Error loading categories:', err);
        if (active) setCategories([]);
      }
    })();
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
        {/* Top row: logo + categories + search */}
        <div className="w-[90%] lg:w-[70%] mx-auto flex items-center justify-between py-1">
          {/* Logo (Left) */}
          <div className="flex flex-col items-start flex-shrink-0">
            <Link href="/" className="flex-shrink-0">
              {logo?.sourceUrl ? (
                <Image
                  src={logo.sourceUrl}
                  alt={logo.altText || 'Logo'}
                  width={48}
                  height={48}
                  className="rounded object-cover bg-white"
                  priority
                />
              ) : (
                <span className="font-bold text-gray-900 text-base">{host}</span>
              )}
            </Link>
          </div>

          {/* Categories in the Center (Desktop only) */}
          <div className="hidden [@media(min-width:1050px)]:flex flex-1 justify-center min-h-[40px]">
            {categories.length > 0 ? (
              <DesktopNav
                links={links}
                onNewsletterClick={() => setIsModalOpen(true)}
                categories={categories}
              />
            ) : (
              <span className="text-sm text-gray-500">Loading…</span>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* MOBILE */}
            <div className="[@media(min-width:1050px)]:hidden flex items-center gap-1">
              <SearchDrawer value={searchBarHeader} onChange={handleSearchChange} />
              <MobileNav
                links={links}
                onNewsletterClick={() => setIsModalOpen(true)}
                categories={categories}
              />
            </div>

            {/* DESKTOP Search */}
            <div className="hidden [@media(min-width:1050px)]:flex items-center ml-2">
              <SearchDrawer value={searchBarHeader} onChange={handleSearchChange} />
            </div>
          </div>
        </div>
      </header>

      {/* Newsletter Modal */}
      <PopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
