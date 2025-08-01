'use client';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

const RecommendationList = dynamic(() => import('./RecommendationList'), {
  ssr: false,
});

export default function EndOfPageRecommendations({
  currentSlug,
}: {
  currentSlug: string;
}) {
  return (
    <Card
      className={clsx(
        'border border-neutral-100 shadow-sm transition-all duration-500 bg-white/90 overflow-hidden',
        'rounded',
      )}
    >
      <CardContent className="p-0">
        <div id="recommendation-list">
          <RecommendationList currentSlug={currentSlug}>
            {(recommendations) => {
              const postsToShow = recommendations.slice(0, 6);
              return (
                <>
                  {/* --- Header text --- */}
                  <p className="px-4 pt-4 pb-2 text-sm font-semibold text-blue-800 tracking-tight">
                    Others read
                  </p>
                  <ul
                    className="
                      grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
                      gap-2
                      px-2 py-3
                    "
                  >
                    {postsToShow.map((post) => (
                      <li key={post.slug} className="h-full">
                        <Link
                          href={`/${post.slug}`}
                          className="group flex flex-col h-full overflow-hidden border border-neutral-200 bg-[#fafafa] shadow hover:shadow-lg transition-all hover:border-blue-300 relative focus-visible:ring-2 focus-visible:ring-blue-300 rounded"
                        >
                          {post.featuredImage?.node.sourceUrl && (
                            <div className="relative w-full aspect-[6/3] overflow-hidden rounded-t">
                              <Image
                                src={post.featuredImage.node.sourceUrl}
                                alt={post.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="160px"
                                style={{ minHeight: 72, borderRadius: 0 }}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa]/60 via-[#fafafa]/5 to-transparent" />
                            </div>
                          )}
                          {post.categories?.nodes?.[0]?.name && (
                            <span className="absolute left-3 top-3 z-20 bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-sm font-medium shadow-sm">
                              {post.categories.nodes[0].name}
                            </span>
                          )}
                          <div className="px-3 py-2 relative z-10 flex-1 flex flex-col justify-between">
                            <h4 className="font-semibold text-sm mb-0.5 group-hover:text-blue-700 transition truncate">
                              {post.title}
                            </h4>
                            <div className="text-[11px] text-neutral-600 truncate">
                              By {post.author?.node.name || 'Admin'} ·{' '}
                              {new Date(post.date).toLocaleDateString('sv-SE', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                              })}
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              );
            }}
          </RecommendationList>
        </div>
      </CardContent>
    </Card>
  );
}
