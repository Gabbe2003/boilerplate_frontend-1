'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import DesktopNav from './navigation/DesktopNav';
import MobileNav from './navigation/MobileNav';
import PopupModal from './Rule_sub';
import SearchDrawer from './navigation/Searchbar';

type Category = { id: string; name: string; slug: string };
type SearchResult = { id: string | number; title: string; href: string; meta?: string };

export default function Header() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME || 'Home';
  const {
    logo,
    links,
    searchBarHeader,
    setSearchBarHeader,
    posts,
  } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [hi, setHi] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [debounced, setDebounced] = useState('');

  // Fetch categories
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

  // Debounce searchBarHeader
  useEffect(() => {
    const t = setTimeout(() => setDebounced((searchBarHeader || '').trim()), 220);
    return () => clearTimeout(t);
  }, [searchBarHeader]);

  const stripHtml = useCallback((s: string) => s.replace(/<[^>]+>/g, ''), []);
  const norm = useCallback((s: string) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, ''), []);

  const results: SearchResult[] = useMemo(() => {
    const q = norm(debounced);
    if (!q || !Array.isArray(posts) || posts.length === 0) return [];
    return posts
      .filter((p: any) => {
        const title = norm(p?.title || '');
        const excerpt = norm(stripHtml(p?.excerpt || ''));
        return title.includes(q) || excerpt.includes(q);
      })
      .slice(0, 20)
      .map((p: any) => ({
        id: p?.databaseId ?? p?.id ?? p?.slug ?? Math.random(),
        title: p?.title || 'Untitled',
        href: `/${p?.slug ?? ''}`,
        meta: p?.date ? new Date(p.date).toLocaleDateString() : undefined,
      }));
  }, [debounced, posts, norm, stripHtml]);

  // Handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchBarHeader(e.target.value);
    setOpen(true);
  }, [setSearchBarHeader]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const q = (searchBarHeader || '').trim();
    setOpen(false);
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [router, searchBarHeader]);

  const handleDocClick = useCallback((e: MouseEvent) => {
    if (!containerRef.current) return;
    if (!containerRef.current.contains(e.target as Node)) setOpen(false);
  }, []);

  const go = useCallback((href: string) => {
    setOpen(false);
    router.push(href);
  }, [router]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHi((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHi((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter' && hi >= 0) {
      e.preventDefault();
      go(results[hi].href);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }, [open, results, hi, go]);

  const handleResultMouseEnter = useCallback((idx: number) => {
    setHi(idx);
  }, []);

  const handleResultMouseLeave = useCallback(() => {
    setHi(-1);
  }, []);

  const handleResultMouseDown = useCallback((href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    go(href);
  }, [go]);

  const handleOpenFullResults = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const q = (searchBarHeader || '').trim();
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }, [router, searchBarHeader]);

  // Close dropdown on outside click
  useEffect(() => {
    document.addEventListener('mousedown', handleDocClick);
    return () => document.removeEventListener('mousedown', handleDocClick);
  }, [handleDocClick]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-[#f6e4d3]/50 backdrop-blur-md">
        <div className="w-[90%] lg:w-[70%] mx-auto relative flex items-center py-2">
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

          {/* Center: Search */}
          <div
            ref={containerRef}
            className="hidden [@media(min-width:1100px)]:block absolute left-1/2 -translate-x-1/2 w-full max-w-xl relative"
          >
            <form onSubmit={handleSubmit} className="w-full">
              <input
                ref={inputRef}
                type="search"
                value={searchBarHeader || ''}
                onChange={handleSearchChange}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder="Search…"
                aria-label="Search"
                aria-expanded={open}
                aria-controls="search-popover"
                className="w-full rounded-full border border-neutral-300 bg-white/80 px-4 py-2 outline-none backdrop-blur-md focus:border-neutral-400 focus:ring-2 focus:ring-neutral-200"
              />
            </form>

            {/* Dropdown */}
            {open && (
              <div
                id="search-popover"
                role="listbox"
                className="absolute left-0 right-0 top-full mt-2 z-[60] rounded-xl border bg-white shadow-lg overflow-hidden"
              >
                {debounced.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-neutral-600">Start typing to search…</div>
                ) : !posts || posts.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-neutral-600">Indexing posts…</div>
                ) : results.length === 0 ? (
                  <div className="px-3 py-3 text-sm text-neutral-600">No results found.</div>
                ) : (
                  <ul className="max-h-80 overflow-auto">
                    {results.map((r, idx) => (
                      <li key={r.id}>
                        <button
                          role="option"
                          aria-selected={hi === idx}
                          onMouseEnter={() => handleResultMouseEnter(idx)}
                          onMouseLeave={handleResultMouseLeave}
                          onMouseDown={handleResultMouseDown(r.href)}
                          className={`w-full text-left px-3 py-2 text-sm ${hi === idx ? 'bg-neutral-100' : ''}`}
                        >
                          <div className="font-medium line-clamp-1">{r.title}</div>
                          {r.meta && (
                            <div className="text-xs text-neutral-600 line-clamp-1">{r.meta}</div>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="border-t px-3 py-2 flex items-center justify-between text-xs text-neutral-600">
                  <button className="underline" onMouseDown={handleOpenFullResults}>
                    Open full results
                  </button>
                  <span>Esc to close • ↑/↓ to navigate</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: nav */}
          <div className="ml-auto flex items-center gap-2 min-h-[40px]">
            <div className="hidden [@media(min-width:1100px)]:flex">
              <DesktopNav
                links={links}
                onNewsletterClick={() => setIsModalOpen(true)}
                categories={categories}
              />
            </div>
            <div className="[@media(min-width:1100px)]:hidden flex items-center gap-1">
              <SearchDrawer
                value={searchBarHeader}
                onChange={(e: any) => setSearchBarHeader(e.target.value)}
              />
              <MobileNav
                links={links}
                onNewsletterClick={() => setIsModalOpen(true)}
                categories={categories}
              />
            </div>
          </div>
        </div>
      </header>

      <PopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
