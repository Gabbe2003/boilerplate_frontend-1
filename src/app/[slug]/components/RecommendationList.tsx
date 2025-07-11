// RecommendationList.tsx
'use client';

import React, { useMemo } from 'react';
import { useAppContext } from '@/store/AppContext';
import type { Post } from '@/lib/types';

interface RecommendationListProps {
  currentSlug: string;
  children: (recommendations: Post[]) => React.ReactNode;
}

export default function RecommendationList({ currentSlug, children }: RecommendationListProps) {
  const { posts } = useAppContext();

  const filtered = useMemo(
    () => posts.filter((post) => post.slug !== currentSlug),
    [posts, currentSlug]
  );

  const recommendations: Post[] = useMemo(() => {
    const total = filtered.length;
    if (total <= 5) return filtered;
    const maxStart = total - 5;
    const start = Math.floor(Math.random() * (maxStart + 1));
    return filtered.slice(start, start + 5);
  }, [filtered]);

  return <>{children(recommendations)}</>;
}
