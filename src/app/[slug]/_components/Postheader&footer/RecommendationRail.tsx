"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";
import { formatDateStockholm, handleSpecielChar } from "@/lib/globals/actions";
import AuthorInfo from "../_post/AuthorInfo";

interface Props { posts: Post[] }



const generateLink = (p: Post, i: number) => {
  console.log(p.id);

  return (
    <Link
      key={`${p.id}-${i}`}
      href={handleSpecielChar(p.slug || "")}
      prefetch={false}
      className="
      group flex flex-col w-60 flex-shrink-0
      rounded-xl overflow-hidden
      bg-white
      border border-neutral-200/70
      shadow-sm hover:shadow-lg
      transition-all duration-300
    "
    >
      {/* Image */}
      <div
        className="
          relative 
          w-full 
          h-[150px]
          overflow-hidden 
          flex items-start justify-center 
        "
      >
        <Image
          src={p.featuredImage?.node?.sourceUrl || '/full_logo_with_slogan.png'}
          alt={p.featuredImage?.node?.altText || ""}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 400px"
        />

      </div>


      {/* Content */}
      <div className="px-4 py-4 space-y-2">
        {/* Title */}
        <h3
          className="
          font-medium text-lg text-neutral-900
          group-hover:text-neutral-700
          line-clamp-2
        "
        >
          {p.title}
        </h3>

        {/* Author + Date */}
        <div className="flex items-center justify-between text-xs text-neutral-500">
          <span className="text-sx text-red-500">
            {p.author?.node?.name && (
              <AuthorInfo author={p.author} noLink />
            )}
          </span>
          <span className="text-xs text-[#6f6a63] ">{formatDateStockholm(p.date)}</span>
        </div>
      </div>
    </Link>
  )
}

export default function RecommendationRail({ posts }: Props) {
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const [speed, setSpeed] = useState(30);

  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 640) setSpeed(15);
      else if (window.innerWidth < 1024) setSpeed(20);
      else setSpeed(30);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Inject keyframes once
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes marqueeLeft  { 0% { transform: translateX(0)    } 100% { transform: translateX(-50%) } }
      @keyframes marqueeRight { 0% { transform: translateX(-50%) } 100% { transform: translateX(0)    } }
      .marquee-anim { will-change: transform; }
      @media (prefers-reduced-motion: reduce) {
        .marquee-anim { animation-name: none !important; transform: translateX(0) !important; }
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const pause = useCallback((yes: boolean) => {
    const state = yes ? "paused" : "running";
    if (row1Ref.current) row1Ref.current.style.animationPlayState = state;
    if (row2Ref.current) row2Ref.current.style.animationPlayState = state;
  }, []);

  // Build two lanes (3 each), and duplicate each lane for seamless 200% width
  const { row1Items, row2Items } = useMemo(() => {
    const top = posts.slice(0, 4);       // first 4
    const bottom = posts.slice(4, 8);    // next 4

    return {
      row1Items: [...top, ...top],       // duplicated for marquee
      row2Items: [...bottom, ...bottom], // duplicated for marquee
    };
  }, [posts]);


  return (
    <div
      className="w-full mx-auto mb-20"
      onMouseEnter={() => pause(true)}
      onMouseLeave={() => pause(false)}
      onTouchStart={() => pause(true)}
      onTouchEnd={() => pause(false)}
    >
      <div className="pt-6 pb-4 text-sm uppercase tracking-wide text-gray-600 font-semibold">
        Rekommenderat för dig
      </div>

      <div className="space-y-4">
        {/* Row 1 */}
        <div className="relative overflow-hidden">
          <div
            ref={row1Ref}
            className="marquee-anim flex w-[200%] gap-10 py-4"
            style={{
              animationName: "marqueeLeft",
              animationDuration: `${speed}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationPlayState: "running",
            }}
          >
            {row1Items.map((p, i) => generateLink(p, i))}

          </div>
        </div>

        {/* Row 2 */}
        <div className="relative overflow-hidden">
          <div
            ref={row2Ref}
            className="marquee-anim flex w-[200%] gap-10 py-4"
            style={{
              animationName: "marqueeRight",
              animationDuration: `${speed}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationPlayState: "running",
            }}
          >
            {row2Items.map((p, i) => generateLink(p, i))}
          </div>
        </div>
      </div>
    </div>
  );
}
