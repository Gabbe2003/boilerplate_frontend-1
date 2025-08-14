'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useMotionValue, animate, type AnimationPlaybackControls } from 'framer-motion';
import { Item } from '../PopularNewsTicker';

export default function PopularNewsTickerClient({
  items,
  speed,
  showThumbnails,
  className,
}: {
  items: Item[];
  speed: number;
  showThumbnails: boolean;
  className?: string;
}) {
  // Motion value so we can pause/resume without restarting
  const x = useMotionValue(0);
  const animRef = React.useRef<AnimationPlaybackControls | null>(null);

  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const [distance, setDistance] = React.useState(1000); // fallback width

  // Measure width of the first copy to know how far to scroll
  React.useEffect(() => {
    if (!trackRef.current) return;
    const firstRow = trackRef.current.querySelector('[data-copy="1"]') as HTMLElement | null;
    if (!firstRow) return;
    setDistance(firstRow.scrollWidth);
  }, [items]);

  const start = React.useCallback(() => {
    const pxPerSec = Math.max(1, speed);
    const duration = distance / pxPerSec;

    // Restart loop from current x without jumping back after hover
    animRef.current?.stop();
    animRef.current = animate(x, [0, -distance], {
      duration,
      ease: 'linear',
      repeat: Infinity,
      repeatType: 'loop',
    });
  }, [x, distance, speed]);

  const pause = React.useCallback(() => animRef.current?.pause(), []);
  const resume = React.useCallback(() => animRef.current?.play(), []);

  React.useEffect(() => {
    start();
    return () => animRef.current?.stop();
  }, [start]);

  return (
    <div
      className={`group relative w-full overflow-hidden border bg-background ${className ?? ''}`}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocusCapture={pause}
      onBlurCapture={resume}
      role="region"
      aria-label="Featured posts news ticker"
    >
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          Featured posts
        </span>
        <span className="text-xs text-muted-foreground">Hover to pause</span>
      </div>

      <div className="relative h-12">
        <div className="absolute inset-0">
          <motion.div ref={trackRef} style={{ x }} className="flex h-12 items-center">
            {/* Copy 1 */}
            <TickerRow items={items} showThumbnails={showThumbnails} copy={1} />
            {/* Copy 2 (duplicate for seamless infinite loop) */}
            <TickerRow items={items} showThumbnails={showThumbnails} copy={2} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function TickerRow({
  items,
  showThumbnails,
  copy,
}: {
  items: Item[];
  showThumbnails: boolean;
  copy: 1 | 2;
}) {
  return (
    <div
      className="flex h-12 items-center gap-6 pr-6"
      aria-hidden={copy === 2} // duplicate is decorative
      data-copy={copy}
    >
      {items.map((post) => {
        const imgSrc =
          typeof post.featuredImage === 'string'
            ? post.featuredImage
            : post.featuredImage?.node?.sourceUrl;

        return (
          <div key={`${copy}-${post.id}`} className="flex shrink-0 items-center gap-3">
            {showThumbnails && (
              <div className="relative size-7 overflow-hidden bg-secondary">
                {imgSrc ? (
                  <Image src={imgSrc} alt="" fill sizes="28px" className="object-cover" />
                ) : (
                  <span className="block h-full w-full" aria-hidden />
                )}
              </div>
            )}

            {/* pulsing red dot before each post title */}
            <span className="relative inline-flex h-2.5 w-2.5" aria-hidden>
              <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-500 opacity-75 animate-ping" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
            </span>

            <Link
              href={post.slug?.startsWith('/') ? post.slug : `/posts/${post.slug}`}
              className="max-w-[28rem] truncate text-sm font-medium hover:underline"
            >
              {post.title}
            </Link>
            <span className="text-muted-foreground">•</span>
          </div>
        );
      })}
    </div>
  );
}
