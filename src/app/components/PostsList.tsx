'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { stripHtml } from '@/lib/helper_functions/strip_html';
import { Sidebar } from '../[slug]/components/sideBar';

export default function PostsList() {
  const { searchBarHeader, posts } = useAppContext();
  const term = searchBarHeader.trim().toLowerCase();
  const filtered = term
    ? posts.filter((p) => p.title.toLowerCase().includes(term))
    : posts;

  // Only render the first 10
  const items = filtered.slice(0, 10);

  // Helper to limit excerpt
  const limitWords = (text: string, maxWords: number) => {
    const words = text.split(/\s+/);
    return words.length > maxWords
      ? words.slice(0, maxWords).join(' ') + '…'
      : text;
  };

  if (items.length === 0) {
    return (
      <div className="w-[90%] lg:w-[70%] mx-auto">
        <p className="text-center text-gray-500 text-sm">No posts found</p>
      </div>
    );
  }

  return (
    <div className="w-[90%] lg:w-[50%] mx-auto">
      {/* More gap between columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-x-12 lg:gap-y-6 py-4">
        {/* Main feed */}
        <main className="lg:col-span-9">
          {/* Three columns for posts */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((post, index) => {
              const rawExcerpt = stripHtml(post.excerpt!) || '';
              const limitedExcerpt = limitWords(rawExcerpt, 15);

              return (
                <li
                  key={post.id}
                  className="flex flex-col p-3 shadow-sm rounded-sm hover:cursor-pointer"
                >
                  {post.featuredImage?.node?.sourceUrl && (
                    <Link href={`/${post.slug}`}>
                      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-sm mb-2">
                        <Image
                          src={post.featuredImage.node.sourceUrl}
                          alt={post.featuredImage.node.altText || post.title}
                          fill
                          className="object-cover"
                          priority={index < 2}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 30vw"
                        />
                      </div>
                    </Link>
                  )}

                  <h3 className="text-base lg:text-lg font-semibold mb-1 leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-gray-700 mb-2 text-xs leading-relaxed">
                    {limitedExcerpt}
                  </p>

                  <Link
                    href={`/${post.slug}`}
                    className="inline-block text-blue-600 text-xs font-medium hover:underline"
                  >
                    Read more →
                  </Link>
                </li>
              );
            })}
          </ul>
        </main>

        {/* Sidebar unchanged */}
        <aside className="lg:col-span-3 lg:sticky lg:top-15 self-start text-sm rounded-sm">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
