'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAppContext } from '@/store/AppContext';
import { stripHtml } from '@/lib/helper_functions/strip_html';
import { Sidebar } from './SideBar';
import { Button } from '@/components/ui/button';

export default function PostsList() {
  const { searchBarHeader, posts } = useAppContext();
  const term = searchBarHeader.trim().toLowerCase();
  const filtered = term
    ? posts.filter((p) => p.title.toLowerCase().includes(term))
    : posts;

  const [visibleCount, setVisibleCount] = useState(8);

  const items = filtered.slice(0, visibleCount);

  const limitWords = (text: string, maxWords: number) => {
    const words = text.split(/\s+/);
    return words.length > maxWords
      ? words.slice(0, maxWords).join(' ') + '…'
      : text;
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto w/full lg:w-[70%] px-2 sm:px-4 md:px-6">
        <p className="text-center text-gray-500 text-sm">No posts found</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full lg:w-[70%] px-2 sm:px-4 md:px-6">
      {/* 1 col on mobile; 70/30 split on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6 py-4">
        {/* Main feed (≈70%) */}
        <main>
          <h2 className="text-xl px-2 font-bold mb-4">Latest News</h2>

          {/* 1 col on mobile, 2 cols on sm+ */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((post, index) => {
              const rawExcerpt = stripHtml(post.excerpt!) || '';
              const limitedExcerpt = limitWords(rawExcerpt, 15);

              return (
                <li
                  key={post.id}
                  className="group flex flex-col p-3 hover:cursor-pointer"
                >
                  {post.featuredImage?.node?.sourceUrl && (
                    <Link href={`/${post.slug}`} className="block">
                      <div className="relative w-full aspect-[2/1] overflow-hidden mb-1">
                        <Image
                          src={post.featuredImage.node.sourceUrl}
                          alt={post.featuredImage.node.altText || post.title}
                          fill
                          className="object-cover transform-gpu transition-transform duration-300 ease-out md:group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                          priority={index < 2}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                    </Link>
                  )}

                  <h3 className="text-base lg:text-lg font-semibold mb-1 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-gray-700 mb-2 text-xs leading-relaxed underline">
                    {limitedExcerpt}
                  </p>
                </li>
              );
            })}
          </ul>

          {/* Load more button */}
          {visibleCount < filtered.length && (
            <div className="flex justify-center mt-6">
              <Button
                variant='outline'
                onClick={() => setVisibleCount((prev) => prev + 8)}
                className="px-4 py-2 bg-blue-600 text-black text-sm font-medium rounded hover:bg-blue-700 transition hover: cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Load more
              </Button>
            </div>
          )}
        </main>
          
        {/* Aside (≈30%) */}
        <aside className="lg:pt-12 mt-12 self-start text-sm rounded-sm">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
