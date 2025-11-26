import { Post } from "@/lib/types";
import PostSocialMedia from "./PostSocialMedia";
import AuthorInfo from "./AuthorInfo";
import Image from "next/image"
import { decodeHTML, stripHtml } from "@/lib/globals/actions";

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
  console.log(featured);

  return (
    <header className="w-full mb-6 md:mb-8 ">
      <div className="mb-8">
        {!boolInfinite ? (
          <h1 className="text-pretty text-2xl md:text-4xl mt-5 font-bold leading-tight">
            {title}
          </h1>
        ) :
          <h2 className="text-pretty text-2xl md:text-5xl font-bold leading-tight mt-30">
            {title}
          </h2>
        }
      </div>

     <div className="mb-10">
       {featured?.node?.sourceUrl && (
        <figure className="mb-6 w-full flex flex-col ">
          <div className="w-full relative h-30 md:h-96 lg:h-[500px] max-w-4xl">
            <Image
              overrideSrc={featured.node?.sourceUrl}
              src={featured.node?.sourceUrl}
              alt={featured?.node?.altText || ""}
              fill
            />
          </div>
           <span>
             {featured.node?.caption && (
              <figcaption className="text-xs mt-2">
                {decodeHTML(stripHtml((featured.node?.caption)))}
              </figcaption>
            )}
           </span>
        </figure>
      )}
     </div>

      <div className="mt-4 grid w-full gap-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            {author && <AuthorInfo author={author} />}
          </div>
          <div className="text-xs">
            <div>
              Publicerad:{" "}
              {date && (
                <time dateTime={date}>
                  {new Date(date).toISOString().slice(0, 10)}
                </time>
              )}
            </div>
            <div>
              Modiferad:{" "}
              {modified && (
                <time dateTime={modified}>
                  {new Date(modified).toISOString().slice(0, 10)}
                </time>
              )}

            </div>
          </div>
        </div>

        <div className="text-base border-t border-gray-400">
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