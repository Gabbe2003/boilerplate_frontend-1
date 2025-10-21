import Image from "next/image";
import Link from "next/link";
import { Post } from "@/lib/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

interface Props {
  posts: Post[];
}

const FALLBACK_SRC = "/full_logo_with_slogan.png";

export default function CategoryMobileCarousel({ posts }: Props) {
  if (!posts?.length) return null;

  return (
    // Full width section with red background
    <div className="block lg:hidden w-screen relative left-1/2 right-1/2 -mx-[50vw]">
      <Carousel
        opts={{ align: "start", skipSnaps: true, loop: false }}
        className="w-full"
      >
        {/* Track + fade wrapper */}
        <div className="relative px-4 sm:px-6">
          <CarouselContent className="-ml-4">
            {posts.map((post) => {
              const img = post.featuredImage?.node?.sourceUrl;
              const alt =
                post.featuredImage?.node?.altText ||
                post.title ||
                "Post image";

              return (
                <CarouselItem
                  key={post.id}
                  className="pl-4 basis-full sm:basis-full"
                >
                  <Link
                    href={`/${post.slug}`}
                    className="group flex flex-col items-start gap-2"
                    prefetch={false}
                  >
                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md shadow-sm">
                      <Image
                        src={img || FALLBACK_SRC}
                        alt={alt}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="100vw"
                        onError={(e) => {
                          // This runs client-side only after hydration.
                          e.currentTarget.src = FALLBACK_SRC;
                        }}
                      />
                    </div>

                    <p className="w-full text-sm font-medium text-gray-800 group-hover:underline line-clamp-2">
                      {post.title}
                    </p>
                  </Link>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Right edge fade */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10"
            style={{
              background:
                "linear-gradient(to left, rgba(241,246,244,0.95) 35%, rgba(241,246,244,0) 100%)",
            }}
          />
        </div>

        {/* Arrows UNDER the posts */}
        <div className="mt-4 pt-6 flex w-full items-center justify-center">
          <CarouselPrevious
            aria-label="Previous"
            className="flex relative z-20 h-10 w-10 shrink-0 rounded-full bg-white shadow-md hover:bg-gray-100"
          />
          <CarouselNext
            aria-label="Next"
            className="flex relative z-20 h-10 w-10 shrink-0 rounded-full bg-white shadow-md hover:bg-gray-100"
          />
        </div>
      </Carousel>
    </div>
  );
}
