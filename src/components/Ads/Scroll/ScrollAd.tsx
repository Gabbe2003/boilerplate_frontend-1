"use client";

import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import type { Ad } from "@/lib/ads/types";
import { trackImpression } from "@/lib/ads/track";

export default function ScrollAd({ ad }: { ad: Ad }) {
  const firedRef = useRef(false);

  const { ref } = useInView({
    threshold: 0.5,
    triggerOnce: true,
    onChange: (inView) => {
      if (inView && !firedRef.current) {
        firedRef.current = true;
        trackImpression("scroll", ad.id);
      }
    },
  });

  const lp = ad.linked_post;
  const title = lp?.title ?? ad.title;
  const excerpt = lp?.excerpt ?? ad.description;
  const href = lp?.link ?? ad.link;
  const image = lp?.image ?? ad.image;

  if (!title || !href) return null;

  return (
    <div ref={ref} className="w-full flex justify-center">
      <a
        href={href}
        target={ad.target_blank ? "_blank" : undefined}
        rel={ad.target_blank ? "sponsored noopener noreferrer" : "sponsored"}
        className="group block w-full overflow-hidden rounded-lg border border-black/10 bg-white transition hover:shadow-md"
      >
        {ad.annons && (
          <span className="block px-4 pt-3 text-[10px] uppercase tracking-wide text-[#1A1A1A]/40">
            Annons
          </span>
        )}

        <div className="flex flex-col gap-4 p-4 sm:flex-row">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="h-44 w-full shrink-0 rounded-md object-cover sm:h-28 sm:w-44"
            />
          ) : null}

          <div className="flex flex-col justify-center">
            <h3 className="font-serif text-lg font-semibold leading-tight text-[#1A1A1A] group-hover:opacity-80">
              {title}
            </h3>
            {excerpt ? (
              <p className="mt-1 line-clamp-2 text-sm text-[#1A1A1A]/70">
                {excerpt}
              </p>
            ) : null}
          </div>
        </div>
      </a>
    </div>
  );
}
