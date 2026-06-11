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
      // Never show two popups at once (e.g. the newsletter popup).
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

  const handleCtaClick = () => {
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
      style={{ backgroundColor: ad.bg_color || "#ffffff" }}
      className={`fixed bottom-4 right-4 z-50 flex w-[460px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/10 sm:flex-row sm:bottom-6 sm:right-6 ${
        open ? "side-card-enter" : "side-card-exit pointer-events-none"
      }`}
    >
      <button
        onClick={close}
        className="absolute right-2 top-2 z-20 grid h-8 w-8 place-items-center rounded-full bg-white/85 text-gray-700 shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:scale-105 hover:bg-white hover:text-black cursor-pointer"
        aria-label="Stäng"
      >
        <X className="h-4 w-4" />
      </button>

      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={title}
          className="h-36 w-full shrink-0 object-cover sm:h-auto sm:w-44"
        />
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4 pr-10 sm:gap-2 sm:p-5 sm:pr-12">
        {ad.annons && (
          <span className="text-[10px] uppercase tracking-wider text-black/40">
            Annons
          </span>
        )}

        {title ? (
          <h2 className="font-serif text-lg font-semibold leading-tight text-[#1A1A1A] line-clamp-2">
            {title}
          </h2>
        ) : null}

        {body ? (
          <p className="text-sm text-[#1A1A1A]/75 line-clamp-3">{body}</p>
        ) : null}

        {ad.cta && ad.cta !== buttonLabel ? (
          <p className="text-xs font-medium text-[#1A1A1A]/80">{ad.cta}</p>
        ) : null}

        {href ? (
          <a
            href={href}
            target={ad.target_blank ? "_blank" : undefined}
            rel={
              ad.target_blank
                ? "sponsored noopener noreferrer"
                : "sponsored"
            }
            onClick={handleCtaClick}
            style={{ backgroundColor: ad.button_bg_color || "#FFA94D" }}
            className="mt-1 inline-block self-start rounded px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
          >
            {buttonLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}
