// PostBodyShell.tsx
import type { Post } from "@/lib/types";

type FeaturedNode = NonNullable<Post["featuredImage"]>["node"];

export default function PostBodyShell({
  children,
}: {
  children: React.ReactNode;
  featured?: FeaturedNode | null;
}) {
  return (
    <article className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-10">
      <div
        className="
          prose prose-lg sm:prose-xl prose-neutral dark:prose-invert
          break-words
          [&_pre]:break-all
          [&_pre]:whitespace-pre-wrap
          [&_pre]:overflow-x-auto
          [&_code]:break-all
          w-full sm:w-[75%] lg:w-[65%]

          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-a:no-underline hover:prose-a:underline
          prose-a:visited:text-blue-700 dark:prose-a:visited:text-blue-500

          [&_h2]:mt-10 [&_h2]:mb-4
          [&_h3]:mt-8 [&_h3]:mb-3
          [&_h4]:mt-6 [&_h4]:mb-2

          [&_p]:text-base
          [&_p]:leading-relaxed
          [&_p]:mb-5
        "
      >
        {children}
      </div>
    </article>
  );
}
