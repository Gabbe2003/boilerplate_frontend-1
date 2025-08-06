'use client';

import React from 'react';
import Link from 'next/link';
import { Ad, ADS } from './ads/adsContent';
import { useAppContext } from '@/store/AppContext';
import { Post } from '@/lib/types';
import { PostCard } from './postCard';
import { AdCard } from './ads/adcard';

// --- Feed item discriminated union types ---
type AdItem = {
  type: 'ad';
  adIndex: number;
  id: string | number;
};
type PostItem = Post & { type: 'post' };
type FeedItem = AdItem | PostItem;

function AdGridCard({ ad, className = '' }: { ad: Ad; className?: string }) {
  return (
    <div
      className={`bg-white border border-gray-200 flex items-center justify-center h-[220px] p-2 ${className}`}
    >
      <AdCard ad={ad} />
    </div>
  );
}

export default function PopularNews({ items = [] }: { items: FeedItem[] }) {
  const { tagline } = useAppContext();

  if (!items.length) {
    return <div className="py-8 text-center">No popular posts found.</div>;
  }

  // Split into "top", "bottom", "last" for lg layout
  const topItems = items.slice(0, 4);
  const bottomItems = items.slice(4, 8);
  const lastItem = items[8];


  return (
    <section className="w-[90%] lg:w-[70%] mx-auto py-8">
      {tagline && (
        <h1 className="mt-1 text-sm text-gray-500 block mb-4">{tagline}</h1>
      )}
      <div className="flex flex-col gap-8">
        {/* Mobile: 2 columns x4, last full width */}
        <div className="grid grid-cols-2 gap-4 lg:hidden">
          {items.slice(0, 8).map((item, idx) =>
            item.type === 'ad' ? (
              <AdGridCard key={`ad-m-${idx}`} ad={ADS[item.adIndex]} />
            ) : (
              <Link href={`/${item.slug}`} key={item.id}>
                <PostCard post={item} />
              </Link>
            )
          )}
          {items[8] && (
            <div className="col-span-2 mt-2">
              {items[8].type === 'ad' ? (
                <AdGridCard ad={ADS[items[8].adIndex]} />
              ) : (
                <Link href={`/${items[8].slug}`}>
                  <PostCard post={items[8]} />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Desktop: first row, 4 columns */}
        <div className="hidden lg:grid grid-cols-4 gap-2">
          {topItems.map((item, idx) =>
            item.type === 'ad' ? (
              <AdGridCard key={`ad-top-${idx}`} ad={ADS[item.adIndex]} />
            ) : (
              <Link href={`/${item.slug}`} key={item.id}>
                <PostCard post={item} />
              </Link>
            )
          )}
        </div>

        {/* Desktop: second row, 5 columns, last item fills last cell if present */}
        <div className="hidden lg:grid grid-cols-5 gap-2">
          {bottomItems.map((item, idx) =>
            item.type === 'ad' ? (
              <AdGridCard key={`ad-bot-${idx}`} ad={ADS[item.adIndex]} />
            ) : (
              <Link href={`/${item.slug}`} key={item.id}>
                <PostCard post={item} />
              </Link>
            )
          )}
          {lastItem &&
            (lastItem.type === 'ad' ? (
              <AdGridCard key={`ad-last`} ad={ADS[lastItem.adIndex]} />
            ) : (
              <Link href={`/${lastItem.slug}`} key={lastItem.id}>
                <PostCard post={lastItem} />
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
