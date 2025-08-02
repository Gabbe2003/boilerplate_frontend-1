"use client";
import { useEffect, useState } from "react";
import BookMark from "./icons/bookmark";
import ImageWithFallback from "./ui/ImageWithFallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { ArrowRight, Circle } from "lucide-react";
import { Button } from "./ui/button";
import CircleIcon from "./icons/circleMark";

type Article = {
  title: string;
  category: string;
  image: string;
  description: string;
  href?: string;
};

const placeholderImg =
  "https://newfinanstid.kinsta.cloud/app/uploads/2025/04/Peter-Windischhofer-Jurgen-Riedl-Kilian-Kaminski-refurbed_02-696x391-1.avif";

const articles: Article[] = [
  {
    title: "tech1",
    category: "Företagande",
    image: placeholderImg,
    description:
      "Tech Innovators, ett ledande företag inom teknologisk innovation, har introducerat en plattform som syftar till...",
  },
  {
    title: "tech2",
    category: "Företagande",
    image: placeholderImg,
    description:
      "Tech Innovators, ett ledande företag inom teknologisk innovation, har introducerat en plattform som syftar till...",
  },
  {
    title: "tech3",
    category: "Företagande",
    image: placeholderImg,
    description:
      "Tech Innovators, ett ledande företag inom teknologisk innovation, har introducerat en plattform som syftar till...",
  },
  {
    title: "tech4",
    category: "Företagande",
    image: placeholderImg,
    description:
      "Tech Innovators, ett ledande företag inom teknologisk innovation, har introducerat en plattform som syftar till...",
  },
  {
    title: "tech5",
    category: "Företagande",
    image: placeholderImg,
    description:
      "Tech Innovators, ett ledande företag inom teknologisk innovation, har introducerat en plattform som syftar till...",
  },
  {
    title: "tech6",
    category: "Företagande",
    image: placeholderImg,
    description:
      "Tech Innovators, ett ledande företag inom teknologisk innovation, har introducerat en plattform som syftar till...",
  },
  {
    title: "tech7",
    category: "Företagande",
    image: placeholderImg,
    description:
      "Tech Innovators, ett ledande företag inom teknologisk innovation, har introducerat en plattform som syftar till...",
  },
  {
    title: "tech8",
    category: "Företagande",
    image: placeholderImg,
    description:
      "Tech Innovators, ett ledande företag inom teknologisk innovation, har introducerat en plattform som syftar till...",
  },
];

const categories = [
  "Börsen",
  "Företagande",
  "privatekonomi",
  "finanstid excklusive",
  "nyheter",
];

export default function PopularNewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("Börsen");

  //we have this to controll how many scrolls the carousel will do based on the screen width
  const slidesToScroll = useSlidesToScroll();

  function useSlidesToScroll() {
    const [slidesToScroll, setSlidesToScroll] = useState(4);
    useEffect(() => {
      function updateSlides() {
        const width = window.innerWidth;
        if (width < 640) {
          setSlidesToScroll(2);
        } else {
          setSlidesToScroll(4);
        }
      }

      updateSlides();
      window.addEventListener("resize", updateSlides);
      return () => window.removeEventListener("resize", updateSlides);
    }, []);

    return slidesToScroll;
  }
  <Circle size={20} color="#ffffff" strokeWidth={0.5} absoluteStrokeWidth />;

  return (
    <section className="bg-[#f9f6f2] px-6 py-10">
      <div className="mb-6">
        {/* Heading */}
        <div className="flex items-center gap-2 pl-6">
          <BookMark className="h-4 w-4 fill-lightOrange text-lightOrange" />
          <h2 className="text-lg font-semibold">Populära nyheter</h2>
        </div>

        {/* Button list */}
        <div className="scrollbar-hide relative mt-4 overflow-x-auto pl-6 pr-6">
          <div className="flex w-max gap-3">
            {categories.map((category) => {
              const isActive = selectedCategory === category;

              return (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={isActive ? "dark" : "soft"}
                  className={`group inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold tracking-wide ${
                    isActive ? "text-white" : "text-black"
                  } whitespace-nowrap`}
                >
                  <CircleIcon
                    width={20}
                    color={isActive ? "white" : "#D4D4D4"}
                    className="shrink-0"
                  />
                  {category.toUpperCase()}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-5 bg-gradient-to-r from-[#f9f6f2] to-[#f9f6f2]/0" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-5 bg-gradient-to-l from-[#f9f6f2] to-[#f9f6f2]/0" />

        <Carousel opts={{ align: "start", slidesToScroll }} className="w-full">
          <CarouselContent className="flex px-6">
            {articles.map((article, index) => (
              <CarouselItem
                key={index}
                className="xs:basis-1/2 basis-1/2 pl-2 sm:basis-1/3 md:basis-1/3 lg:basis-1/4 xl:basis-1/4"
              >
                <ArticleCard {...article} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-6 flex items-center justify-center gap-4">
            <CarouselPrevious className="static transform-none" />
            <CarouselNext className="static transform-none" />
          </div>
        </Carousel>
      </div>

      <div className="mt-10 pr-6 text-right">
        <a
          href="#"
          className="group flex items-center justify-end gap-2 text-lg font-semibold text-orange-600 hover:underline"
        >
          Se alla populära nyheter
          <ArrowRight className="relative top-[1px] h-5 w-6 rotate-[-45deg] text-orange-600 transition-transform duration-200 group-hover:rotate-[0deg]" />
        </a>
      </div>
    </section>
  );
}

function ArticleCard({
  image,
  category,
  title,
  description,
  href = "#",
}: Article) {
  return (
    <a
      href={href}
      className="flex flex-col overflow-hidden transition-transform duration-200 hover:scale-[1.02]"
    >
      <ImageWithFallback
        src={image}
        alt={title}
        width={500}
        height={400}
        className="h-[150px] w-full rounded-[3px] object-cover"
      />
      <div className="flex flex-col gap-1 pt-4">
        <p className="text-sm font-medium text-orange-600">{category}</p>
        <h3 className="text-base font-semibold leading-snug text-black">
          {title}
        </h3>
        <p className="text-gray-600 line-clamp-2 text-sm">{description}</p>
      </div>
    </a>
  );
}
