'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import SignUpNewsLetter from './SignUpNewsLetter';

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
const ONE_DAY = 24 * 60 * 60 * 1000;

function recently(key: string) {
  if (typeof window === 'undefined') return false;
  const ts = localStorage.getItem(key);
  return ts ? Date.now() - new Date(ts).getTime() < ONE_DAY : false;
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

  // ONLY used for exit animation
  const [rendered, setRendered] = useState(true);

  /* Auto-open after 30s */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen || recently(MODAL_SUBMIT_KEY) || recently(MODAL_DISMISS_KEY)) return;
    if (window.__popupTimerStarted) return;

    window.__popupTimerStarted = true;

    const id = window.setTimeout(() => {
      setInternalOpen(true);
    }, 30_000);

    return () => clearTimeout(id);
  }, [isOpen]);

  /* Exit animation ONLY */
  useEffect(() => {
    if (shouldOpen) return;

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
      className={`fixed inset-x-0 bottom-0 z-50 flex justify-center transition-opacity duration-300 ${
        shouldOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <div
        ref={modalRef}
        className={`relative flex w-full flex-col bg-white shadow-lg transition-all duration-300 md:flex-row ${
          shouldOpen ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <button
          onClick={closeModal}
          className="absolute right-4 top-4 z-20 rounded-full p-1"
          aria-label="Stäng"
        >
          <X className="h-5 w-5 hover:cursor-pointer" />
        </button>

        <div className="hidden w-1/2 items-center justify-center bg-[#EDE5DF] p-6 md:flex">
          <Image
            src="/Finanstidning_with_slogan.png"
            alt="Finanstidning.se logotyp"
            width={400}
            height={200}
            className="h-auto w-full max-w-[360px] object-contain"
            priority
          />
        </div>

        <div className="flex w-full flex-col justify-center p-6 md:w-2/3">
          {isSubmitted ? (
            <div className="text-center">
              <h2 className="mb-2 text-xl font-semibold">
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
