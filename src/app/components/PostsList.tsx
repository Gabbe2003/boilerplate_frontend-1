'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { useRef, useState, useEffect } from 'react';
import { stripHtml } from '@/lib/helper_functions/strip_html';
import { Sidebar } from '../[slug]/components/sideBar';

export default function PostsList() {
  const { searchBarHeader, posts } = useAppContext();
  const term = searchBarHeader.trim().toLowerCase();
  const filtered = term ? posts.filter((p) => p.title.toLowerCase().includes(term)) : posts;

  const [visibleCount, setVisibleCount] = useState(3);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (filtered.length <= visibleCount) return;
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(filtered.length, c + 3));
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, filtered.length]);

  if (filtered.length === 0) {
    return (
      <div className="w-[90%] lg:w-[65%] mx-auto">
        <p className="text-center text-gray-500 text-sm">No posts found</p>
      </div>
    );
  }

  return (
    <div className="w-[90%] lg:w-[65%] mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 py-4">
        {/* Main feed */}
        <main className="lg:col-span-10">
          <ul className="space-y-3">
            {filtered.slice(0, visibleCount).map((post, index) => (
              <li
                key={post.id}
                className="flex flex-col p-3 shadow-sm rounded-sm"
              >
                {post.featuredImage?.node?.sourceUrl && (
                  <Link href={`/${post.slug}`}>
                    <div className="relative w-full aspect-[5/1] overflow-hidden rounded-sm mb-3">
                      <Image
                        src={post.featuredImage.node.sourceUrl}
                        alt={post.featuredImage.node.altText || post.title}
                        fill
                        className="object-cover"
                        priority={index < 2}
                        sizes="(max-width: 1024px) 100vw, 45vw"
                      />
                    </div>
                  </Link>
                )}

                <h3 className="text-base lg:text-lg font-semibold mb-1 leading-snug">
                  {post.title}
                </h3>

                <div
                  className="text-gray-700 mb-2 prose prose-xs max-w-none"
                  dangerouslySetInnerHTML={{ __html: stripHtml(post.excerpt!) || '' }}
                />

                <Link
                  href={`/${post.slug}`}
                  className="inline-block text-blue-600 text-xs font-medium hover:underline"
                >
                  Read more →
                </Link>
              </li>
            ))}

            {visibleCount < filtered.length && <div ref={observerRef} className="h-3" />}
          </ul>
        </main>

        {/* Smaller sidebar */}
        <aside className="lg:col-span-2 lg:sticky lg:top-20 self-start text-sm rounded-sm">
          <Sidebar />
        </aside>
      </div>
    </div>
  );
}
