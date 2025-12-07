'use client';

import { X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import SignUpNewsLetter from './SignUpNewsLetter';

declare global {
  interface Window {
    setRuleSubmitSuccess?: () => void;
    __popupTimerStarted?: boolean;
    __popupOpen?: boolean;
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
  const modalRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(isOpen);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isOpen || recently(MODAL_SUBMIT_KEY) || recently(MODAL_DISMISS_KEY)) return;
    if (window.__popupTimerStarted) return;
    window.__popupTimerStarted = true;

    const id = window.setTimeout(() => {
      if (!window.__popupOpen) setInternalOpen(true);
    }, 30_000);

    return () => {
      clearTimeout(id);
    };
  }, [isOpen]);

  useEffect(() => {
    const shouldOpen = isOpen || internalOpen;
    if (shouldOpen && !visible) setVisible(true);
    if (!shouldOpen && visible) {
      const t = setTimeout(() => setVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen, internalOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!visible) return;

    if (window.__popupOpen) {
      setVisible(false);
      return;
    }

    window.__popupOpen = true;
    return () => {
      window.__popupOpen = false;
    };
  }, [visible]);

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
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) closeModal();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
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
          className="absolute right-4 top-4 z-20 rounded-full p-1 hover:text-gray-200 md:text-gray-500 md:hover:text-black"
          aria-label="Stäng"
        >
          <X className="h-5 w-5 cursor-pointer" />
        </button>

        <div className="hidden md:flex w-1/2 items-center justify-center bg-[#EDE5DF] p-6 md:p-8">
          <Image
            src="/Finanstidning_with_slogan.png"
            alt="Finanstidning.se logotyp"
            width={400}
            height={200}
            className="w-full rounded max-w-[300px] md:max-w-[360px] h-auto object-contain"
            priority
          />
        </div>
        {/* Text / form content */}
        <div className="relative z-10 flex w-full flex-col justify-center p-6 md:w-2/3 bg-white/95 md:bg-transparent">
          {isSubmitted ? (
            <div className="text-center">
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                Tack för din prenumeration!
              </h2>
              <p className="text-sm text-gray-600">
                Du kommer nu att få dagliga nyheter till din e-post. Om du inte hittar våra mejl, kontrollera skräpposten eller kontakta oss.
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
