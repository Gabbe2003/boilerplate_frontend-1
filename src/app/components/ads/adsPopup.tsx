'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';
import { Button } from '@/components/ui/button';

export default function AdPopup() {
  const [visible, setVisible] = useState(false);
  const { logo } = useAppContext();

  useEffect(() => {
    try {
      const closed = sessionStorage.getItem('adPopupClosed') === 'true';
      if (closed) {
        setVisible(false);
      } else {
        setVisible(true);
        sessionStorage.setItem('adPopupClosed', 'true');
      }
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    const clear = () => sessionStorage.removeItem('adPopupClosed');
    window.addEventListener('beforeunload', clear);
    return () => window.removeEventListener('beforeunload', clear);
  }, []);

  const handleClose = () => setVisible(false);

  if (!visible) return null;

  return (
      <div className="fixed left-4 right-4 bottom-4 z-[1000] relative bg-[#97d5c9] border shadow-xl p-3 sm:p-4 animate-fadeIn max-w-[90vw] sm:max-w-5xl sm:ml-4 sm:mr-auto mx-auto rounded-lg overflow-hidden">
      <Button
        onClick={handleClose}
        variant="outline"
        aria-label="Stäng"
        className="absolute top-2 right-2 sm:top-3 sm:right-3 h-8 w-8 p-0 text-xs font-semibold uppercase tracking-wide hover:underline cursor-pointer z-20"
      >
        ✕
      </Button>

      {/* Layout container for image + content */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {/* Image wrapper */}
        <div
          className="relative w-full aspect-[16/9] overflow-hidden rounded-md
                    sm:basis-1/3 sm:aspect-[4/3]
                    md:basis-2/5 md:aspect-[16/9]
                    lg:basis-1/2"
        >
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-1 uppercase tracking-wide z-10">
            ANNONS
          </span>

          {logo?.sourceUrl ? (
            <Image
              src={logo.sourceUrl}
              alt={logo.altText || 'Logo'}
              fill
              className="object-cover object-center bg-white"
              sizes="(min-width: 1024px) 50vw, (min-width: 640px) 33vw, 100vw"
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="font-bold text-gray-900 text-sm">
                {process.env.NEXT_PUBLIC_HOSTNAME}
              </span>
            </div>
          )}
        </div>

        {/* Copy + CTA */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <span className="block text-[11px] sm:text-[10px] tracking-wide uppercase text-gray-800/90 mb-1">
              Sparkonto
            </span>

            {/* Apply style change to h3 on mobile */}
            <h3
              className="text-base sm:text-sm md:text-2xl font-extrabold text-gray-900 leading-snug mb-1"
              style={{ margin: '0', fontSize: '1.25rem' }}
            >
              Sparkontot som toppar jämförelsen – lås in upp till 2,9 % i sparränta
            </h3>

            <p className="text-sm sm:text-xs md:text-base text-gray-900/90 line-clamp-3">
              Få upp till 2,9 % i sparränta – tryggt med insättningsgaranti.
              Sparräntorna fortsätter att falla, men här hittar du kontot som ger
              högst ränta idag…
            </p>
          </div>

          <div className="mt-3 sm:mt-3 flex justify-end">
            <Link href="/advertisement" passHref>
              <Button className="w-full sm:w-auto px-6 py-2 text-sm sm:text-xs md:text-base font-semibold uppercase rounded-none bg-black text-white hover:bg-gray-800">
                Läs mer
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
