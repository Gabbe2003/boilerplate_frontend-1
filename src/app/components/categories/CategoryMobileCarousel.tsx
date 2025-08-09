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

export default function CategoryMobileCarousel({ posts }: Props) {
  if (!posts?.length) return null;

  return (
    <div className="relative block lg:hidden">
      <Carousel
        opts={{ align: "start", skipSnaps: true, loop: false }}
        className="w-full"
      >
        {/* Track */}
        <CarouselContent className="-ml-3">
          {posts.map((post) => (
            // Each slide
            <CarouselItem
              key={post.id}
              className="pl-3 basis-[80%] xs:basis-[80%] sm:basis-[50%]"
            >
              <Link
                href={`/${post.slug}`}
                className="group flex flex-col items-start gap-2"
              >
                {post.featuredImage?.node?.sourceUrl && (
                  <div className="relative w-full aspect-[16/9] overflow-hidden rounded-sm">
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title || "Post image"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 85vw, 50vw"
                      priority={false}
                    />
                  </div>
                )}

                <p className="w-full text-xs font-medium text-gray-800 group-hover:underline truncate">
                  {post.title}
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Arrows under the track */}
        <div className="flex justify-between mt-3 px-1">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>

      {/* Subtle right edge fade */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10"
        style={{
          background:
            "linear-gradient(to left, rgba(246,228,211,0.95), rgba(246,228,211,0))",
        }}
      />
    </div>
  );
}
