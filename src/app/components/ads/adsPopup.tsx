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
    <div className="fixed left-2 right-4 bottom-4 z-[1000] bg-[#97d5c9] border shadow-xl p-3 sm:p-4 animate-fadeIn max-w-[90vw] sm:max-w-5xl sm:ml-4 sm:mr-auto mx-auto rounded-lg overflow-hidden">
      <Button
        onClick={handleClose}
        variant="outline"
        aria-label="Stäng"
        className="absolute top-2 right-2 sm:top-3 sm:right-3 h-8 w-8 p-0 text-xs font-semibold uppercase tracking-wide hover:underline cursor-pointer z-20"
      >
        ✕
      </Button>
      <div className="flex flex-row lg:flex-row items-stretch gap-3 sm:gap-4 mt-3 w-full">
       <div
          className="
            relative shrink-0 overflow-hidden rounded-md
            w-1/4 h-auto            /* phone: 25% width */
            sm:w-1/4 sm:h-32        /* tablet: also 25%, just taller */
            md:w-1/4 md:h-40        /* medium: 25%, a bit taller */
            lg:basis-1/3 lg:h-auto  /* large: 1/3 width */
            flex items-center justify-center bg-white
          "
        >
        <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-1 sm:px-2 py-1 uppercase tracking-wide z-10">
          ANNONS
        </span>


          {logo?.sourceUrl ? (
            <Image
              src={logo.sourceUrl}
              alt={logo.altText || 'Logo'}
              fill
              className="object-contain object-center bg-white"
              sizes="
                (min-width:1024px) 33vw,
                (min-width:768px) 25vw,
                (min-width:640px) 25vw,
                25vw
              "
              priority
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="font-bold text-gray-900 text-xs sm:text-sm">
                {process.env.NEXT_PUBLIC_HOSTNAME}
              </span>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between text-center sm:text-left">
          <div>
            <span className="block text-[11px] sm:text-[10px] tracking-wide uppercase text-gray-800/90 mb-1">
              Sparkonto
            </span>

            <h3
              className="text-sm sm:text-base md:text-2xl font-extrabold text-gray-900 leading-snug mb-1 line-clamp-2"
              style={{ margin: 0 }}
            >
              Sparkontot som toppar jämförelsen – lås in upp till 2,9 % i sparränta
            </h3>

            <p className="text-xs sm:text-sm md:text-base text-gray-900/90 line-clamp-3">
              Få upp till 2,9 % i sparränta – tryggt med insättningsgaranti.
              Sparräntorna fortsätter att falla, men här hittar du kontot som ger
              högst ränta idag…
            </p>
          </div>

          <div className="mt-2 sm:mt-3 flex justify-center sm:justify-end">
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
