'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useAppContext } from '@/store/AppContext';
import { stripHtml } from '@/lib/helper_functions/strip_html';
import { Button } from '@/components/ui/button';
import { Sidebar } from '../components/Main-page/SideBar';

function getFirstWords(htmlOrText: string, count: number) {
  const text = stripHtml(htmlOrText || '');
  const words = text.split(/\s+/).filter(Boolean);
  return words.length > count ? words.slice(0, count).join(' ') + '…' : text;
}

export default function PostsList() {
  const { searchBarHeader, posts } = useAppContext();
  const term = searchBarHeader.trim().toLowerCase();
  const filtered = term
    ? posts.filter((p) => stripHtml(p.title).toLowerCase().includes(term))
    : posts;

  const [visibleCount, setVisibleCount] = useState(8);
  const items = filtered.slice(0, visibleCount);

  if (items.length === 0) {
    return (
      <div className="mx-auto w/full xl:w-[70%] px-2 sm:px-4 md:px-6">
        <p className="text-center text-gray-500 text-sm">No posts found</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--secBG)]">
      <div className="mx-auto w-full px-2 lg:w-[90%] xl:w-[60%] sm:px-4">
        {/* 1 col on mobile; 70/30 split on lg+ */}
        <div className="grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-6 py-4">
          {/* Main feed (≈70%) */}
          <main>
            <h1 className="text-xl sm:px-2 font-bold mb-3">Archive</h1>
            <hr className="border-gray-200 mb-4" />

            {/* Cards grid styled like the reference */}
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((post, idx) => {
                const imgSrc = post?.featuredImage?.node?.sourceUrl;
                const imgAlt =
                  post?.featuredImage?.node?.altText ||
                  stripHtml(post?.title || '');
                const isLCP = idx === 0; // Boost first result

                return (
                  <li
                    key={post.id ?? post.databaseId ?? post.slug}
                    className="rounded-sm hover:cursor-pointer transition flex flex-col overflow-hidden group"
                  >
                    {/* Image */}
                    {imgSrc ? (
                      <Link href={`/${post.slug}`} className="block overflow-hidden">
                        <div className="relative w-full aspect-[1200/450]">
                          <Image
                            src={imgSrc || '/favicon_logo.png'}
                            alt={imgAlt}
                            fill
                            sizes="(max-width: 640px) 100vw,
                                   (max-width: 1024px) 60vw,
                                   75vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-200 bg-[#f5f5f5]"
                            quality={85}
                            priority={isLCP}
                            fetchPriority={isLCP ? 'high' : 'auto'}
                            loading={isLCP ? 'eager' : 'lazy'}
                            placeholder={isLCP ? 'empty' : 'blur'}
                            blurDataURL={
                              !isLCP
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                ? (post as any)?.featuredImage?.node?.blurDataURL ||
                                  '/favicon_logo.png'
                                : undefined
                            }
                          />
                        </div>
                      </Link>
                    ) : (
                      <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Content */}
                    <div className="pt-4 flex flex-col flex-1">
                      <Link
                        href={`/${post.slug}`}
                        className="font-bold text-lg mb-1 hover:underline line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: post.title }}
                      />
                      <div className="flex items-center justify-between mb-2">
                        {/* Author info left */}
                        <div className="flex items-center gap-2">
                          {post.author?.node?.avatar?.url && (
                            <Image
                              src={post.author.node.avatar.url}
                              alt={post.author.node.name || 'Author'}
                              width={24}
                              height={24}
                              className="rounded-full"
                            />
                          )}
                          {post.author?.node && (
                            <Link
                              href={`/author/${post.author.node.slug}`}
                              className="text-xs text-gray-700 hover:underline"
                            >
                              {post.author.node.name}
                            </Link>
                          )}
                        </div>
                        {/* Date right */}
                        {post.date && (
                          <span className="text-xs text-gray-500 mr-2">
                            {new Date(post.date).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      <div className="prose prose-sm text-gray-700 flex-1 line-clamp-4">
                        {getFirstWords(post.excerpt ?? '', 20)}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Load more button (styled per reference) */}
            {visibleCount < filtered.length && (
              <div className="mt-6 flex flex-col items-center gap-2">
                <Button
                  onClick={() => setVisibleCount((prev) => prev + 8)}
                  className="bg-black hover:bg-primary-600 text-white"
                >
                  Load more
                </Button>
              </div>
            )}
          </main>

          {/* Aside (≈30%) */}
          <aside className="lg:pt-12 mt-12 self-start text-sm rounded-sm">
            {/* Mobile separator above sidebar */}
            <div className="border-t border-gray-200 mb-4 lg:hidden" />
            <Sidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}
