import Image from "next/image";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import Link from "next/link";
import type { Post } from "@/lib/types";
import type { TOCItem } from "../page";
import ShareButtons from "./shareButtons";

// Utility: strip HTML tags for excerpts
function stripHtml(html: string) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

type AuthorNode = {
  id: string;
  name: string;
  slug?: string;
  uri?: string;
  avatar?: {
    url: string;
    width?: number;
    height?: number;
  };
};

// AuthorInfo: used only in this file
function AuthorInfo({ author }: { author?: { node: AuthorNode } }) {
  if (!author) return null;

  if (author.node.avatar?.url) {
    return (
      <Image
        src={author.node.avatar.url}
        alt={author.node.name || "Author"}
        width={28}
        height={28}
        className="rounded-full object-cover border border-gray-200"
      />
    );
  }
  return (
    <span
      className="inline-flex items-center justify-center rounded-full bg-gray-300 text-gray-600 font-semibold border border-gray-200"
      style={{ width: 28, height: 28, fontSize: "1rem", userSelect: "none" }}
      aria-label="Author initial"
    >
      {author.node.name ? author.node.name[0].toUpperCase() : "A"}
    </span>
  );
}


export default function PostMain({
  post,
  postUrl,
  postExcerpt,
  aboveImageRef,
}: {
  post: Post & { updatedHtml: string; toc: TOCItem[] };
  postUrl: string;
  postExcerpt: string;
aboveImageRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <article className="lg:col-span-2 flex flex-col">
      {/* Title, Excerpt, Author+Share */}
      <div ref={aboveImageRef ?? undefined} className="mb-2">
        <h1 className="text-3xl md:text-4xl font-bold text-start mb-1">{post.title}</h1>
        {post.excerpt && (
          <p className="text-lg text-muted-foreground leading-snug mb-1">
            {stripHtml(post.excerpt)}
          </p>
        )}

        <div className="flex items-center justify-between mt-5 mb-1">
          <span className="text-sm flex items-center gap-2">
            <AuthorInfo author={post.author} />
            By <strong>{post.author?.node.name || "Admin"}</strong>
          </span>
          <ShareButtons postUrl={postUrl} postTitle={post.title} postExcerpt={postExcerpt} />
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage?.node.sourceUrl && (
        <Image
          src={post.featuredImage.node.sourceUrl}
          alt={post.featuredImage.node.altText || ""}
          className="rounded-sm shadow-sm w-full mb-6"
          width={750}
          height={500}
          priority
        />
      )}

      {/* Breadcrumbs + Published Date Row */}
      <div className="flex flex-wrap items-center justify-between gap-y-2 text-sm text-muted-foreground my-3">
        <Breadcrumb>
          <BreadcrumbItem>
            <Link href="/" className="text-blue-700">
              {process.env.NEXT_PUBLIC_HOSTNAME || "Home"}
            </Link>
            <span className="mx-1">/</span>
          </BreadcrumbItem>
          <BreadcrumbItem>{post.title}</BreadcrumbItem>
        </Breadcrumb>
        <span>
          Published: <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
        </span>
      </div>

      {/* Post Content */}
      <section
        className="max-w-none"
        dangerouslySetInnerHTML={{ __html: post.updatedHtml }}
      />
    </article>
  );
}
