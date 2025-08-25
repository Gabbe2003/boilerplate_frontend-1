import Image from "next/image";
import { Breadcrumb, BreadcrumbItem } from "@/components/ui/breadcrumb";
import Link from "next/link";
import type { AuthorNode, Post, ITOCItem } from "@/lib/types";
import ShareButtonsClient from "../wrapper/ShareButtons.wrapper";
import { PostTOC } from "../wrapper/TOCWrapper";
import { Sidebar } from "@/app/components/Main-page/SideBar";

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


return (
  <article className="w-full mx-auto mb-10 px-2 md:px-8 md:max-w-7xl">
    {/* Title */}
    <div ref={aboveImageRef ?? undefined} className="mb-2">
      {index === 0 ? (
        <h1 className="text-3xl md:text-4xl font-bold text-center lg:text-start mb-1 mt-[0]">
          {post.title}
        </h1>
      ) : (
        <h2 className="text-3xl md:text-4xl font-bold text-center lg:text-start mb-1">
          {post.title}
        </h2>
      )}
    </div>

    {/* Breadcrumbs + Share in one row */}
    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-2 text-sm text-muted-foreground ">
      <Breadcrumb>
        <BreadcrumbItem>
          <Link href="/" className="text-gray-700 underline px-4 lg:px-0">
            {process.env.NEXT_PUBLIC_HOSTNAME || "Home"}
          </Link>
          <span className="mx-1">/</span>
        </BreadcrumbItem>
        <BreadcrumbItem>{post.title}</BreadcrumbItem>
      </Breadcrumb>
      <div className="shrink-0">
        <ShareButtonsClient
          postUrl={postUrl}
          postTitle={post.title}
          postExcerpt={postExcerpt}
        />
      </div>
    </div>

    {/* Featured Image */}
    {post.featuredImage?.node.sourceUrl && (
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] mr-[50vw] mb-3 md:ml-0 md:mr-0 md:w-full md:relative md:left-0 md:right-0">
        <div className="relative w-full aspect-[3/2] rounded-none md:rounded-sm shadow-sm overflow-hidden">
          <Image
            src={post.featuredImage.node.sourceUrl}
            alt={post.featuredImage.node.altText || ""}
            fill
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover"
            quality={85}
            priority={index === 0}
            fetchPriority={index === 0 ? "high" : "auto"}
            loading={index === 0 ? "eager" : "lazy"}
            placeholder={index === 0 ? "empty" : "blur"}
            blurDataURL={
              index === 0
                ? undefined
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                : (post as any)?.featuredImage?.node?.blurDataURL || "/favicon_logo.png"
            }
          />
        </div>
      </div>
    )}

    {/* Main content + sidebar */}
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:items-start">
      {/* MAIN COLUMN */}
      <section className="lg:col-span-3 max-w-full w-full space-y-4">
        {/* Author block */}
        <div className="flex items-start gap-3 mt-3 mb-2">
          <AuthorInfo author={post.author} />
          <div
            className={`
              min-w-0
              w-full
              sm:max-w-full
              md:max-w-[75%]
              lg:max-w-[70%]
              overflow-hidden
            `}
          >
            <div className="text-sm">
              By{" "}
              <Link
                href={`/author/${post.author?.node.name || "admin"}`}
                className="text-gray-700 underline"
              >
                <strong>{post.author?.node.name || "Admin"}</strong>
              </Link>
            </div>
            <div
              className="prose prose-sm prose-neutral dark:prose-invert mt-1 max-w-full"
              dangerouslySetInnerHTML={{
                __html:
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ((post.author as any)?.node?.description as string) || "",
              }}
            />
          </div>
        </div>

        {/* Published date */}
        <div className="text-sm text-muted-foreground my-2 text-gray-950 px-10">
          Published:{" "}
          <time dateTime={post.date}>
            {new Date(post.date).toISOString().slice(0, 10)}
          </time>
        </div>

        {/* Categories & Tags */}
        {(categoryNames?.length || tagNames?.length) ? (
          <div className="space-y-3">
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
                      className="inline-flex items-center rounded-sm border bg-background/80 px-3 py-1 text-xs font-medium hover:underline hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input"
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            {tagNames?.length ? (
              <div>
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
          </div>
        ) : null}

        {/* Article body */}
        <div
          className="
            prose prose-neutral dark:prose-invert
            break-words
            [&_pre]:break-all
            [&_pre]:whitespace-pre-wrap
            [&_pre]:overflow-x-auto
            [&_code]:break-all
            prose-sm
          "
          dangerouslySetInnerHTML={{ __html: post.updatedHtml }}
        />
      </section>

      {/* SIDEBAR */}
      <aside className="hidden lg:block lg:col-span-1 self-start space-y-4 bg-[var(--secBG)] px-0 sm:px-2">
        <PostTOC toc={post.toc} />
        <Sidebar />
      </aside>
    </div>
  </article>
  );
};
