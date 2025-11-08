"use client";

import { useEffect, useRef, useCallback, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/types";

interface Props { posts: Post[] }

export default function RecommendationListMarquee({ posts }: Props) {
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
    const top = posts.slice(0, 3);
    const bottom = posts.slice(3, 6);
    return {
      row1Items: [...top, ...top],
      row2Items: [...bottom, ...bottom],
    };
  }, [posts]);

  return (
    <div
      className="w-full mx-auto px-2"
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
            {row1Items.map((p, i) => (
              <Link
                key={`${p.slug ?? p.id}-r1-${i}`}
                href={p.slug || `/${p.slug}`}
                prefetch={false}
                className="inline-flex items-center gap-4 whitespace-nowrap hover:underline"
              >
                <span
                  className="relative block h-24 w-40 overflow-hidden rounded-md shadow-md flex-shrink-0"
                  aria-hidden="true"
                >
                  <Image
                    src={p.featuredImage?.node?.sourceUrl || "/full_logo_with_slogan.png"}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="160px"
                    priority={false}
                  />
                </span>
                <span className="font-semibold text-xl truncate max-w-[40ch]">
                  {p.title}
                </span>
              </Link>
            ))}
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
            {row2Items.map((p, i) => (
              <Link
                key={`${p.slug ?? p.id}-r2-${i}`}
                href={p.uri || `/${p.slug}`}
                prefetch={false}
                className="inline-flex items-center gap-4 whitespace-nowrap hover:underline"
              >
                <span
                  className="relative block h-24 w-40 overflow-hidden rounded-md shadow-md flex-shrink-0"
                  aria-hidden="true"
                >
                  <Image
                    src={p.featuredImage?.node?.sourceUrl || "/full_logo_with_slogan.png"}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                </span>
                <span className="font-semibold text-xl truncate max-w-[40ch]">
                  {p.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


// slug, id, featuredImage, title