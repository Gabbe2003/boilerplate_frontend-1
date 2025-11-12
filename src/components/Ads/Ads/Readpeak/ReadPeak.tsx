'use client';

import { ReadPeakSlot } from './ReadPeakSlot';

interface ReadPeakProps {
  numberOfAds?: number;
  className?: string;
}

export default function ReadPeak({
  numberOfAds = 4,
  className,
}: ReadPeakProps) {
  return (
    <div className={`${className || ''}`}>
      <ReadPeakSlot id={'90924881c10805b4'} numberOfAds={numberOfAds} className="w-full" />
    </div>
  );
}
