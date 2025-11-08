'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import SignUpNewsLetter from './SignUpNewsLetter';

export type AdPopupVariant =
  | 'current'
  | 'red'
  | 'lightBlue'
  | 'emerald'
  | 'orange'
  | 'purple'
  | 'amber'
  | 'rose'
  | 'highContrast'
  | 'outline';

type Theme = {
  text: string;
  cta: string;
  badge: string;
  border: string;
  bg: string;
  style?: React.CSSProperties;
};

interface AdPopupProps {
  logo?: { sourceUrl?: string; altText?: string } | null;
  variant?: AdPopupVariant;
  sessionKey?: string; // show once per tab (sessionStorage)
  onClose?: () => void;
}

/** Randomization pool */
const VARIANT_POOL: AdPopupVariant[] = [
  'current',
  'red',
  'lightBlue',
  'emerald',
  'orange',
  'purple',
  'amber',
  'rose',
  'highContrast',
  'outline',
];

/** Theme tokens */
const BASE: Theme = {
  text: 'text-gray-900',
  cta: 'bg-black text-white hover:bg-gray-800',
  badge: 'bg-black text-white',
  border: 'border-gray-300',
  bg: 'bg-[#97d5c9]',
};

const THEMES: Record<AdPopupVariant, Theme> = {
  current: { ...BASE, border: 'border-[#7fbfb3]', bg: 'bg-[#97d5c9]' },
  red: { ...BASE, text: 'text-white', cta: 'bg-white text-black hover:bg-gray-100', badge: 'bg-white text-black', border: 'border-red-600', bg: 'bg-red-500' },
  lightBlue: { ...BASE, text: 'text-gray-900', cta: BASE.cta, badge: BASE.badge, border: 'border-sky-300', bg: 'bg-sky-200' },
  emerald: { ...BASE, text: 'text-emerald-950', cta: 'bg-emerald-700 text-white hover:bg-emerald-800', badge: 'bg-emerald-700 text-white', border: 'border-emerald-400', bg: 'bg-emerald-200' },
  orange: { ...BASE, text: 'text-orange-950', cta: 'bg-orange-600 text-white hover:bg-orange-700', badge: 'bg-orange-600 text-white', border: 'border-orange-400', bg: 'bg-orange-200' },
  purple: { ...BASE, text: 'text-white', cta: 'bg-white text-purple-900 hover:bg-purple-100', badge: 'bg-white text-purple-900', border: 'border-purple-400', bg: 'bg-purple-600' },
  amber: { ...BASE, text: 'text-amber-950', cta: 'bg-amber-600 text-white hover:bg-amber-700', badge: 'bg-amber-600 text-white', border: 'border-amber-400', bg: 'bg-amber-200' },
  rose: { ...BASE, text: 'text-rose-950', cta: 'bg-rose-600 text-white hover:bg-rose-700', badge: 'bg-rose-600 text-white', border: 'border-rose-400', bg: 'bg-rose-200' },
  highContrast: { ...BASE, text: 'text-black', cta: 'bg-black text-white hover:bg-gray-800', badge: 'bg-black text-white', border: 'border-black', bg: 'bg-yellow-300' },
  outline: { ...BASE, text: 'text-gray-900', cta: 'bg-transparent text-gray-900 border border-gray-900 hover:bg-gray-100', badge: 'bg-transparent text-gray-900 border border-gray-900', border: 'border-gray-900', bg: 'bg-white' },
};

export default function AdPopup({
  logo,
  variant,
  sessionKey = 'adPopupClosed',
  onClose,
}: AdPopupProps) {
  // choose a random variant once; prop `variant` overrides dynamically
  const [randomVariant] = useState<AdPopupVariant>(() => VARIANT_POOL[Math.floor(Math.random() * VARIANT_POOL.length)]);
  const appliedVariant = variant ?? randomVariant;
  const theme = THEMES[appliedVariant] ?? THEMES.current;

  const [visible, setVisible] = useState(false);
 useEffect(() => {
    try {
      const closed = sessionStorage.getItem(sessionKey) === 'true';
      if (closed) {
        setVisible(false);
      } else {
        setVisible(true);
        sessionStorage.setItem(sessionKey, 'true');
      }
    } catch {
      setVisible(true);
    }
  }, [sessionKey]);

  useEffect(() => {
    const clear = () => sessionStorage.removeItem(sessionKey);
    window.addEventListener('beforeunload', clear);
    return () => window.removeEventListener('beforeunload', clear);
  }, [sessionKey]);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Annons"
      className={[
        'fixed left-2 right-4 bottom-4 z-[1000]',
        theme.bg,
        theme.border,
        'border shadow-xl p-3 sm:p-4 animate-fadeIn max-w-[90vw] sm:max-w-5xl sm:ml-4 sm:mr-auto mx-auto rounded-lg overflow-hidden',
      ].join(' ')}
      style={theme.style}
    >
      <button
        onClick={handleClose}
        aria-label="Stäng"
        className="absolute top-2 right-2 sm:top-3 sm:right-3 h-8 w-8 p-0 text-xs font-semibold uppercase tracking-wide hover:underline cursor-pointer z-20"
      >
        ✕
      </button>

      <div className="flex flex-row lg:flex-row items-stretch gap-3 sm:gap-4 mt-3 w-full">
        <div
          className="
            relative shrink-0 overflow-hidden rounded-md
            w-1/4 h-auto
            sm:w-1/4 sm:h-32
            md:w-1/4 md:h-40
            lg:basis-1/3 lg:h-auto
            flex items-center justify-center bg-white
          "
        >
          <span className={`absolute top-2 left-2 ${theme.badge} text-[10px] px-1 sm:px-2 py-1 uppercase tracking-wide z-10`}>
            ANNONS
          </span>
            <Image
              src="/Finanstidning_with_slogan.png"
              alt="Finanstidning.se logotyp"
              fill
              className="object-contain object-center bg-white"
              sizes="(min-width:1024px) 33vw,(min-width:768px) 25vw,(min-width:640px) 25vw,25vw"
              priority
            />
        </div>

        <div className={`flex-1 min-w-0 flex flex-col justify-between text-center sm:text-left ${theme.text}`}>
          <div>
            <span className="block text-[11px] sm:text-[10px] tracking-wide uppercase opacity-90 mb-1">
              Sparkonto
            </span>

            <h3 className="text-sm sm:text-base md:text-2xl font-extrabold leading-snug mb-1 line-clamp-2">
              Sparkontot som toppar jämförelsen – lås in upp till 2,9 % i sparränta
            </h3>

            <p className="text-xs sm:text-sm md:text-base opacity-90 line-clamp-3">
              Få upp till 2,9 % i sparränta – tryggt med insättningsgaranti.
              Sparräntorna fortsätter att falla, men här hittar du kontot som ger
              högst ränta idag…
            </p>
          </div>

          <div className="mt-2 sm:mt-3 flex justify-center sm:justify-end">
            <Link href="/advertisement" prefetch={false}>
              <button className={`w-full sm:w-auto px-6 py-2 text-sm sm:text-xs md:text-base font-semibold uppercase rounded-none ${theme.cta}`}>
                Läs mer
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
