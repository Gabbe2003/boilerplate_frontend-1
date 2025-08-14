
import Image from 'next/image';
import { Post } from '@/lib/types';
import Link from 'next/link';

interface Props {
  posts: Post[];
}

export default function CategoryDesktopGrid({ posts }: Props) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      {posts.map((post) => (
        <Link key={post.id} href={`/${post.slug}`} className="group flex flex-col gap-2">
          {post.featuredImage?.node?.sourceUrl && (
            <div className="relative w-full h-[160px] overflow-hidden">
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || post.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-gray-800">
              {post.title}
            </p>
            {post.excerpt && (
              <p className="text-xs text-gray-600 leading-snug line-clamp-2">
                {post.excerpt.replace(/<[^>]+>/g, '')}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
