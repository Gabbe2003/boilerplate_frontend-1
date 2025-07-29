'use client';

import { useEffect, useState } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerOverlay,
  DrawerClose,
  DrawerTitle
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Search from './icons/search';
import { useAppContext } from '@/store/AppContext';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchDrawer() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const { posts } = useAppContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search input by 1 second
  useEffect(() => {
    if (!mounted) return;
    if (searchValue === '') {
      setDebouncedSearchValue('');
      setLoading(false);
      return;
    }
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchValue, mounted]);

  if (!mounted) return null;

  // Filter using the debounced value
  const filteredPosts = debouncedSearchValue
    ? posts.filter(post =>
        post.title.toLowerCase().includes(debouncedSearchValue.toLowerCase()) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(debouncedSearchValue.toLowerCase()))
      )
    : [];

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="text-gray-500 hover:text-black">
          <Search className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerOverlay className="fixed inset-0 bg-black/30 z-40" />
      <DrawerContent className="fixed top-0 right-0 h-full w-[60vw] bg-white z-50 shadow-lg flex flex-col">
        <DrawerTitle className="sr-only">Search</DrawerTitle>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Search</h2>
          <DrawerClose asChild>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DrawerClose>
        </div>
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              autoFocus
              placeholder="Search..."
              aria-label="Search"
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
              className="pl-10 bg-transparent w-full"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32">
              <svg className="animate-spin h-6 w-6 text-gray-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
              </svg>
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          ) : !debouncedSearchValue ? (
            <p className="text-sm text-gray-500">Start typing to see results.</p>
          ) : filteredPosts.length === 0 ? (
            <p className="text-sm text-gray-500">No results found.</p>
          ) : (
            <ul className="space-y-4">
              {filteredPosts.map(post => (
                <li key={post.slug}>
                  <Link
                    href={`/${post.slug}`}
                    className="flex flex-col items-center bg-gray-50 rounded-lg hover:bg-gray-100 transition p-6 w-full my-6 shadow"
                    tabIndex={0}
                  >
                    {post.featuredImage?.node?.sourceUrl ? (
                      <div className="relative w-full aspect-square mb-4">
                        <Image
                          src={post.featuredImage.node.sourceUrl}
                          alt={post.featuredImage.node.altText || post.title}
                          fill
                          className="rounded-md object-cover border"
                          sizes="100vw"
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    ) : (
                      <span className="w-full aspect-square flex items-center justify-center bg-gray-200 rounded-md text-xs text-gray-400 border mb-4">
                        No image
                      </span>
                    )}
                    <div className="w-full flex flex-col items-center">
                      <span className="font-medium text-gray-900 hover:underline text-center">
                        {post.title}
                      </span>
                      {post.excerpt && (
                        <span className="text-xs text-gray-500 mt-1 text-center line-clamp-3">
                          {post.excerpt.replace(/<[^>]+>/g, '')}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
