import { MediaItemNode } from '@/lib/types';
import Image from 'next/image';
import FEATURED_IMAGE from '../../../public/next.svg';

export interface ViewPost {
  id: string;
  title: string;
  slug: string;
  featuredImage?: { node: MediaItemNode }
  date: string;
  author_name: string;
  excerpt?: string;
}

export interface PostCardProps {
  post: ViewPost;
  className?: string;
}

function getExcerpt(text?: string, words = 15) {
  if (!text) return '';
  const arr = text.split(/\s+/);
  return arr.length > words ? arr.slice(0, words).join(' ') + '…' : text;
}

export function PostCard({ post, className = '' }: PostCardProps) {
 const featuredImageUrl = post.featuredImage?.node?.sourceUrl ?? FEATURED_IMAGE;


  return (
    <div className={`flex flex-col shadow bg-[#FFF8F2] w-full overflow-hidden ${className}`}>
      {/* Image fills the top of the card */}
      <div className="relative w-full h-[180px] overflow-hidden transition-transform duration-200 ease-in-out hover:scale-105">
        <Image
        src={featuredImageUrl}
        alt={post.title}
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        quality={100}
        className="object-cover w-full h-full"
        priority={true}
      />
      </div>
      {/* Content gets the padding */}
      <div className="p-4">
        <p className="font-semibold text-base text-gray-900 mb-2 leading-tight ">
          {post.title}
        </p>
        {post.excerpt && (
          <p className="text-sm text-gray-700 leading-snug mb-1 break-words">
            {getExcerpt(post.excerpt, 14)}
          </p>
        )}
      </div>
    </div>
  );
}