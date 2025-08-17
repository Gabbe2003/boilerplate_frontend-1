import Image from "next/image";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import Link from "next/link";
import type { AuthorNode, Post, ITOCItem } from "@/lib/types";
import { stripHtml } from "@/lib/helper_functions/strip_html";
import ShareButtonsClient from "../wrapper/ShareButtons.wrapper";
import { Sidebar } from "../../components/Main-page/SideBar";
import { PostTOC } from "../wrapper/TOCWrapper";
import he from "he";

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

// --- helper (inline) ---
function cleanExcerpt(raw?: string) {
  if (!raw) return "";
  const decoded = he.decode(raw);
  return decoded
    .replace(/\[\s*(?:&hellip;|…|\.{3})\s*\]/gi, "")
    .replace(/\s*(?:&hellip;|…)\s*$/i, "")
    .trim();
}

export function ArticleContent({
  post,
  postUrl,
  postExcerpt,
  aboveImageRef,
  index,
  categoryNames,
  tagNames,
}: {
  post: Post & { updatedHtml: string; toc: ITOCItem[] };
  postUrl: string;
  postExcerpt: string;
  aboveImageRef?: React.Ref<HTMLDivElement>;
  index: number;
  categoryNames?: string[];
  tagNames?: string[];
}) {
  // Optional debug
  if (process.env.NODE_ENV !== "production") {
    console.log("ArticleContent categories:", categoryNames ?? []);
    console.log("ArticleContent tags:", tagNames ?? []);
  }

  return (
    <article className="max-w-7xl mx-auto px-4 md:px-8 py-8 mb-10 w-full ">
      {/* Title, Excerpt, Author+Share */}
      <div ref={aboveImageRef ?? undefined} className="mb-2">
        {index === 0 ? (
          <h1 className="text-3xl md:text-4xl font-bold text-start mb-1 mt-[0]">
            {post.title}
          </h1>
        ) : (
          <h2 className="text-3xl md:text-4xl font-bold text-start mb-1">
            {post.title}
          </h2>
        )}

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-muted-foreground leading-snug mb-2">
            {cleanExcerpt(stripHtml(post.excerpt))}
          </p>
        )}

{/* Categories & Tags chips */}
{categoryNames?.length ? (
  <div>
    <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-1">
      Categories
    </h4>
    <div className="flex flex-wrap gap-2">
      {categoryNames.map((name, i) => (
        <Link
          key={`${name}-${i}`}
          href={`/category/${encodeURIComponent(name.toLowerCase())}`}
          className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium hover:underline hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input"
        >
          {name}
        </Link>
      ))}
    </div>
  </div>
) : null}

{tagNames?.length ? (
  <div className="mt-2">
    <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-1">
      Tags
    </h4>
    <div className="flex flex-wrap gap-2">
      {tagNames.map((name, i) => (
        <Link
          key={`${name}-${i}`}
          href={`/tag/${encodeURIComponent(name.toLowerCase())}`}
          className="inline-flex items-center rounded-full border bg-background/80 px-3 py-1 text-xs font-medium hover:underline hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input"
        >
          #{name}
        </Link>
      ))}
    </div>
  </div>
) : null}



        <div className="flex flex-col sm:flex-row sm:flex-nowrap items-start sm:items-center justify-center sm:justify-between gap-3 mt-3 mb-1 min-w-0">
          <span className="text-sm flex items-center gap-2 text-center sm:text-left min-w-0">
            <AuthorInfo author={post.author} />
            By
            <Link
              href={`/author/${post.author?.node.name || "admin"}`}
              className="text-blue-700"
            >
              <strong>{post.author?.node.name || "Admin"}</strong>
            </Link>
          </span>
          <ShareButtonsClient
            postUrl={postUrl}
            postTitle={post.title}
            postExcerpt={postExcerpt}
          />
        </div>
      </div>

      {/* Featured Image */}
      {post.featuredImage?.node.sourceUrl && (
        <div className="w-full mb-3">
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || ""}
            className="rounded-sm shadow-sm w-full h-auto object-cover"
            width={750}
            height={500}
            priority={index === 0}
            sizes="(max-width: 768px) 100vw, 750px"
          />
        </div>
      )}

      {/* Breadcrumbs + Published Date Row */}
      <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 text-sm text-muted-foreground my-2">
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
          Published:{" "}
          <time dateTime={post.date}>
            {new Date(post.date).toISOString().slice(0, 10)}
          </time>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
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

        <aside className="hidden lg:block space-y-0 lg:col-span-1 bg-[var(--secBG)] px-0 sm:px-2">
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
}
