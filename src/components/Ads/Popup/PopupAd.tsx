"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Ad } from "@/lib/ads/types";
import { trackClick, trackImpression } from "@/lib/ads/track";
import { isPopupActive, setPopupActive } from "@/lib/ads/popupBus";

const OPEN_DELAY = 5_000;

export default function PopupAd({ ad = null }: { ad?: Ad | null }) {
  const [open, setOpen] = useState(false);
  const [rendered, setRendered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

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

  const handleCtaClick = () => {
    if (ad) trackClick("popup", ad.id);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      close();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
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
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Annons"}
      className={`fixed inset-0 z-50 flex justify-center bg-black/40 backdrop-blur-sm md:items-center md:p-6 ${
        open ? "popup-backdrop-enter" : "popup-backdrop-exit pointer-events-none"
      }`}
    >
      <div
        ref={modalRef}
        style={{ backgroundColor: ad.bg_color || "#ffffff" }}
        className={`relative flex h-full w-full flex-col justify-center overflow-y-auto shadow-2xl ring-1 ring-black/5 md:h-auto md:justify-start md:max-w-lg md:overflow-hidden md:rounded-2xl ${
          open ? "popup-card-enter" : "popup-card-exit"
        }`}
      >
        <button
          onClick={close}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-gray-700 shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:scale-105 hover:bg-white hover:text-black cursor-pointer"
          aria-label="Stäng"
        >
          <X className="h-4 w-4" />
        </button>

        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            className="h-48 w-full object-cover"
          />
        ) : null}

        <div className="flex flex-col gap-3 p-6 pr-14 sm:p-8 sm:pr-16">
          {ad.annons && (
            <span className="text-[10px] uppercase tracking-wide text-black/40">
              Annons
            </span>
          )}

          {title ? (
            <h2 className="font-serif text-2xl font-semibold leading-tight text-[#1A1A1A]">
              {title}
            </h2>
          ) : null}

          {body ? <p className="text-sm text-[#1A1A1A]/80">{body}</p> : null}

          {ad.cta && ad.cta !== buttonLabel ? (
            <p className="text-sm font-medium text-[#1A1A1A]">{ad.cta}</p>
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
              className="mt-2 inline-block rounded px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
            >
              {buttonLabel}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
