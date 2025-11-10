import { Post } from "@/lib/types";
import PostSocialMedia from "./PostSocialMedia";
import AuthorInfo from "./AuthorInfo";


interface PostHeroProps {
  title?: Post['title'];
  author?: Post['author'];
  date?: Post['date'];
  excerpt?: Post['excerpt'];
  uri?: Post['uri'];
  boolInfinite?: boolean;
}

export default function PostHero({
  title,
  author,
  date,
  excerpt,
  uri,
  boolInfinite = false
}: PostHeroProps) {
    
    return(
      <header className="w-full mb-6 md:mb-8">
        {!boolInfinite ? (
          <h1 className="text-pretty text-3xl md:text-4xl font-bold leading-tight">
            {title}
          </h1>
        ): 
          <h2 className="text-pretty text-3xl md:text-4xl font-bold leading-tight">
            {title}
          </h2>
        }
        <div className="mt-4 grid w-full gap-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              {author && <AuthorInfo author={author} />}
            </div>

            <PostSocialMedia
              postUrl={uri || ""}
              postTitle={title || ""}
              postExcerpt={excerpt || ""}
            />
          </div>

          <div className="text-sm text-gray-600">
            Publicerad:{" "}
            {date && (
              <time dateTime={date}>
                {new Date(date).toISOString().slice(0, 10)}
              </time>
            )}
          </div>
        </div>
    </header>
    )
}