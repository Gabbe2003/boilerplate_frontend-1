import Image from 'next/image';

export interface ViewPost {
  id: number;
  title: string;
  slug: string;
  featuredImage: string;
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
  console.log(post);
  // No more "node"
  const featuredImageUrl = post.featuredImage || '/no-image.png';

  return (
    <div className={`flex flex-col p-4 shadow ${className}`}>
      <div className="relative w-full h-[140px] mb-4">
        <Image
          src={featuredImageUrl}
          alt={post.title}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority={false}
        />
      </div>
      {/* Title */}
      <p className="font-semibold text-base text-gray-900 mb-2 leading-tight">
        {post.title}
      </p>
      <p>test</p>
      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-sm text-gray-700 leading-snug mb-1">
          {getExcerpt(post.excerpt, 20)}
        </p>
      )}
    </div>
  );
}
