"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { ADS } from "../ads/adsContent";
import { Button } from "@/components/ui/button";
import AdRotator from "@/app/components/ads/AdRotator";
import PopupModal from "../Rule_sub";

export function Sidebar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const AD_ROTATE_INTERVAL = 15000;
  const adsLen = ADS.length;
  const initialIndex = useMemo(
    () => (adsLen > 0 ? Math.floor(Date.now() / AD_ROTATE_INTERVAL) % adsLen : 0),
    [adsLen]
  );

  // Shared index that advances every interval
  const [sharedIndex, setSharedIndex] = useState(initialIndex);

  useEffect(() => {
    if (adsLen <= 1) return; // nothing to rotate if 0 or 1 ad
    const id = setInterval(() => {
      setSharedIndex((i) => (i + 1) % adsLen);
    }, AD_ROTATE_INTERVAL);
    return () => clearInterval(id);
  }, [adsLen]);

  // Top shows sharedIndex, Middle shows the next one
  const topIndex = sharedIndex % Math.max(adsLen, 1);
  const middleIndex = adsLen > 1 ? (sharedIndex + 1) % adsLen : topIndex;

  const handleOpenNewsletter = useCallback(() => setIsModalOpen(true), []);
  const handleCloseNewsletter = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <div
        className={clsx(
          "transition-all duration-500 overflow-hidden",
          "bg-[var(--secBG)]"
        )}
      >
        <div className="p-0">
          <div className="p-3 space-y-4 flex flex-col items-start">

            {/* 🔝 Top Ad: exactly one ad */}
            {adsLen > 0 && (
              <section className="w-full p-3 bg-muted">
                <AdRotator
                  // single-item array → displays just one ad
                  ads={[ADS[topIndex]]}
                  intervalMs={AD_ROTATE_INTERVAL} // irrelevant with single item, but fine to keep
                  initialIndex={0}
                />
              </section>
            )}

            {/* Newsletter CTA */}
            <section className="w-full p-3 bg-muted flex flex-col gap-2">
              <span className="text-sm font-medium">
                Want to get noticed by over 20,000 users? Reach out to us and
                feature your brand in our newsletter!
              </span>
              <Button asChild size="default" className="text-[#fcf6f0] bg-black w-full">
                <Link href="/advertisement">Advertise Now</Link>
              </Button>
            </section>

            {/* Middle Ad: exactly one ad, guaranteed different from top */}
            {adsLen > 1 ? (
              <section className="w-full">
                <AdRotator
                  ads={[ADS[middleIndex]]}
                  intervalMs={AD_ROTATE_INTERVAL}
                  initialIndex={0}
                />
              </section>
            ) : null}

            {/* Subscribe Section */}
            <section className="w-full p-3 flex flex-col gap-2">
              <span className="text-sm font-medium">DAILY NEWS IN YOUR INBOX!</span>
              <span className="text-sm font-medium">
                Receive daily news with the most recent updates.
              </span>
              <Button
                className="bg-black text-[#fcf6f0] w-full"
                size="default"
                onClick={handleOpenNewsletter}
              >
                Subscribe Now
              </Button>
            </section>
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      <PopupModal isOpen={isModalOpen} onClose={handleCloseNewsletter} />
    </>
  );
}
