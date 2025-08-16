"use client";

import { useMemo, useEffect, useRef, useCallback, useState } from "react";
import { useAppContext } from "@/store/AppContext";
import Link from "next/link";
import Image from "next/image";

interface Props { currentSlug: string }

export default function RecommendationListMarquee({ currentSlug }: Props) {
  const { posts } = useAppContext();
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  const [speed, setSpeed] = useState(30); // default for desktop

  // detect viewport and adjust speed
  useEffect(() => {
    const check = () => {
      if (window.innerWidth < 640) setSpeed(15); // sm
      else if (window.innerWidth < 1024) setSpeed(20); // md
      else setSpeed(30); // lg+
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const items = useMemo(
    () => posts.filter(p => p.slug !== currentSlug).slice(0, 20),
    [posts, currentSlug]
  );

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes marqueeLeft { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      @keyframes marqueeRight { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }

      @media (prefers-reduced-motion: reduce) {
        .marquee-anim { animation: none !important; transform: translateX(0) !important; }
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

  const row = [...items, ...items]; // duplicate

  return (
    <div
      className="w-full lg:w-[70%] mx-auto px-2"
      onMouseEnter={() => pause(true)}
      onMouseLeave={() => pause(false)}
      onTouchStart={() => pause(true)}
      onTouchEnd={() => pause(false)}
    >
      <div className="pt-6 pb-4 text-sm uppercase tracking-wide text-gray-600 font-semibold">
        Recommended for you
      </div>

      <div className="space-y-4">
        {/* Row 1 */}
        <div className="relative overflow-hidden">
          <div
            ref={row1Ref}
            className="marquee-anim flex w-[200%] gap-10 py-4"
            style={{ animation: `marqueeLeft ${speed}s linear infinite` }}
          >
            {row.map((p, i) => (
              <Link
                key={`${p.slug}-1-${i}`}
                href={`/${p.slug}`}
                className="inline-flex items-center gap-4 whitespace-nowrap hover:underline"
              >
                <span className="relative block h-24 w-40 overflow-hidden rounded-md shadow-md flex-shrink-0">
                  <Image
                    src={p.featuredImage?.node.sourceUrl || "/placeholder.png"}
                    alt={p.title}
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

        {/* Row 2 */}
        <div className="relative overflow-hidden">
          <div
            ref={row2Ref}
            className="marquee-anim flex w-[200%] gap-10 py-4"
            style={{ animation: `marqueeRight ${speed}s linear infinite` }}
          >
            {row.map((p, i) => (
              <Link
                key={`${p.slug}-2-${i}`}
                href={`/${p.slug}`}
                className="inline-flex items-center gap-4 whitespace-nowrap hover:underline"
              >
                <span className="relative block h-24 w-40 overflow-hidden rounded-md shadow-md flex-shrink-0">
                  <Image
                    src={p.featuredImage?.node.sourceUrl || "/placeholder.png"}
                    alt={p.title}
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
