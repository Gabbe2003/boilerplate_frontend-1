"use client";

import { useEffect } from "react";
import type { Ad } from "@/lib/ads/types";
import { trackClick, trackImpression } from "@/lib/ads/track";

export default function HeaderAd({ ad }: { ad: Ad | null }) {
  // Count an impression every time the ad is shown (total, not unique).
  useEffect(() => {
    if (ad) trackImpression("header", ad.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad?.id]);

  if (!ad) return null;

  const title = ad.use_custom ? ad.title : ad.linked_post?.title ?? ad.title;
  const href = ad.use_custom ? ad.link : ad.linked_post?.link ?? ad.link;
  const description = ad.use_custom
    ? ad.description
    : ad.linked_post?.excerpt ?? ad.description;

  if (!title || !href) return null;

  return (
    <div className="mt-2 pt-2">
      <div className="flex w-full min-w-0 items-center gap-2.5">
        {ad.annons && (
          <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#1A1A1A]/40">
            Annons
          </span>
        )}
        <a
          href={href}
          target={ad.target_blank ? "_blank" : undefined}
          rel={ad.target_blank ? "sponsored noopener noreferrer" : "sponsored"}
          onClick={() => trackClick("header", ad.id)}
          className="group flex min-w-0 items-center gap-2 text-sm text-[#1A1A1A]"
        >
          <span className="truncate font-semibold group-hover:underline">
            {title}
          </span>
          {description ? (
            <span className="truncate text-[#1A1A1A]/55">{description}</span>
          ) : null}
        </a>
      </div>
    </div>
  );
}
