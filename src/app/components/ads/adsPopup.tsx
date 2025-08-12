'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { Button } from '@/components/ui/button';

export default function AdPopup() {
  // Start hidden to avoid SSR/hydration flicker
  const [visible, setVisible] = useState(false);
  const { logo } = useAppContext();

  useEffect(() => {
    try {
      const closed = sessionStorage.getItem('adPopupClosed') === 'true';
      if (closed) {
        setVisible(false);                   // already shown/closed this session
      } else {
        setVisible(true);                    // first time this session → show
        sessionStorage.setItem('adPopupClosed', 'true'); // mark so it won't show again this session
      }
    } catch {
      // If sessionStorage is blocked, just show it once
      setVisible(true);
    }
  }, []);

  useEffect(() => {
  const clear = () => sessionStorage.removeItem('adPopupClosed');
  window.addEventListener('beforeunload', clear);
  return () => window.removeEventListener('beforeunload', clear);
}, []);


  const handleClose = () => {
    setVisible(false); // flag already set above, but keep this for UX
  };

  if (!visible) return null;

  return (
    <div className="fixed left-4 right-4 bottom-4 z-[1000] bg-[#97d5c9] border shadow-xl p-3 sm:p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 animate-fadeIn max-w-[90vw] sm:max-w-5xl sm:ml-4 sm:mr-auto mx-auto">
      <Button onClick={handleClose} variant="outline" aria-label="Stäng" className="absolute top-2 right-2 sm:top-3 sm:right-3 text-[11px] sm:text-xs font-semibold uppercase tracking-wide hover:underline cursor-pointer">
        X
      </Button>

      <div className="relative w-full sm:basis-2/5 lg:basis-1/2 h-40 sm:h-48 lg:h-56 overflow-hidden">
        <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 uppercase tracking-wide">ANNONS</span>
        {logo?.sourceUrl ? (
          <Image src={logo.sourceUrl} alt={logo.altText || 'Logo'} fill className="object-cover bg-white" sizes="(min-width: 1024px) 50vw, (min-width: 640px) 40vw, 100vw" priority />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="font-bold text-gray-900 text-sm">{process.env.NEXT_PUBLIC_HOSTNAME}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <span className="block text-[11px] sm:text-xs tracking-wide uppercase text-gray-800/90 mb-1">Sparkonto</span>
          <h3 className="text-lg sm:text-2xl font-extrabold text-gray-900 leading-snug mb-1">
            Sparkontot som toppar jämförelsen – lås in upp till 2,9 % i sparränta
          </h3>
          <p className="text-sm sm:text-base text-gray-900/90 line-clamp-3">
            Få upp till 2,9 % i sparränta – tryggt med insättningsgaranti.
            Sparräntorna fortsätter att falla, men här hittar du kontot som ger
            högst ränta idag…
          </p>
        </div>
        <div className="mt-3 sm:mt-4 flex justify-end">
          <Link href="/advertisement" passHref>
            <Button className="px-6 py-2 text-sm sm:text-base font-semibold uppercase rounded-none bg-black text-white hover:bg-gray-800">
              Läs mer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
