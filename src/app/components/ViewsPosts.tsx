'use client';

import React from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { getViews } from '@/lib/graph_queries/getViews';

// type ViewsPost = {
//   id: number;
//   title: string;
//   slug: string;
//   featuredImage: string;
//   date: string;
//   author_name: string;
// };

const fetcher = (period: 'week' | 'month') => getViews(period);

export default function ViewedPosts() {
  const [period, setPeriod] = React.useState<'week' | 'month'>('week');

  // SWR automatically caches per period
  const { data: posts = [], isLoading, error } = useSWR(period, fetcher);

  return (
    <div>
      <div className="mb-6 w-full grid grid-cols-2 gap-4 lg:flex lg:space-x-4 lg:gap-0 lg:justify-between">
        {(['week', 'month'] as const).map((p) => (
          <Button
            key={p}
            onClick={() => setPeriod(p)}
            className={`rounded-lg px-4 py-2 font-medium transition cursor-pointer flex-1 
              ${
                period === p
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
          >
            Last {p}
          </Button>
        ))}
      </div>

      {/* loading & empty states */}
      {isLoading && (
        <div className="mx-auto w-full max-w-sm rounded-md p-4">
          <div className="flex animate-pulse space-x-4">
            <div className="size-10 rounded-full bg-gray-200"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 rounded bg-gray-200"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2 h-2 rounded bg-gray-200"></div>
                  <div className="col-span-1 h-2 rounded bg-gray-200"></div>
                </div>
                <div className="h-2 rounded bg-gray-200"></div>
              </div>
            </div>
          </div>
        </div>
      )}
      {error && <div>Failed to load posts!</div>}
      {!isLoading && posts.length === 0 && !error && (
        <div>There is no fun posts to read!</div>
      )}

      {/* list */}
      {!isLoading && posts.length > 0 && (
        <ul className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
          {posts.map((post) => {
            const formattedDate = new Date(post.date).toLocaleDateString(
              'en-US',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              },
            );

            return (
              <li key={post.id} className="rounded-2xl">
                <Link href={post?.slug}>
                  <div className="relative overflow-hidden rounded-tl-2xl rounded-tr-2xl rounded-br-2xl">
                    <Image
                      src={post.featuredImage || ''}
                      width={300}
                      height={200}
                      alt={post.title}
                      className="object-cover w-full h-full"
                    />
                    <span className="absolute bottom-0 left-0 bg-black bg-opacity-70 text-white text-xs font-medium px-2 py-1 rounded-tr-lg rounded-tl-none rounded-br-none rounded-bl-none">
                      Nyheter
                    </span>
                  </div>
                </Link>

                <h3 className="mt-4 text-lg font-semibold">
                  <Link href={post.slug}>
                    <p className="hover:underline">{post.title}</p>
                  </Link>
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {post.author_name} — {formattedDate}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
