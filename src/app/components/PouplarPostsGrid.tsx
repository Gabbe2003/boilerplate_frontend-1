'use client';

import React from 'react';
import Link from 'next/link';
import { Ad, ADS } from './ads/adsContent';
import { useAppContext } from '@/store/AppContext';
import { Post } from '@/lib/types';
import { PostCard } from './PouplarPostsCard';
import { AdCard } from './ads/adcard';

// --- Feed item discriminated union types ---
type AdItem = {
  type: 'ad';
  adIndex: number;
  id: string | number;
};
type PostItem = Post & { type: 'post' };
type FeedItem = AdItem | PostItem;

// --- AdGridCard, with fixed width/height, excerpt limited to 14 words ---
function AdGridCard({ ad, className = '' }: { ad: Ad; className?: string }) {
  function getExcerpt(text: string, words = 14): string {
    const wordArray = text.trim().split(/\s+/);
    return wordArray.length > words
      ? wordArray.slice(0, words).join(' ') + '…'
      : text;
  }

  return (
    <div className={`flex flex-col shadow bg-[#FFF8F2] w-full h-full overflow-hidden rounded-2xl ${className}`}>
      {/* Ad image area */}
      <div className="relative w-full h-[180px] overflow-hidden">
        <AdCard ad={ad} />
      </div>
      {/* Bottom content */}
      <div className="p-4 flex flex-col justify-between flex-grow">
        <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide text-start mb-2">
          Sponsored
        </span>
        {ad.text && (
          <p className="text-sm text-gray-700 leading-snug mb-1 break-words">
            {getExcerpt(ad.text, 14)}
          </p>
        )}
      </div>
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

  // --- DYNAMIC COLUMNS for 2nd desktop row ---
  const bottomGridCols = bottomItems.length > 0
    ? `grid-cols-${Math.max(bottomItems.length, lastItem ? bottomItems.length + 1 : bottomItems.length)}`
    : 'grid-cols-5';

  return (
    <section className="w-[90%] mx-auto py-8">
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
              <Link href={`/${(item as PostItem).slug}`} key={item.id}>
                <PostCard post={item as PostItem} />
              </Link>
            )
          )}
          {items[8] && (
            <div className="col-span-2 mt-2">
              {items[8].type === 'ad' ? (
                <AdGridCard ad={ADS[(items[8] as AdItem).adIndex]} />
              ) : (
                <Link href={`/${(items[8] as PostItem).slug}`}>
                  <PostCard post={items[8] as PostItem} />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Desktop: first row, 4 columns */}
        <div className="hidden lg:grid grid-cols-4 gap-2">
          {topItems.map((item, idx) =>
            item.type === 'ad' ? (
              <AdGridCard key={`ad-top-${idx}`} ad={ADS[(item as AdItem).adIndex]} />
            ) : (
              <Link href={`/${(item as PostItem).slug}`} key={item.id}>
                <PostCard post={item as PostItem} />
              </Link>
            )
          )}
        </div>

        {/* Desktop: second row, dynamic columns */}
        <div
          className={`hidden lg:grid gap-2 ${
            lastItem
              ? `grid-cols-${bottomItems.length + 1}`
              : `grid-cols-${bottomItems.length || 5}`
          }`}
        >
          {bottomItems.map((item, idx) =>
            item.type === 'ad' ? (
              <AdGridCard key={`ad-bot-${idx}`} ad={ADS[(item as AdItem).adIndex]} />
            ) : (
              <Link href={`/${(item as PostItem).slug}`} key={item.id}>
                <PostCard post={item as PostItem} />
              </Link>
            )
          )}
          {lastItem &&
            (lastItem.type === 'ad' ? (
              <AdGridCard key="ad-last" ad={ADS[(lastItem as AdItem).adIndex]} />
            ) : (
              <Link href={`/${(lastItem as PostItem).slug}`} key={lastItem.id}>
                <PostCard post={lastItem as PostItem} />
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
