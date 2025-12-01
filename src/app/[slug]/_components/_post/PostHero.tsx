import { Post } from "@/lib/types";
import PostSocialMedia from "./PostSocialMedia";
import AuthorInfo from "./AuthorInfo";
import Image from "next/image"
import { decodeHTML, formatDateStockholm, stripHtml } from "@/lib/globals/actions";

interface PostHeroProps {
  title?: Post['title'];
  author?: Post['author'];
  date?: Post['date'];
  excerpt?: Post['excerpt'];
  uri?: Post['uri'];
  featured?: Post['featuredImage']
  modified?: Post['modified'];
  boolInfinite?: boolean;
}

export default function PostHero({
  title,
  author,
  date,
  excerpt,
  uri,
  featured,
  modified,
  boolInfinite = false
}: PostHeroProps) {


  
  return (
    <header className="w-full mb-6 md:mb-8 ">
      <div className="mb-8 w-full flex justify-center">
        <div className="max-w-3xl text-center">
            {!boolInfinite ? (
          <h1 className="text-pretty text-1xl md:text-3xl mt-5 font-bold leading-tight text-center">
            {title}
          </h1>
        ) :
          <h2 className="text-pretty text-1xl md:text-3xl font-bold leading-tight mt-30">
            {title}
          </h2>
        }
        </div>
      </div>

      <div className="mb-10">
        {featured?.node?.sourceUrl && (
          <figure className="mb-6 w-full flex flex-col items-center">
            <div className="relative w-full max-w-3xl mx-auto aspect-[16/9] rounded-xs overflow-hidden bg-gray-100">
              <Image
                overrideSrc={featured.node?.sourceUrl}
                src={featured.node?.sourceUrl}
                alt={featured?.node?.altText || ""}
                fill
                className="object-contain md:object-cover"
                sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 80vw,
                 60vw"
              />
            </div>

            {/* Caption */}
            {featured.node?.caption && (
              <figcaption className="text-[9px] mt-2 text-start text-gray-600 left">
                {decodeHTML(stripHtml(featured.node?.caption))}
              </figcaption>
            )}

          </figure>
        )}
      </div>

      <div className="mt-4 grid w-full max-w-3xl mx-auto gap-3 ">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {author && <AuthorInfo author={author} />}
          </div>
          <div className="text-xs">
            <div>
              Publicerad:{" "}
              {date && (
                <time dateTime={date}>
                  {formatDateStockholm(date)}
                </time>
              )}
            </div>
            <div>
              Uppdaterad:{" "}
              {modified && (
                <time dateTime={modified}>
                  {formatDateStockholm(date)}
                </time>
              )}

            </div>
          </div>
        </div>

        <div className="text-base border-t post-border-theme">
          <PostSocialMedia
            postUrl={uri || ""}
            postTitle={title || ""}
            postExcerpt={excerpt || ""}
          />
        </div>
      </div>
    </header>
  )
}