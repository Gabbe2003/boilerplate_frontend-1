import Image from 'next/image';
import { Breadcrumb, BreadcrumbItem } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import type { AuthorNode, Post, ITOCItem } from '@/lib/types';
import { ShareButtons } from './shareButtons';
import { useEffect } from 'react';
import { update_viewed_post } from '@/lib/graph_queries/update_viewed_post';
import { stripHtml } from '@/lib/helper_functions/strip_html';
import { PostTOC } from './TOCContent';
import { Sidebar } from './sideBar';

function AuthorInfo({ author }: { author?: { node: AuthorNode } }) {
  if (!author) return null;

  if (author.node.avatar?.url) {
    return (
      <Image
        src={author.node.avatar.url}
        alt={author.node.name || 'Author'}
        width={28}
        height={28}
        className="rounded-full object-cover border border-gray-200"
      />
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-gray-300 text-gray-600 font-semibold border border-gray-200"
      style={{ width: 28, height: 28, fontSize: '1rem', userSelect: 'none' }}
      aria-label="Author initial"
    >
      {author.node.name ? author.node.name[0].toUpperCase() : 'A'}
    </span>
  );
}

export function ArticleWithContent({
  post,
  postUrl,
  postExcerpt,
  aboveImageRef,
  index,
}: {
  post: Post & { updatedHtml: string; toc: ITOCItem[] };
  postUrl: string;
  postExcerpt: string;
  aboveImageRef?: React.Ref<HTMLDivElement>;
  index: number;
}) {
  useEffect(() => {
    update_viewed_post(String(post.databaseId));
  }, [index]);

  return (
<article className="lg:col-span-2 flex flex-col px-4 sm:px-6 md:px-8">
  {/* Title, Excerpt, Author+Share */}
  <div ref={aboveImageRef ?? undefined} className="mb-2">
    {index === 0 ? (
      <h1 className="text-3xl md:text-4xl font-bold mb-1">{post.title}</h1>
    ) : (
      <h2 className="text-3xl md:text-4xl font-bold mb-1">{post.title}</h2>
    )}
    {post.excerpt && (
      <p className="text-lg text-muted-foreground leading-snug mb-1">{stripHtml(post.excerpt)}</p>
    )}

    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mt-1 mb-1">
      <span className="text-sm flex items-center gap-2">
        <AuthorInfo author={post.author} />
        By
        <Link href={`/author/${post.author?.node.name || 'admin'}`} className="text-blue-700">
          <strong>{post.author?.node.name || 'Admin'}</strong>
        </Link>
      </span>
      <ShareButtons postUrl={postUrl} postTitle={post.title} postExcerpt={postExcerpt} />
    </div>
  </div>

  {/* Featured Image */}
  {post.featuredImage?.node.sourceUrl && (
    <div className="w-full mb-3">
      <Image
        src={post.featuredImage.node.sourceUrl}
        alt={post.featuredImage.node.altText || ''}
        className="rounded-sm shadow-sm w-full h-auto object-cover"
        width={750}
        height={500}
        priority
        sizes="(max-width: 768px) 100vw, 750px"
      />
    </div>
  )}

  {/* Breadcrumbs + Published Date Row */}
  <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 text-sm text-muted-foreground my-2">
    <Breadcrumb>
      <BreadcrumbItem>
        <Link href="/" className="text-blue-700">
          {process.env.NEXT_PUBLIC_HOSTNAME || 'Home'}
        </Link>
        <span className="mx-1">/</span>
      </BreadcrumbItem>
      <BreadcrumbItem>{post.title}</BreadcrumbItem>
    </Breadcrumb>
    <span>
      Published:{' '}
      <time dateTime={post.date}>
        {new Date(post.date).toISOString().slice(0, 10)}
      </time>
    </span>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
    {/* Post Content */}
    <section
      className="
        max-w-full w-full
        lg:col-span-3
        prose prose-neutral dark:prose-invert
        break-words
        [&_pre]:break-all
        [&_pre]:whitespace-pre-wrap
        [&_pre]:overflow-x-auto
        [&_code]:break-all
        prose-sm
        pb-8
      "
      dangerouslySetInnerHTML={{ __html: post.updatedHtml }}
    />

    {/* Sidebar/Aside: Stacks below on mobile, right side on desktop */}
    <aside className="space-y-8 lg:col-span-1 mt-10 bg-[var(--secBG)] px-0 sm:px-2">
      <div
        style={{ height: 0, minHeight: 0 }}
        className="hidden lg:block"
        aria-hidden="true"
      />
      <PostTOC toc={post.toc} />
      <Sidebar />
    </aside>
  </div>
</article>

);
};

// #F1D7BB
// #fcf6f0