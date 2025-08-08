'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/store/AppContext';

export default function AdPopup() {
  const [visible, setVisible] = useState(true);
  const {logo} = useAppContext(); 

  useEffect(() => {
    if (typeof window !== "undefined") {
      const closed = sessionStorage.getItem('adPopupClosed');
      if (!closed) setVisible(true);
    }
  }, []);

  const handleClose = () => {
    setVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem('adPopupClosed', 'true');
    }
  };

  if (!visible) return null;

  return (
    <div
      className="
        fixed left-4 right-4 bottom-4 z-[1000]
        bg-white/80 backdrop-blur-md
        border shadow-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-center
        animate-fadeIn
        max-w-[90vw] sm:max-w-5xl sm:ml-4 sm:mr-auto mx-auto
      "
    >
      <button
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-black"
        onClick={handleClose}
        aria-label="Close"
      >
        <X className="w-5 h-5 sm:w-6 sm:h-6 hover:cursor-pointer" />
      </button>

      <div className="w-full sm:w-32 h-24 mt-3 sm:h-48 relative rounded-xl overflow-hidden bg-gray-200">
        {logo?.sourceUrl ? (
          <Image
            src={logo.sourceUrl}
            alt={logo.altText || 'Logo'}
            fill // This makes the image absolutely fill its parent
            className="object-cover rounded bg-white"
            sizes="100vw" // helps with responsive images
            priority={true} // or true, if this should be LCP
          />
        ) : (
          <span className="font-bold text-gray-900 text-base">
            {process.env.NEXT_PUBLIC_HOSTNAME}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
          Discover Amazing Deals!
        </h3>
        <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 line-clamp-3">
          Save big on our latest products. Click to learn more and unlock exclusive offers!
        </p>
        <div className="flex-1" />
        <div className="w-full flex justify-end">
          <Link href="/advertisement" passHref>
            <button className="px-5 py-2 sm:px-6 bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg hover:bg-blue-900 transition hover:cursor-pointer">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
