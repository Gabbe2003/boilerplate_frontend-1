'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import type { Post } from '@/lib/types';



export default function PostsList() {
  const { searchBarHeader, posts } = useAppContext();
const term = searchBarHeader.trim().toLowerCase();
const filtered = term
  ? posts.filter(p =>
      p.title.toLowerCase().includes(term)
    )
  : posts;

  if (filtered.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No posts found
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {filtered.map((post, index) => (
        <li
          key={post.id}
          className="
            rounded-2xl 
            bg-white 
            flex flex-col    /* ↑ ensure children stack */
          "
        >
          {post.featuredImage?.node?.sourceUrl && (
            <Link href={`/${post.slug}`}>
              <Image
                src={post.featuredImage.node.sourceUrl}
                alt={post.featuredImage.node.altText || post.title}
                width={1200}                      /* ↑ larger intrinsic size */
                height={700}                      /* ↑ larger intrinsic size */
                className="w-full h-90 object-cover rounded-xl mb-6" /* ↑ taller */
                priority={index < 3}
              />
            </Link>
          )}

          <h3 className="text-3xl font-semibold mb-4">{post.title}</h3>
          <div
            className="text-gray-700 mb-6 prose prose-base max-w-none" /* ↑ bigger prose */
            dangerouslySetInnerHTML={{ __html: post.excerpt || '' }}
          />
          <Link
            href={`/${post.slug}`}
            className="inline-block text-blue-600 text-lg font-medium hover:underline"
          >
            Read more →
          </Link>
        </li>
      ))}
    </ul>
  );
}
