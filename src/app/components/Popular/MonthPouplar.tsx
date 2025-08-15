'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import type { Item } from '../PopularNewsTicker';

export default function PopularNewsSequenceClient({
  items,
  // Optional: how long to show each post (ms). The pulse lasts 2000ms; we wait exactly that long before switching.
  intervalMs = 2000,
  showThumbnails,
  className,
}: {
  items: Item[];
  intervalMs?: number;
  showThumbnails: boolean;
  className?: string;
}) {
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Advance after pulse duration unless paused or 0/1 item
  React.useEffect(() => {
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
      className={`group relative w-full overflow-hidden border bg-background ${className ?? ''}`}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocusCapture={onPause}
      onBlurCapture={onResume}
      role="region"
      aria-label="Featured posts"
    >
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          Featured posts
        </span>
        <span className="text-xs text-muted-foreground">
          {paused ? 'Paused' : 'Hover to pause'}
        </span>
      </div>

      <div className="relative h-16"> {/* slightly taller than old ticker */}
        <AnimatePresence mode="wait">
          <PostSlide
            key={current?.id ?? index}
            post={current}
            showThumbnails={showThumbnails}
            reduced={prefersReducedMotion}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

function PostSlide({
  post,
  showThumbnails,
  reduced,
}: {
  post: Item;
  showThumbnails: boolean;
  reduced: boolean;
}) {
  // Entrance -> pulse for 2s -> (parent swaps index) -> exit
  const variants: Variants = reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.2 } },
        exit: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        initial: { opacity: 0, y: 12, filter: 'blur(3px)' },
        animate: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        },
        exit: {
          opacity: 0,
          y: -12,
          filter: 'blur(3px)',
          transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
        },
      };

  const pulseProps = reduced
    ? {}
    : {
        // Subtle single pulse that lasts ~2s
        animate: { scale: [1, 1.02, 1], opacity: [1, 0.98, 1] },
        transition: { duration: 2, ease: 'easeInOut' as const },
      };

  const imgSrc =
    typeof post.featuredImage === 'string'
      ? post.featuredImage
      : (post.featuredImage as any)?.node?.sourceUrl;

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="absolute inset-0 flex items-center px-3"
    >
      <motion.div
        {...pulseProps}
        className="flex items-center gap-3"
        aria-live="polite"
        aria-atomic="true"
      >
        {showThumbnails && (
          <div className="relative size-9 overflow-hidden rounded bg-secondary">
            {imgSrc ? (
              <Image src={imgSrc} alt="" fill sizes="36px" className="object-cover" />
            ) : (
              <span className="block h-full w-full" aria-hidden />
            )}
          </div>
        )}

        {/* pulsing red dot */}
        <span className="relative inline-flex h-3 w-3" aria-hidden>
          <span className="absolute inline-flex h-3 w-3 rounded-full bg-red-500 opacity-75 animate-ping" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-red-600" />
        </span>

        <Link
          href={post.slug?.startsWith('/') ? post.slug : `/posts/${post.slug}`}
          className="max-w-[40rem] truncate text-base font-medium leading-6 hover:underline"
        >
          {post.title}
        </Link>
      </motion.div>
    </motion.div>
  );
}
