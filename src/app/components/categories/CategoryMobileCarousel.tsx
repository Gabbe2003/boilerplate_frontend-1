
import Image from 'next/image';
import { Post } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';
import Link from 'next/link';

interface Props {
  posts: Post[];
}

export default function CategoryMobileCarousel({ posts }: Props) {
  if (!posts || posts.length === 0) return null;

  return (
    <div className="relative block lg:hidden">
      <Carousel
        opts={{
          align: 'start',
          skipSnaps: true,
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent
          className="carousel-item w-[10vw] min-w-[70px] max-w-[90px] flex-shrink-0 snap-start"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {posts.map((post, idx) => (
            <CarouselItem
              key={post.id}
              className="carousel-item w-[80vw] min-w-[350px] max-w-[90px] snap-start flex-shrink-0"
              style={{
                marginRight: idx === posts.length - 1 ? 0 : undefined,
              }}
            >
              <Link href={`/${post.slug}`} className="group flex flex-col items-center gap-1">
                {post.featuredImage?.node?.sourceUrl && (
                  <div className="relative w-full h-[160px] overflow-hidden rounded-sm">
                    <Image
                      src={post.featuredImage.node.sourceUrl}
                      alt={post.featuredImage.node.altText || post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <p className="text-xs font-medium group-hover:underline text-gray-800 truncate w-full text-start mt-2">
                  {post.title}
                </p>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-between mt-4 px-2">
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </Carousel>
      {/* Edge blur effect */}
      <div
        className="pointer-events-none absolute top-0 right-0 h-full w-8 z-10"
        style={{
          background: 'linear-gradient(to left, rgba(255,255,255,0.95), rgba(255,255,255,0))',
        }}
      />
    </div>
  );
}
