
import React from "react";
import Link from "next/link";
import Image from "next/image";
import {AdCard} from "../[slug]/components/adcard";
import { ADS } from "../[slug]/components/adsSideBar";
import {get_popular_post} from "../../lib/graph_queries/getPopularPost"

import FEATURED_IMAGE from "../../../public/next.svg"
export default async function PopularPost(){
  const post = await get_popular_post(); 
  console.log('post', post);
  
    
  return (
  <>
    <div className="flex gap-10 mt-3 items-center justify-center">
      {post.map((item, index) => {
        const safeDate = item.date.replace('+00:00', 'Z'); // replace with 'Z' for UTC
        const formattedDate = new Date(safeDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return (
          <React.Fragment key={item.id ?? index}>
            {index === 2 && 
                <div className="w-full">
                    <AdCard ad={ADS[index]} />
                </div>
            }
            <div>
              <Link href={`${item.slug}`}>
                <Image
                  src={
                    typeof item.featuredImage === "string"
                    ? item.featuredImage
                    : item.featuredImage?.node?.sourceUrl || FEATURED_IMAGE // fallback image
                  }
                  width={100}
                  height={70}
                  alt={item.title}
                  className="object-cover rounded"
                  style={{ width: '100px', height: '70px' }}
                />
                <h4>{item.title}</h4>
                <p>{formattedDate}</p>
              </Link>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  </>
);

}