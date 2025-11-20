// PostBodyShell.tsx
import Image from "next/image";
import type { Post } from "@/lib/types";

type FeaturedNode = NonNullable<Post["featuredImage"]>["node"];

export default function PostBodyShell({
  children,
  featured,
}: {
  children: React.ReactNode;
  featured?: FeaturedNode | null;
}) {
    
  return (
    <article className="w-full">

      {featured?.node?.sourceUrl && (
        <figure className="mb-6 w-full flex justify-center">
          <div className="relative w-[50%] aspect-[3/1.49] overflow-hidden">
            <Image
              overrideSrc={featured?.node?.sourceUrl}
              src={featured?.node?.sourceUrl}
              alt={featured?.node?.altText || ""}
              fill
              sizes="40vw"
            />
          </div>
        </figure>
      )}

      {/* Shared prose styling */}
      <div
        className="
          prose prose-neutral dark:prose-invert
          break-words
          [&_pre]:break-all
          [&_pre]:whitespace-pre-wrap
          [&_pre]:overflow-x-auto
          [&_code]:break-all
          prose-sm
          w-[80%]

          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-a:no-underline hover:prose-a:underline
          prose-a:visited:text-blue-700 dark:prose-a:visited:text-blue-500

          [&_h2]:mb-3
          [&_h2]:mt-7
          [&_h3]:mb-3
          [&_h3]:mt-7
          [&_h4]:mt-4
        "
      >
        {children}
      </div>

    </article>
  );
}
