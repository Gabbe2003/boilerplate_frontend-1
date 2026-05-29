'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import SignUpNewsLetter from './SignUpNewsLetter';
import { isPopupActive, setPopupActive } from '@/lib/ads/popupBus';

declare global {
  interface Window {
    setRuleSubmitSuccess?: () => void;
    __popupTimerStarted?: boolean;
  }
}

type PopupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
};

const MODAL_SUBMIT_KEY = 'modalFormSubmittedAt';
const MODAL_DISMISS_KEY = 'modalDismissedAt';
const DAY = 24 * 60 * 60 * 1000;
const SUBMIT_COOLDOWN = DAY;
const DISMISS_COOLDOWN = 7 * DAY;

function within(key: string, windowMs: number) {
  if (typeof window === 'undefined') return false;
  const ts = localStorage.getItem(key);
  return ts ? Date.now() - new Date(ts).getTime() < windowMs : false;
}

export default function PopupModal({
  isOpen,
  onClose,
  onSubmit,
}: PopupModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const shouldOpen = isOpen || internalOpen;

  const [rendered, setRendered] = useState(false);

  const openTimerRef = useRef<number | null>(null);

  /* Auto-open after 30s */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (
      isOpen ||
      within(MODAL_SUBMIT_KEY, SUBMIT_COOLDOWN) ||
      within(MODAL_DISMISS_KEY, DISMISS_COOLDOWN)
    )
      return;
    if (window.__popupTimerStarted) return;

    window.__popupTimerStarted = true;

    openTimerRef.current = window.setTimeout(() => {
      // Re-check cooldowns at fire time in case the user interacted during the wait
      if (
        within(MODAL_SUBMIT_KEY, SUBMIT_COOLDOWN) ||
        within(MODAL_DISMISS_KEY, DISMISS_COOLDOWN)
      )
        return;
      // Never show two popups at once (e.g. an ad popup is open).
      if (isPopupActive()) return;
      setInternalOpen(true);
    }, 30_000);

    return () => {
      if (openTimerRef.current !== null) {
        clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }
    };
  }, [isOpen]);

  /* Exit animation gating + shared popup flag */
  useEffect(() => {
    if (shouldOpen) {
      setRendered(true);
      setPopupActive(true);
      return;
    }
    setPopupActive(false);
    const t = setTimeout(() => setRendered(false), 300);
    return () => clearTimeout(t);
  }, [shouldOpen]);

  /* External submit hook */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    window.setRuleSubmitSuccess = () => {
      setIsSubmitted(true);
      onSubmit?.();
      localStorage.setItem(MODAL_SUBMIT_KEY, new Date().toISOString());
    };

    return () => {
      delete window.setRuleSubmitSuccess;
    };
  }, [onSubmit]);

  const closeModal = () => {
    onClose();
    setInternalOpen(false);
    if (openTimerRef.current !== null) {
      clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
    localStorage.setItem(MODAL_DISMISS_KEY, new Date().toISOString());
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closeModal();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  };

  if (!shouldOpen && !rendered) return null;

  return (
    <div
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Prenumerera på nyhetsbrevet"
      className={`fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm md:items-center md:p-6 ${
        shouldOpen ? 'popup-backdrop-enter' : 'popup-backdrop-exit pointer-events-none'
      }`}
    >
      <div
        ref={modalRef}
        className={`relative flex w-full max-w-3xl flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 md:flex-row md:rounded-2xl ${
          shouldOpen ? 'popup-card-enter' : 'popup-card-exit'
        }`}
      >
        <button
          onClick={closeModal}
          className="absolute right-3 top-3 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-gray-700 shadow-sm ring-1 ring-black/5 backdrop-blur transition hover:scale-105 hover:bg-white hover:text-black cursor-pointer"
          aria-label="Stäng"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-linear-to-br from-[#f3ebe2] via-[#ede3d7] to-[#e2d3c3] p-8 md:flex">
          <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
          <div className="pointer-events-none absolute -right-12 bottom-0 h-48 w-48 rounded-full bg-[#FFA94D]/20 blur-3xl" />
          <Image
            src="/Finanstidning_with_slogan.png"
            alt="Finanstidning.se logotyp"
            width={400}
            height={200}
            className="relative h-auto w-full max-w-[320px] object-contain"
            priority
          />
        </div>

        <div className="flex w-full flex-col justify-center bg-white p-6 pr-14 sm:p-8 sm:pr-16 md:w-1/2">
          {isSubmitted ? (
            <div className="text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                ✓
              </div>
              <h2 className="mb-2 text-xl font-semibold text-gray-900">
                Tack för din prenumeration!
              </h2>
              <p className="text-sm text-gray-600">
                Du kommer nu att få dagliga nyheter till din e-post.
              </p>
            </div>
          ) : (
            <SignUpNewsLetter />
          )}
        </div>
      </div>
    </div>
  );
}
