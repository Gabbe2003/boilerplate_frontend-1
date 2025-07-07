'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { CardContent } from '@/components/ui/card';
import type { Post } from '@/lib/types';

interface RecommendationListProps {
  currentSlug: string;
}

export default function RecommendationList({ currentSlug }: RecommendationListProps) {
  const { posts } = useAppContext();

  const filtered = useMemo(
    () => posts.filter((post) => post.slug !== currentSlug),
    [posts, currentSlug]
  );

  const recommendations: Post[] = useMemo(() => {
    const total = filtered.length;
    if (total <= 10) return filtered;
    const maxStart = total - 10;
    const start = Math.floor(Math.random() * (maxStart + 1));
    return filtered.slice(start, start + 10);
  }, [filtered]);

  return (
    <CardContent className="p-0  ">
      <div className="grid lg:grid-cols-1 md:grid-cols-2 gap-5">
        {recommendations.map((post) => (
          <Link
            key={post.slug}
            href={`/${post.slug}`}
            className="block hover:bg-black-50 rounded"
          >
            <h4 className="font-medium hover:underline">{post.title}</h4>
            <div className="text-xs text-muted-foreground">
              Av {post.author?.node.name || 'Redaktionen'} -{' '}
              {new Date(post.date).toLocaleDateString('sv-SE', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </Link>
        ))}
      </div>
    </CardContent>
  );
}
