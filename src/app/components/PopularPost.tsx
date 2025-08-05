import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdCard } from '../[slug]/components/adcard';
import { ADS } from '../[slug]/components/adsSideBar';
import { get_popular_post } from '../../lib/graph_queries/getPopularPost';
import FEATURED_IMAGE from '../../../public/next.svg';

export default async function PopularPost() {
  const post = await get_popular_post();

  return (
    <div className="w-[70%] mx-auto flex gap-4 mt-4 items-start justify-center bg-amber-900">
      {post.map((item, index) => {
        const safeDate = item.date.replace('+00:00', 'Z');
        const formattedDate = new Date(safeDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        return (
          <React.Fragment key={item.id ?? index}>
            {index === 2 && (
              <div className="w-full my-2">
                <AdCard ad={ADS[index]} />
              </div>
            )}
            <div className="flex flex-col items-center w-[120px]">
              <Link href={`${item.slug}`}>
                <Image
                  src={
                    typeof item.featuredImage === 'string'
                      ? item.featuredImage
                      : item.featuredImage?.node?.sourceUrl || FEATURED_IMAGE
                  }
                  width={80}
                  height={56}
                  alt={item.title}
                  className="object-cover rounded bg-amber-950"
                  style={{ width: '80px', height: '56px' }}
                />
                <h1 className="text-sm font-normal mt-2 text-black text-center truncate">
                  {item.title}
                </h1>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {formattedDate}
                </p>
              </Link>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
