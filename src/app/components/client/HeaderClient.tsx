'use client';

import { useState, useCallback } from 'react';
import SearchBarInline from '../Header-navigation/SearchBarInline';
import type { SearchResult } from '../Header-navigation/hooks/useSearchBar';
import { Post } from '@/lib/types';
import DesktopNav from '../Header-navigation/DesktopNav';
import MobileNav from '../Header-navigation/MobileNav';

type Category = { id: string; name: string; slug: string };

type Props = {
  posts: Post[];
  links: { title: string; href: string }[];
  initialCategories: Category[];
};

export default function HeaderClient({ posts, links, initialCategories }: Props) {
  const [searchValue, setSearchValue] = useState('');

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
      <div className="hidden [@media(min-width:1100px)]:flex justify-center">
        <SearchBarInline
          value={searchValue}
          onChange={setSearchValue}
          posts={posts}
          searchFn={searchFn}
          className="w-full max-w-xl"
        />
      </div>

      <div className="flex items-center gap-2 min-h-[40px] justify-end">
        <div className="hidden [@media(min-width:1100px)]:flex">
          <DesktopNav links={links} categories={initialCategories} />
        </div>
        <div className="[@media(min-width:1100px)]:hidden flex items-center gap-1">
          <MobileNav links={links} categories={initialCategories} />
        </div>
      </div>

      <div className="col-span-3 [@media(min-width:1100px)]:hidden">
        <SearchBarInline
          value={searchValue}
          onChange={setSearchValue}
          posts={posts}
          searchFn={searchFn}
          className="w-full"
        />
      </div>
    </>
  );
}
