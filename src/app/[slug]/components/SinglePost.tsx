'use client';

import { useRef, useEffect, useCallback } from 'react';
import type { PostWithTOC } from '@/lib/types';
import { useInfinitePosts } from './infinitePostHandler';
import { ArticleWithContent } from './ArticleWithContent';
import dynamic from 'next/dynamic';
import { stripHtml } from '@/lib/helper_functions/strip_html';

const EndOfPageRecommendations = dynamic(
  () => import('./EndOfPageRecommendations'),
  { ssr: false },
);

export function SinglePost({ initialPost }: { initialPost: PostWithTOC }) {
  const { rendered, loading, sentinelRef } = useInfinitePosts(initialPost);
  const articleRefs = useRef<Array<HTMLElement | null>>([]);

  const setArticleRef = useCallback(
    (idx: number) => (el: HTMLElement | null) => {
      articleRefs.current[idx] = el;
    },
    [],
  );

  useEffect(() => {
    if (rendered.length === 0) return;

    let lastScrollY = window.scrollY;
    document.title = rendered[0]?.title || document.title;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const dir = scrollY > lastScrollY ? 'down' : 'up';
          lastScrollY = scrollY;
          const articles = articleRefs.current;
          const threshold = 80;

          if (dir === 'down') {
            for (let i = 0; i < articles.length; i++) {
              const ref = articles[i];
              if (!ref) continue;
              const rect = ref.getBoundingClientRect();
              if (rect.top >= 0 && rect.top < threshold) {
                updateMeta(i);
                break;
              }
            }
          } else {
            for (let i = articles.length - 2; i >= 0; i--) {
              const ref = articles[i];
              if (!ref) continue;
              const rect = ref.getBoundingClientRect();
              if (
                rect.bottom <= window.innerHeight &&
                rect.bottom > window.innerHeight - threshold
              ) {
                updateMeta(i);
                break;
              }
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    function updateMeta(i: number) {
      if (!rendered[i]) return;
      document.title = rendered[i].title || document.title;
      window.history.replaceState(
        null,
        rendered[i].title || '',
        `/${rendered[i].slug}`,
      );
      const meta = document.querySelector('meta[name="description"]');
      if (meta && rendered[i].excerpt) {
        meta.setAttribute('content', stripHtml(rendered[i].excerpt));
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [rendered.length]);

  return (
<div className="space-y-16 max-w-7xl mx-auto py-12 px-4 sm:px-6 md:px-8 mb-10">
      {rendered.map((post, i) => {
        const postUrl = `${process.env.NEXT_PUBLIC_SHARENAME || 'https://yoursite.com'}/${post.slug}`;
        const postExcerpt = stripHtml(post.excerpt!);

        return (
          <div
            key={post.slug}
            className="flex grid-cols-1 lg:grid-cols-3 gap-8 items-start"
            data-index={i}
            ref={setArticleRef(i)}
          >
            <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
              <ArticleWithContent
                post={post}
                postUrl={postUrl}
                postExcerpt={postExcerpt}
                index={i}
              />
              <EndOfPageRecommendations currentSlug={post.slug} />
              <div className="border-t border-neutral-200 w-full my-8" />

            </div>
          </div>
        );
      })}
      <div ref={sentinelRef} style={{ height: 1 }} />
      {loading && <p className="text-center">Downloading more...</p>}
    </div>
  );
}
