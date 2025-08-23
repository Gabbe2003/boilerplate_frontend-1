import { MediaItemNode } from '@/lib/types';
import Image from 'next/image';

export interface ViewPost {
  id: string;
  title: string;
  slug: string;
  featuredImage?: { node: MediaItemNode };
  date: string;
  excerpt?: string;
  category?: string;
}

export interface PostCardProps {
  post: ViewPost & {
    categories?: string[] | { nodes?: Array<{ name?: string }> } | string;
  };
  className?: string;
}

function getExcerpt(text?: string, words = 10) {
  if (!text) return '';
  const arr = text.split(/\s+/);
  return arr.length > words ? arr.slice(0, words).join(' ') + '…' : text;
}

function getFirstCategory(post: PostCardProps['post']): string | undefined {
  if (typeof post.category === 'string' && post.category.trim()) {
    return post.category.trim();
  }
  const cats = post.categories as unknown;

  if (Array.isArray(cats)) {
    const first = cats.find((c) => typeof c === 'string' && c.trim());
    return first?.trim();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (cats && typeof cats === 'object' && 'nodes' in (cats as any)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodes = (cats as any).nodes as Array<{ name?: string }>;
    const first = nodes?.find((n) => typeof n?.name === 'string' && n.name.trim())?.name;
    return first?.trim();
  }

  if (typeof cats === 'string' && cats.trim()) {
    return cats.trim();
  }

  return undefined;
}

export function PostCard({ post, className = '' }: PostCardProps) {
  const featuredImageUrl = post.featuredImage?.node?.sourceUrl ?? '';
  const firstCategory = getFirstCategory(post);

  return (
    <div className={`flex flex-col w-full overflow-hidden ${className}`}>
      {/* Image */}
      <div className="relative w-full h-[180px] overflow-hidden transition-transform duration-200 ease-in-out hover:scale-105">
        {featuredImageUrl && (
          <Image
            src={featuredImageUrl}
            alt={post.title}
            fill
            quality={100}
            className="object-cover w-full h-full"
            priority={true}
          />
        )}
      </div>

      {/* Content */}
      <div className="pt-0">
        {/* Category */}
        {firstCategory && (
          <span className="inline-block text-xl text-[11px] font-semibold uppercase tracking-wide text-[#990000]">
            {firstCategory}
          </span>
        )}

        {/* Title */}
        <p className="font-semibold text-lg text-gray-800 leading-snug">
          {post.title}
        </p>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-base text-gray-800 leading-snug break-words">
            {getExcerpt(post.excerpt, 10)}
          </p>
        )}
      </div>
    </div>
  );
}
