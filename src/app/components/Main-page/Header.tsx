'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { useEffect, useState, useCallback } from 'react';
import DesktopNav from '../Header-navigation/DesktopNav';
import MobileNav from '../Header-navigation/MobileNav';
import PopupModal from '../Rule_sub';
import type { SearchResult } from '../Header-navigation/hooks/useSearchBar';
import SearchBarInline from '../Header-navigation/SearchBarInline';

type Category = { id: string; name: string; slug: string };

type HeaderProps = {
  initialCategories?: Category[];
};

export default function Header({ initialCategories = [] }: HeaderProps) {
  const { links, posts } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        const res = await fetch('/api/categories', { cache: 'no-store', signal: ac.signal });
        if (!res.ok) throw new Error('Failed to fetch categories');
        const list: Category[] = await res.json();
        setCategories(list);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        if (err?.name !== 'AbortError') console.error('Error loading categories:', err);
      }
    })();
    return () => ac.abort();
  }, []);

  const handleOpenNewsletter = useCallback(() => setIsModalOpen(true), []);
  const handleCloseNewsletter = useCallback(() => setIsModalOpen(false), []);

  const searchFn = useCallback(
    async (q: string, opts?: { signal?: AbortSignal }): Promise<SearchResult[]> => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        cache: 'no-store',
        signal: opts?.signal,
      });
      if (!res.ok) return [];
      return (await res.json()) as SearchResult[];
    },
    []
  );

  return (
    <>
      {/* CHANGED: added py-0 */}
      <header className="sticky top-0 bottom-0 z-50 w-full border-b bg-[#f6e4d3]/50 backdrop-blur-md px-2 sm:px-4 md:px-6 py-0">
        {/* CHANGED: py-2 -> py-0; kept md:w-full */}
        <div className="w-full lg:w-[70%] md:w-full mx-auto grid grid-cols-[auto_1fr_auto] items-center py-0 gap-2 px-2 sm:px-4 md:px-6">

          {/* Left: Static Logo */}
          <div className="flex items-center min-h-[40px]">
            <Link href="/" aria-label="Go to homepage" className="flex-shrink-0">
              <Image
                src="/full_logo_with_slogan.png"
                alt="Logo"
                width={100}
                height={60}
                className="object-cover"
                priority
              />
            </Link>
          </div>

          {/* Center: Search (desktop) */}
          <div className="hidden [@media(min-width:1100px)]:flex justify-center">
            <SearchBarInline
              value={searchValue}
              onChange={setSearchValue}
              posts={posts}
              searchFn={searchFn}
              className="w-full max-w-xl"
            />
          </div>

          {/* Right: Nav */}
          <div className="flex items-center gap-2 min-h-[40px] justify-end">
            <div className="hidden [@media(min-width:1100px)]:flex">
              <DesktopNav links={links} onNewsletterClick={handleOpenNewsletter} categories={categories} />
            </div>
            <div className="[@media(min-width:1100px)]:hidden flex items-center gap-1">
              <MobileNav links={links} onNewsletterClick={handleOpenNewsletter} categories={categories} />
            </div>
          </div>

          {/* Mobile: full-width search row */}
          <div className="col-span-3 [@media(min-width:1100px)]:hidden">
            <SearchBarInline
              value={searchValue}
              onChange={setSearchValue}
              posts={posts}
              searchFn={searchFn}
              className="w-full"
            />
          </div>
        </div>
      </header>

      <PopupModal isOpen={isModalOpen} onClose={handleCloseNewsletter} />
    </>
  );
}
