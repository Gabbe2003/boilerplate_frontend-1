'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { ADS } from '../../components/ads/adsContent';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PopupModal from '@/app/components/Rule_sub';
import { AdCard } from '@/app/components/ads/adcard';

export function Sidebar() {
  const [adIndex, setAdIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const AD_ROTATE_INTERVAL = 15000;

  useEffect(() => {
    const interval = setInterval(() => {
      setAdIndex((i) => (i + 1) % ADS.length);
    }, AD_ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        className={clsx(
          'transition-all duration-500 overflow-hidden',
          'bg-[var(--secBG)]',
          // Optional: add custom rounded corners or padding if you like
          // 'rounded-2xl p-3'
        )}
      >
        <div className="p-0">
          <div className="p-3 space-y-4 flex flex-col items-start">
            {/* Announcement/Call-to-Action */}
            <section className="w-full p-3 bg-muted flex flex-col gap-2">
              <span className="text-sm font-medium">
                Want to get noticed by over 20,000 users? Reach out to us and feature your brand in our newsletter!
              </span>
              <Button asChild size="default" className="text-[#fcf6f0] bg-black w-full">
                <Link href="/advertisement">Advertise Now</Link>
              </Button>
            </section>

            <AdCard ad={ADS[adIndex]} />

            {/* Daily News Modal Button */}
            <section className="w-full p-3 flex flex-col gap-2">
              <span className="text-sm font-medium">
                DAILY NEWS IN YOUR INBOX!
              </span>
              <span className="text-sm font-medium">
                Receive daily news with the most recent updates.
              </span>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-black text-[#fcf6f0] w-full"
                size="default"
              >
                Subscribe Now
              </Button>
            </section>

            {/* Second Ad */}
            <AdCard ad={ADS[(adIndex + 1) % ADS.length]} />
          </div>
        </div>
      </div>

      {/* Modal */}
      <PopupModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
