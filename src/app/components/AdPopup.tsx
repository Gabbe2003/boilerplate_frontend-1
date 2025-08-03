'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdPopup() {
  const [visible, setVisible] = useState(false);

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
    <div className="
      fixed left-4 bottom-4 z-[1000]
      w-[80vw] max-w-5xl
      bg-white/80 backdrop-blur-md
      border rounded-2xl shadow-xl p-6 flex gap-6 items-center
      animate-fadeIn
    ">
      <button
        className="absolute top-4 right-4 text-gray-400 hover:text-black"
        onClick={handleClose}
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="flex-shrink-0 w-48 h-48 relative rounded-xl overflow-hidden bg-gray-200">
        <Image
          src="/your-ad-image.jpg"
          alt="Ad"
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-xl"
          sizes="192px"
        />
      </div>
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          Discover Amazing Deals!
        </h3>
        <p className="text-base text-gray-700 mb-4 line-clamp-3">
          Save big on our latest products. Click to learn more and unlock exclusive offers!
        </p>
        <div className="flex-1" />
        <div className="w-full flex justify-end">
          <Link href="/advertisement" legacyBehavior passHref>
            <button
              className="px-6 py-2 bg-blue-700 text-white text-base font-semibold rounded-lg hover:bg-blue-900 transition"
            >
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
