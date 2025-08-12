import clsx from 'clsx';
import Link from 'next/link';
import { ADS } from '../ads/adsContent'; 
import { Button } from '@/components/ui/button';
import AdRotator from '@/app/components/ads/AdRotator';

export function Sidebar() {
  const AD_ROTATE_INTERVAL = 15000;
  const initialIndex = ADS.length > 0 ? Math.floor(Date.now() / AD_ROTATE_INTERVAL) % ADS.length : 0;

  return (
    <>
      <div
        className={clsx(
          'transition-all duration-500 overflow-hidden',
          'bg-[var(--secBG)]',
        )}
      >
        <div className="p-0">
          <div className="p-3 space-y-4 flex flex-col items-start">
            <section className="w-full p-3 bg-muted flex flex-col gap-2">
              <span className="text-sm font-medium">
                Want to get noticed by over 20,000 users? Reach out to us and feature your brand in our newsletter!
              </span>
              <Button asChild size="default" className="text-[#fcf6f0] bg-black w-full">
                <Link href="/advertisement">Advertise Now</Link>
              </Button>
            </section>

            <AdRotator ads={ADS} intervalMs={AD_ROTATE_INTERVAL} initialIndex={initialIndex} />

            <section className="w-full p-3 flex flex-col gap-2">
              <span className="text-sm font-medium">DAILY NEWS IN YOUR INBOX!</span>
              <span className="text-sm font-medium">
                Receive daily news with the most recent updates.
              </span>
              <Button asChild className="bg-black text-[#fcf6f0] w-full" size="default">
                <Link href="/subscribe?src=sidebar">Subscribe Now</Link>
              </Button>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
