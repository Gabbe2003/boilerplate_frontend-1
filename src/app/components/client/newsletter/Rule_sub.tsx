'use client';

import * as React from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useAppContext } from '@/store/AppContext';

declare global {
  interface Window {
    setRuleSubmitSuccess?: () => void;
    __popupTimerStarted?: boolean; // guard: ensure timer starts once in dev strict mode
    __popupOpen?: boolean;         // guard: ensure only one modal is visible
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

export default function PopupModal({ isOpen, onClose, onSubmit }: PopupModalProps) {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(isOpen);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [email, setEmail] = React.useState('');
  const [internalOpen, setInternalOpen] = React.useState(false);
  const { logo } = useAppContext();

  // Start the 10s timer ONCE per page (dev-safe)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // If parent already opens it, or user recently dismissed/submitted, don’t arm timer.
    if (isOpen || recently(MODAL_SUBMIT_KEY) || recently(MODAL_DISMISS_KEY)) return;

    // Prevent duplicate timers under Strict Mode remounts
    if (window.__popupTimerStarted) return;
    window.__popupTimerStarted = true;

    const id = window.setTimeout(() => {
      // If another instance already opened, skip
      if (!window.__popupOpen) setInternalOpen(true);
    }, 10_000);

    // NOTE: we intentionally DO NOT reset __popupTimerStarted in cleanup.
    // That way the second dev Strict Mode mount won’t schedule a second timer.
    return () => {
      clearTimeout(id);
    };
  }, [isOpen]);

  // Sync visible with external + internal
  React.useEffect(() => {
    const shouldOpen = isOpen || internalOpen;
    if (shouldOpen && !visible) setVisible(true);
    if (!shouldOpen && visible) {
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, internalOpen, visible]);

  // Singleton guard for the modal itself
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!visible) return;

    // If another modal is already marked open, hide this one immediately
    if (window.__popupOpen) {
      setVisible(false);
      return;
    }

    window.__popupOpen = true;
    return () => {
      // On real unmount or when visibility goes false, release the lock
      window.__popupOpen = false;
    };
  }, [visible]);

  // Global submit handler (attached once)
  React.useEffect(() => {
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

  // Handlers
  const closeModal = () => {
    onClose();
    setInternalOpen(false);
    localStorage.setItem(MODAL_DISMISS_KEY, new Date().toISOString());
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) closeModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        window.setRuleSubmitSuccess?.();
      } else {
        const errorData = await res.json();
        alert(`Subscription failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (err: unknown) {
  let message = 'Unknown error';
  if (err && typeof err === 'object' && 'message' in err) {
    message = String((err as { message: unknown }).message);
  } else {
    message = String(err);
  }
  alert(`Network or unexpected error: ${message}`);
}
 
    
  };

  if (!visible) return null;

  return (
  <div
    onClick={handleBackdropClick}
    onKeyDown={handleKeyDown}
    tabIndex={-1}
    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 transition-opacity duration-300 ${
      isOpen || internalOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
    }`}
  >
    <div
      ref={modalRef}
      className={`relative flex w-full max-w-3xl min-h-[40vh] md:min-h-[00vh] transform flex-col rounded-sm bg-white shadow-lg transition-all duration-300 md:flex-row ${
        isOpen || internalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
      }`}
    >
      {/* Close button */}
      <button
        onClick={closeModal}
        className="absolute right-4 top-4 z-20 rounded-full p-1  hover:text-gray-200 md:text-gray-500 md:hover:text-black"
        aria-label="Close"
      >
        <X className="h-5 w-5 cursor-pointer" />
      </button>

      <div className="hidden md:flex w-1/2 items-center justify-center bg-[#EDE5DF] p-6 md:p-8">
        {logo?.sourceUrl ? (
          <Image
            src={logo.sourceUrl}
            alt={logo.altText ?? 'Logo'}
            width={400}
            height={200}
            className="w-full rounded max-w-[300px] md:max-w-[360px] h-auto object-contain"
            priority
          />
        ) : (
          <span className="text-lg font-bold">Logo</span>
        )}
      </div>

      {/* Text / form content */}
      <div className="relative z-10 flex w-full flex-col justify-center p-6 md:w-2/3 bg-white/95 md:bg-transparent">
        {isSubmitted ? (
          <div className="text-center">
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              Thank you for subscribing
            </h2>
            <p className="text-sm text-gray-600">
              You will now receive daily news in your email. If you don’t find our emails, check spam or contact us.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rulemailer-subscriber-form">
            <h2 className="rulemailer-header mb-2 text-xl font-bold">
              DAILY NEWS IN YOUR INBOX!
            </h2>
            <p className="rulemailer-header mb-4 text-sm font-semibold">
              Receive daily news with the most recent updates.
            </p>
            <input
              id="rule_email"
              type="email"
              placeholder="ex: info@gmail.se"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mb-6 w-full rounded border p-2"
            />
            <div id="recaptcha"></div>
            <button
              type="submit"
              className="w-full cursor-pointer rounded bg-[#FFA94D] p-2 text-white"
            >
              Submit
            </button>
            <p className="mt-4 text-xs text-gray-500">
              By submitting my email, I consent to receive daily updates and promotional emails.
            </p>
          </form>
        )}
      </div>
    </div>
  </div>
);

}
