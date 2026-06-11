"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import type { Ad } from "@/lib/ads/types";
import { trackClick, trackImpression } from "@/lib/ads/track";
import { isPopupActive, setPopupActive } from "@/lib/ads/popupBus";

const OPEN_DELAY = 5_000;

export default function PopupAd({ ad = null }: { ad?: Ad | null }) {
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);

  // Schedule a single open ~5s after load (independent of session).
  useEffect(() => {
    if (!ad) return;

    const timer = window.setTimeout(() => {
      if (isPopupActive()) return;
      setPopupActive(true);
      setRendered(true);
      setOpen(true);
      trackImpression("popup", ad.id);
    }, OPEN_DELAY);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ad?.id]);

  // Exit-animation gating: keep mounted ~300ms after close so the exit plays.
  useEffect(() => {
    if (open || !rendered) return;
    const t = setTimeout(() => setRendered(false), 300);
    return () => clearTimeout(t);
  }, [open, rendered]);

  const close = () => {
    setOpen(false);
    setPopupActive(false);
  };

  // Esc to close while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleCardClick = () => {
    if (ad) trackClick("popup", ad.id);
  };

  if (!ad || (!open && !rendered)) return null;

  const lp = ad.linked_post;
  const title = ad.use_custom ? ad.title : lp?.title ?? ad.title;
  const body = ad.text || (ad.use_custom ? "" : lp?.excerpt ?? "");
  const href = ad.use_custom ? ad.link : lp?.link ?? ad.link;
  const image = ad.image || (ad.use_custom ? "" : lp?.image ?? "");
  const buttonLabel = ad.button || ad.cta || "Läs mer";

  return (
    <div
      role="dialog"
      aria-label={title || "Annons"}
      className={`fixed bottom-0 left-0 right-0 z-50 lg:left-auto lg:bottom-6 lg:right-6 lg:w-[680px] xl:w-[860px] ${
        open ? "side-card-enter" : "side-card-exit pointer-events-none"
      }`}
    >
      <a
        href={href || "#"}
        target={ad.target_blank ? "_blank" : undefined}
        rel={ad.target_blank ? "sponsored noopener noreferrer" : "sponsored"}
        onClick={handleCardClick}
        style={{ backgroundColor: ad.bg_color || "#ffffff" }}
        className="group flex flex-col overflow-hidden rounded-t-2xl shadow-2xl ring-1 ring-black/10 lg:flex-row lg:rounded-2xl"
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-44 w-full shrink-0 object-cover lg:h-auto lg:w-56 xl:w-64"
          />
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col gap-2 p-5 pb-16 sm:p-6 sm:pb-16 lg:p-7 lg:pb-7 lg:pr-20">
          {ad.annons && (
            <span className="text-xs uppercase tracking-wider text-black/40">
              Annons
            </span>
          )}

          {title ? (
            <h2 className="font-serif text-xl font-semibold leading-tight text-[#1A1A1A] line-clamp-2 lg:text-2xl">
              {title}
            </h2>
          ) : null}

          {body ? (
            <p className="text-base text-[#1A1A1A]/75 line-clamp-3 lg:text-lg">
              {body}
            </p>
          ) : null}

          {ad.cta && ad.cta !== buttonLabel ? (
            <p className="text-sm font-medium text-[#1A1A1A]/80">{ad.cta}</p>
          ) : null}

          {href ? (
            <span
              style={{ backgroundColor: ad.button_bg_color || "#FFA94D" }}
              className="mt-2 inline-block self-start rounded px-5 py-2 text-sm font-semibold text-white transition group-hover:opacity-90 lg:text-base"
            >
              {buttonLabel}
            </span>
          ) : null}
        </div>
      </a>

      <button
        type="button"
        onClick={close}
        className="absolute bottom-3 right-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-gray-700 shadow-md ring-1 ring-black/10 backdrop-blur transition hover:scale-105 hover:bg-white hover:text-black cursor-pointer"
        aria-label="Stäng"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
}
