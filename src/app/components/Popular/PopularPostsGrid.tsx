import Link from 'next/link';
import { Post } from '@/lib/types';
import PostCard from './PopularPostsCard';
import PopularNewsSequenceClient from './featuredPostsTicker';
import TodayPostsSidebar from '../TodayPostsSidebar';
<<<<<<< HEAD
import { AdSlot } from '../ReadPeek';
import { JSX } from 'react';
=======
>>>>>>> e5905b196b20d97a21bd36c6f9f83ecc04f86838

type PostItem = Post & { type?: 'post' };
type FeedItem = PostItem;

<<<<<<< HEAD
type Props = {
=======
export default function PopularNews({
  items = [],
  tickerItems = [],
  tagline = '',
}: {
>>>>>>> e5905b196b20d97a21bd36c6f9f83ecc04f86838
  items: FeedItem[];
  tickerItems?: {
    id: string;
    slug: string;
    title: string;
    date?: string;
    author_name?: string;
    featuredImage?: string | { node?: { sourceUrl?: string } };
  }[];
  tagline?: string;
<<<<<<< HEAD

  /** Ad controls */
  adReady?: boolean;                 // toggle ads on/off
  adSlotId?: string;                 // ReadPeak placement id
  adKey?: string;                    // react key prefix for the ad node
  adIndexMobileGrid?: number | null; // where to insert in the mobile grid (leftCol)
  adIndexLeftCol?: number | null;    // where to insert in the desktop left column
  adIndexMidCol?: number | null;     // where to insert in the desktop middle column
};

export default function PopularNews({
  items = [],
  tickerItems = [],
  tagline = '',

  // sensible defaults; change as you need
  adReady = true,
  adSlotId = '446360ac0fb854fc',
  adKey = '90924881c10805b4-ad',
  adIndexMobileGrid = 2,
  adIndexLeftCol = 2,
  adIndexMidCol = 1,
}: Props) {
=======
}) {
>>>>>>> e5905b196b20d97a21bd36c6f9f83ecc04f86838
  if (!items.length) return <div className="py-8 text-center">Inga populära inlägg hittades.</div>;

  // Vänster kolumn får 4 inlägg; mitten (hero) får 2
  const leftCol = items.slice(0, 4);
  const midCol = items.slice(4, 6);

<<<<<<< HEAD
  /**
   * Helper: render a list of posts and, if enabled, inject an AdSlot at a given index.
   * `wrapperClass` lets us match grid/flex contexts ("col-span-1" for grid, or nothing for flex stacks).
   */
  const renderWithAd = (
    list: FeedItem[],
    insertAt: number | null | undefined,
    keyPrefix: string,
    wrapperClass?: string
  ) => {
    return list.flatMap((item, i) => {
      const nodes: JSX.Element[] = [];

      if (adReady && insertAt !== null && insertAt !== undefined && i === insertAt) {
        nodes.push(
          <div className={wrapperClass} key={`${adKey}-${keyPrefix}-${i}`}>
            <AdSlot id={adSlotId} numberOfAds={1} className="w-full" />
          </div>
        );
      }

      nodes.push(
        <Link href={`/${item.slug}`} key={`${keyPrefix}-${item.id}`} prefetch={false}>
          <PostCard post={item} />
        </Link>
      );

      return nodes;
    });
  };

  return (
    <section className="w-[100%] lg:w-[90%] xl:w-[70%] px-2 mx-auto py-8">
=======
  return (
    <section className="w-[100%] lg:w-[90%] xl:w-[70%] px-2 mx-auto py-8">

>>>>>>> e5905b196b20d97a21bd36c6f9f83ecc04f86838
      {tagline ? (
        <h1 className="mt-1 text-sm text-gray-500 block mb-4">{tagline}</h1>
      ) : (
        <div className="h-4 w-40 rounded bg-gray-200/70 animate-pulse mb-4" />
      )}

      {tickerItems?.length ? (
        <div className="mb-6">
          <PopularNewsSequenceClient items={tickerItems} />
        </div>
      ) : null}

<<<<<<< HEAD
      <hr className="my-6 border-gray-200" />

      {/* MOBILE FIRST */}
      <div className="lg:hidden space-y-6">
        {/* Mittens hero-inlägg först */}
        <div className="flex flex-col gap-6">
          {midCol.flatMap((item, i) => [
            // Optional: insert an ad before the i-th hero card (use adIndexMidCol === i)
            ...(adReady && adIndexMidCol === i
              ? [
                  <div key={`${adKey}-mid-mobile-${i}`}>
                    <AdSlot id={adSlotId} numberOfAds={1} className="w-full" />
                  </div>,
                ]
              : []),
            <Link href={`/${item.slug}`} key={`mid-mobile-${item.id}`} prefetch={false}>
              <PostCard post={item} variant="hero" className="h-[420px]" />
            </Link>,
          ])}
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Vänstra inlägg efter hero — 2-kolumners grid */}
        <div className="grid grid-cols-2 gap-4">
          {renderWithAd(leftCol, adIndexMobileGrid, 'left-mobile', 'col-span-1')}
        </div>

        <hr className="my-4 border-gray-300" />

        {/* Sidofält på mobil */}
=======
      {/* Horisontell avgränsare */}
      <hr className="my-6 border-gray-200" />

      {/* MOBILE FIRST: visa MITTEN (hero), sedan VÄNSTER kompakt grid och sidofält */}
      <div className="lg:hidden space-y-6">
        {/* Mittens hero-inlägg först */}
        <div className="flex flex-col gap-6">
          {midCol.map((item) => (
            <Link href={`/${item.slug}`} key={item.id} prefetch={false}>
              <PostCard
                post={item}
                variant="hero"
                className="h-[420px]" 
              />
            </Link>
          ))}
        </div>

        {/* Avgränsare */}
        <hr className="my-4 border-gray-300" />

        {/* Vänstra inlägg efter hero — mindre bilder, 2-kolumners grid */}
        <div className="grid grid-cols-2 gap-4">
          {leftCol.map((item) => (
            <Link href={`/${item.slug}`} key={item.id} prefetch={false}>
              <PostCard
                post={item}
                className="h-full" 
              />
            </Link>
          ))}
        </div>

        {/* Avgränsare före sidofältet */}
        <hr className="my-4 border-gray-300" />

        {/* HÖGER kolumn (sidofält) — nu också synlig på mobil */}
>>>>>>> e5905b196b20d97a21bd36c6f9f83ecc04f86838
        <aside>
          <TodayPostsSidebar />
        </aside>
      </div>

<<<<<<< HEAD
      {/* DESKTOP */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 mt-8">
        {/* VÄNSTER kolumn */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 border-r border-gray-200 pr-4">
          {renderWithAd(leftCol, adIndexLeftCol, 'left-desktop')}
=======
      {/* DESKTOP: layout med 3 kolumner */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-6 mt-8">
        {/* VÄNSTER kolumn (4 mindre staplade inlägg) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 border-r border-gray-200 pr-4">
          {leftCol.map((item) => (
            <Link href={`/${item.slug}`} key={item.id} prefetch={false}>
              <PostCard post={item} />
            </Link>
          ))}
>>>>>>> e5905b196b20d97a21bd36c6f9f83ecc04f86838
        </div>

        {/* MITTERSTA kolumn (2 hero-kort) */}
        <div className="col-span-12 lg:col-span-5 flex flex-col gap-6 px-4">
<<<<<<< HEAD
          {midCol.flatMap((item, i) => [
            ...(adReady && adIndexMidCol === i
              ? [
                  <div key={`${adKey}-mid-desktop-${i}`}>
                    <AdSlot id={adSlotId} numberOfAds={1} className="w-full" />
                  </div>,
                ]
              : []),
            <Link href={`/${item.slug}`} key={`mid-desktop-${item.id}`} prefetch={false}>
              <PostCard post={item} variant="hero" className="h-[460px] xl:h-[500px]" />
            </Link>,
          ])}
=======
          {midCol.map((item) => (
            <Link href={`/${item.slug}`} key={item.id} prefetch={false}>
              <PostCard
                post={item}
                variant="hero"
                className="h-[460px] xl:h-[500px]"
              />
            </Link>
          ))}
>>>>>>> e5905b196b20d97a21bd36c6f9f83ecc04f86838
        </div>

        {/* HÖGER kolumn (sidofält) */}
        <aside className="col-span-12 lg:col-span-4 border-l border-gray-200 pl-4">
          <TodayPostsSidebar />
        </aside>
      </div>
    </section>
  );
}
