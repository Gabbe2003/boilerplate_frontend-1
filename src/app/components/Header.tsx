'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { useEffect, useState, useCallback } from 'react';
import DesktopNav from './navigation/DesktopNav';
import MobileNav from './navigation/MobileNav';
import PopupModal from './Rule_sub';
// import SearchDrawer from './navigation/Searchbar'; // ⛔️ remove this
import SearchBarInline from './navigation/SearchBarInline';

type Category = { id: string; name: string; slug: string };

export default function Header() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME || 'Home';
  const { logo, links, searchBarHeader, setSearchBarHeader, posts } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  // load categories (unchanged)
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

  // handlers
  const handleOpenNewsletter = useCallback(() => setIsModalOpen(true), []);
  const handleCloseNewsletter = useCallback(() => setIsModalOpen(false), []);
  const handleSearchChange = useCallback((v: string) => setSearchBarHeader(v), [setSearchBarHeader]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-[#f6e4d3]/50 backdrop-blur-md">
        <div className="w-[90%] lg:w-[70%] mx-auto grid grid-cols-[auto_1fr_auto] items-center py-2 gap-2">
          {/* Left: Logo */}
          <div className="flex items-center min-h-[40px]">
            <Link href="/" aria-label="Go to homepage" className="flex-shrink-0">
              {logo?.sourceUrl ? (
                <Image
                  src={logo.sourceUrl}
                  alt={logo.altText || 'Logo'}
                  width={40}
                  height={40}
                  className="rounded object-cover"
                  priority
                />
              ) : (
                <span className="font-bold text-gray-900 text-base">{host}</span>
              )}
            </Link>
          </div>

          {/* Center: Search (desktop) */}
          <div className="hidden [@media(min-width:1100px)]:flex justify-center">
            <SearchBarInline
              value={searchBarHeader || ''}
              onChange={handleSearchChange}
              posts={posts}
              className="w-full max-w-xl"
            />
          </div>

          {/* Right: Nav */}
          <div className="flex items-center gap-2 min-h-[40px] justify-end">
            {/* Desktop nav */}
            <div className="hidden [@media(min-width:1100px)]:flex">
              <DesktopNav
                links={links}
                onNewsletterClick={handleOpenNewsletter}
                categories={categories}
              />
            </div>

            {/* Mobile nav buttons (burger etc) */}
            <div className="[@media(min-width:1100px)]:hidden flex items-center gap-1">
              <MobileNav
                links={links}
                onNewsletterClick={handleOpenNewsletter}
                categories={categories}
              />
            </div>
          </div>

          {/* Mobile: full-width search row */}
          <div className="col-span-3 [@media(min-width:1100px)]:hidden">
            <SearchBarInline
              value={searchBarHeader || ''}
              onChange={handleSearchChange}
              posts={posts}
              className="w-full"
            />
          </div>
        </div>
      </header>

      <PopupModal isOpen={isModalOpen} onClose={handleCloseNewsletter} />
    </>
  );
}
