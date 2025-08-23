
import Link from 'next/link';
import { Post } from '@/lib/types';
import { AdCard } from '../ads/adcard';
import { PostCard } from './PopularPostsCard';
import { Ad, ADS } from '../ads/adsContent';
import PopularNewsSequenceClient from './featuredPostsTicker';

type AdItem = { type: 'ad'; adIndex: number; id: string | number };
type PostItem = Post & { type: 'post' };
type FeedItem = AdItem | PostItem;

function AdGridCard({ ad, className = '' }: { ad: Ad; className?: string }) {
  const getExcerpt = (text: string, words = 15) => {
    const wordArray = text.trim().split(/\s+/);
    return wordArray.length > words ? `${wordArray.slice(0, words).join(' ')}…` : text;
  };

  return (
    <div className={`flex flex-col shadow bg-[#FFF8F2] w-full overflow-hidden ${className}`}>
      <div className="relative w-full h-[180px] overflow-hidden">
        <AdCard ad={ad} />
      </div>
      <div className="p-4 flex flex-col justify-between flex-grow">
        <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wide text-start mb-2">
          Sponsored
        </span>
        {ad.text && <p className="text-sm text-gray-700 leading-snug mb-1 break-words">{getExcerpt(ad.text)}</p>}
      </div>
    </div>
  );
}

export default function PopularNews({
  items = [],
  tickerItems = [],
  tagline = '',
}: {
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
}) {
  if (!items.length) return <div className="py-8 text-center">No popular posts found.</div>;

  const topItems = items.slice(0, 4);
  const bottomItems = items.slice(4, 8);
  const lastItem = items[8];

  return (
    <section className="w-[100%] lg:w-[90%] xl:w-[70%] px-2  mx-auto py-8">
      {tagline ? (
        <h1 className="mt-1 text-sm text-gray-500 block mb-4">{tagline}</h1>
      ) : (
        <div className="h-4 w-40 rounded bg-gray-200/70 animate-pulse mb-4" />
      )}

      {tickerItems?.length ? (
        <div>
          <PopularNewsSequenceClient items={tickerItems} />
        </div>
      ) : null}

      <div className="flex flex-col gap-8">
        {/* Mobile grid */}
        <div className="grid grid-cols-2 gap-4 lg:hidden">
          {items.slice(0, 8).map((item, idx) =>
            item.type === 'ad' ? (
              <AdGridCard key={`ad-m-${idx}`} ad={ADS[item.adIndex]} />
            ) : (
              <Link href={`/${item.slug}`} key={item.id} prefetch={false}>
                <PostCard post={item} />
              </Link>
            )
          )}
          {items[8] && (
            <div className="col-span-2 mt-2">
              {items[8].type === 'ad' ? (
                <AdGridCard ad={ADS[items[8].adIndex]} />
              ) : (
                <Link href={`/${items[8].slug}`} prefetch={false}>
                  <PostCard post={items[8]} />
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Desktop rows */}
        <div className="hidden lg:grid grid-cols-4 gap-2">
          {topItems.map((item, idx) =>
            item.type === 'ad' ? (
              <AdGridCard key={`ad-top-${idx}`} ad={ADS[item.adIndex]} />
            ) : (
              <Link href={`/${item.slug}`} key={item.id} prefetch={false}>
                <PostCard post={item} />
              </Link>
            )
          )}
        </div>

        <div className="hidden lg:grid grid-cols-5 gap-2">
          {bottomItems.map((item, idx) =>
            item.type === 'ad' ? (
              <AdGridCard key={`ad-bot-${idx}`} ad={ADS[item.adIndex]} />
            ) : (
              <Link href={`/${item.slug}`} key={item.id} prefetch={false}>
                <PostCard post={item} />
              </Link>
            )
          )}
          {lastItem &&
            (lastItem.type === 'ad' ? (
              <AdGridCard key="ad-last" ad={ADS[lastItem.adIndex]} />
            ) : (
              <Link href={`/${lastItem.slug}`} key={lastItem.id} prefetch={false}>
                <PostCard post={lastItem} />
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
