// import React from 'react';
// import Link from 'next/link';
// import Image from 'next/image';
// import { AdCard } from '../[slug]/components/adcard';
// import { ADS } from '../[slug]/components/adsSideBar';
// import { get_popular_post } from '../../lib/graph_queries/getPopularPost';
// import FEATURED_IMAGE from '../../../public/next.svg';

// export default async function PopularPost() {
//   const post = await get_popular_post();

//   return (
//     <div className="w-full max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4 items-start bg-amber-900/5 p-4 rounded-lg">
//       {post.map((item, index) => {
//         const safeDate = item.date.replace('+00:00', 'Z');
//         const formattedDate = new Date(safeDate).toLocaleDateString('en-US', {
//           year: 'numeric',
//           month: 'short',
//           day: 'numeric',
//         });

//         // Insert AdCard at position 2, spanning the grid width
//         if (index === 2) {
//           return (
//             <React.Fragment key={'adcard'}>
//               <div className="col-span-full w-full my-2">
//                 <AdCard ad={ADS[index]} />
//               </div>
//               <PostCardItem item={item} formattedDate={formattedDate} />
//             </React.Fragment>
//           );
//         }

//         return (
//           <PostCardItem key={item.id ?? index} item={item} formattedDate={formattedDate} />
//         );
//       })}
//     </div>
//   );
// }

// // Card for each post
// function PostCardItem({ item, formattedDate }) {
//   return (
//     <div className="flex flex-col bg-[#FFF8F2] shadow rounded-lg w-full h-full overflow-hidden">
//       <Link href={`/${item.slug}`} className="flex flex-col h-full">
//         <div className="relative w-full aspect-[16/9] bg-amber-100">
//           <Image
//             src={
//               typeof item.featuredImage === 'string'
//                 ? item.featuredImage
//                 : item.featuredImage?.node?.sourceUrl || FEATURED_IMAGE
//             }
//             alt={item.title}
//             fill
//             className="object-cover w-full h-full"
//             sizes="(max-width: 768px) 100vw, 33vw"
//             priority={false}
//           />
//           <div className='bg-amber-900'> test test</div>
//         </div>
//         <div className="flex-1 flex flex-col justify-between px-3 py-2">
//           <h1 className="text-base font-semibold text-black mt-1 truncate">
//             {item.title}
//           </h1>
//           <p className="text-xs text-gray-500 mt-1">{formattedDate}</p>
//         </div>
//       </Link>
//     </div>
//   );
// }
