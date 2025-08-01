'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerOverlay,
  DrawerClose,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/store/AppContext';
import Link from 'next/link';
import Image from 'next/image';
import Search from '../icons/search';

interface SearchDrawerProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PAGE_SIZE = 20;

export default function SearchDrawer({ value, onChange }: SearchDrawerProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [debouncedSearchValue, setDebouncedSearchValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { posts } = useAppContext();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce controlled input
  useEffect(() => {
    if (!mounted) return;
    if (value === '') {
      setDebouncedSearchValue('');
      setLoading(false);
      setVisibleCount(PAGE_SIZE); // Reset count on clear
      return;
    }
    setLoading(true);
    const handler = setTimeout(() => {
      setDebouncedSearchValue(value);
      setLoading(false);
      setVisibleCount(PAGE_SIZE); // Reset count on new search
    }, 1000);

    return () => clearTimeout(handler);
  }, [value, mounted]);

  // 🔴 FIX: Move hooks outside conditional
  const filteredPosts = useMemo(() => {
    if (!debouncedSearchValue) return [];
    return posts.filter(
      (post) =>
        post.title.toLowerCase().includes(debouncedSearchValue.toLowerCase()) ||
        post.excerpt
          ?.toLowerCase()
          .includes(debouncedSearchValue.toLowerCase()),
    );
  }, [debouncedSearchValue, posts]);

  const visiblePosts = useMemo(
    () => filteredPosts.slice(0, visibleCount),
    [filteredPosts, visibleCount],
  );

  if (!mounted) return null;

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="text-gray-500 hover:text-black">
          <Search className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerOverlay className="fixed inset-0 bg-black/30 z-40" />
      <DrawerContent
        className="
          fixed top-0 right-0 h-full w-full
          bg-white z-[999] shadow-lg flex flex-col
          data-[vaul-drawer-direction=right]:inset-y-0
          data-[vaul-drawer-direction=right]:right-0
          data-[vaul-drawer-direction=right]:border-l
        "
      >
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
              value={value}
              onChange={onChange}
              className="pl-10 bg-transparent w-full"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-32">
              <svg
                className="animate-spin h-6 w-6 text-gray-500 mb-2"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  opacity="0.25"
                />
                <path
                  d="M4 12a8 8 0 018-8v8H4z"
                  fill="currentColor"
                  opacity="0.75"
                />
              </svg>
              <span className="text-sm text-gray-500">Loading...</span>
            </div>
          ) : !debouncedSearchValue ? (
            <p className="text-sm text-gray-500">
              Start typing to see results.
            </p>
          ) : filteredPosts.length === 0 ? (
            <p className="text-sm text-gray-500">No results found.</p>
          ) : (
            <>
              <ul className="space-y-4">
                {visiblePosts.map((post) => (
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
              {visibleCount < filteredPosts.length && (
                <div className="flex justify-center mt-6">
                  <Button onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}>
                    Load More
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
