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
  <div className="block lg:hidden">
    <Carousel
      opts={{ align: "start", skipSnaps: true, loop: false }}
      className="w-full"
    >
      {/* Track + fade wrapper */}
      <div className="relative">
        <CarouselContent className="-ml-4">
          {posts.map((post) => (
            <CarouselItem
              key={post.id}
              className="pl-4 basis-[85%] xs:basis-[80%] sm:basis-[75%]"
            >
              <Link
                href={`/${post.slug}`}
                className="group flex flex-col items-start gap-2"
              >
                {post.featuredImage?.node?.sourceUrl && (
                  <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md shadow-sm">
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title || "Post image"}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 85vw, 50vw"
                    />
                  </div>
                )}
                <p className="w-full text-sm font-medium text-gray-800 group-hover:underline line-clamp-2">
                  {post.title}
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Right edge fade (only over the track) */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-8 z-10"
          style={{
            background:
              "linear-gradient(to left, rgba(246,228,211,0.95), rgba(246,228,211,0))",
          }}
        />
      </div>

      {/* Arrows UNDER the posts */}
      <div className="mt-4 pt-6 flex w-full items-center justify-center ">
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
};