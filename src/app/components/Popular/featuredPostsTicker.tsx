'use client';

import {useEffect, useState, Key, ReactNode, CSSProperties, useRef} from 'react';
import Link from 'next/link';
import type { Item } from '../PopularNewsTicker';

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mql.matches);
    onChange();
    mql.addEventListener?.('change', onChange);
    return () => mql.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

 function AnimatedSwitcher({
  itemKey,
  children,
  className = '',
  fadeDuration = 200,  
  instantOnMount = true,
}: {
  itemKey: Key;
  reduced: boolean;
  className?: string;
  fadeDuration?: number;
  instantOnMount?: boolean;
  children: (opts: { role: 'entering' | 'exiting'; style: CSSProperties }) => ReactNode;
}) {
  const didMountRef = useRef(false);
  const [currentKey, setCurrentKey] = useState(itemKey);
  const [prevKey, setPrevKey] = useState<Key | null>(null);
  const [fadeIn, setFadeIn] = useState(false);

  const isFirst = instantOnMount && !didMountRef.current;

  useEffect(() => {
    didMountRef.current = true;
  }, []);

  useEffect(() => {
    if (itemKey === currentKey) return;
    setPrevKey(currentKey);
    setCurrentKey(itemKey);
    setFadeIn(false);
    const id = requestAnimationFrame(() => setFadeIn(true));
    return () => cancelAnimationFrame(id);
  }, [itemKey, currentKey]);

  const base: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    transition: `opacity ${fadeDuration}ms ease`,
  };

  return (
    <div className={`relative ${className}`}>
      {/* Entering */}
      <div
        key={`enter-${currentKey}`}
        style={{
          ...base,
          opacity: isFirst ? 1 : fadeIn ? 1 : 0,
        }}
      >
        {children({ role: 'entering', style: { width: '100%' } })}
      </div>

      {/* Exiting */}
      {prevKey !== null && (
        <div
          key={`exit-${prevKey}`}
          style={{
            ...base,
            opacity: fadeIn ? 0 : 1,
          }}
          onTransitionEnd={() => setPrevKey(null)}
        >
          {children({ role: 'exiting', style: { width: '100%' } })}
        </div>
      )}
    </div>
  );
}

export default function PopularNewsSequenceClient({
  items,
  intervalMs = 3000,
  className = '',
}: {
  items: Item[];
  intervalMs?: number;
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (paused || items.length <= 1) return;
    const t = setTimeout(() => {
      setIndex((i) => (i + 1) % items.length);
    }, intervalMs);
    return () => clearTimeout(t);
  }, [index, paused, items.length, intervalMs]);

  const onPause = () => setPaused(true);
  const onResume = () => setPaused(false);

  const current = items[index];

  return (
    <div
      className={`group relative w-full overflow-hidden border-0 ${className}`}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocusCapture={onPause}
      onBlurCapture={onResume}
      role="region"
      aria-label="Featured posts"
    >
      {/* Row: badge + animated post */}
      <div className="flex h-12 items-center gap-3 border-0">
        <span className="bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary shrink-0">
          Featured posts
        </span>

      <AnimatedSwitcher
        itemKey={current?.id ?? index}
        reduced={prefersReducedMotion}
        className="flex-1"
        fadeDuration={200}   // adjust speed of crossfade
        instantOnMount
      >
        {() => <PostSlide post={current} reduced={prefersReducedMotion} />}
      </AnimatedSwitcher>

      {/* Local keyframes for the 2s pulse (no external CSS needed) */}
      <style jsx>{`
        @keyframes subtlePulse {
          0%   { transform: scale(1);    opacity: 1; }
          50%  { transform: scale(1.02); opacity: 0.98; }
          100% { transform: scale(1);    opacity: 1; }
        }
        .pulse-2s {
          animation: subtlePulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
    </div>
  );
}

function PostSlide({
  post,
  reduced,
}: {
  post: Item;
  reduced: boolean;
}) {
  return (
    <div className="absolute inset-0 flex items-center border-0">
      <div
        className={`flex min-w-0 items-center gap-3 ${reduced ? '' : 'pulse-2s'}`}
        aria-live="polite"
        aria-atomic="true"
      >
        {/* pulsing red dot */}
        <span className="relative inline-flex h-3 w-3 shrink-0" aria-hidden>
          <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
        </span>

        <Link
          href={post.slug?.startsWith('/') ? post.slug : `/${post.slug}`}
          className="block w-full truncate text-sm md:text-base font-medium leading-6 hover:underline focus:outline-none focus:ring-0"
        >
          {post.title}
        </Link>
      </div>
    </div>
  );
}
