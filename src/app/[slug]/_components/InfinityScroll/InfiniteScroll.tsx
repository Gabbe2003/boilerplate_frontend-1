// components/InfiniteScroll.tsx
"use client";

import { useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

type InfiniteScrollProps<T> = {
  loadMore: () => Promise<T | null>;
  onData: (data: T) => void;
  disabled?: boolean;
  rootMargin?: string; 
};

export default function InfiniteScroll<T>({
  loadMore,
  onData,
  disabled = false,
  rootMargin = "0px 0px 50% 0px",
}: InfiniteScrollProps<T>) {
  const [loading, setLoading] = useState(false);
  const armedRef = useRef(true); 

  const { ref } = useInView({
    root: null,
    rootMargin,
    threshold: 0.5,
    onChange: async (inView) => {
      if (disabled) return;
      if (!inView) {
        armedRef.current = true;
        return;
      }

      if (!loading && armedRef.current) {
        armedRef.current = false;
        try {
          setLoading(true);
          const item = await loadMore();
          if (item) onData(item);
        } finally {
          setLoading(false);
        }
      }
    },
  });

  return (
    <div ref={ref} aria-hidden className="w-full flex items-center justify-center py-8">
      {loading ? (
        <div className="animate-pulse text-sm text-muted-foreground">Loading more…</div>
      ) : null}
    </div>
  );
}
