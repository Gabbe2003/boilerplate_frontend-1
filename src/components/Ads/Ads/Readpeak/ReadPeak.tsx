'use client';

import { ReadPeakSlot } from './ReadPeakSlot';

interface ReadPeakProps {
  numberOfAds?: number;
  className?: string;
  hideDescription?: boolean;
  descriptionSelectors?: string[];
}

export default function ReadPeak({
  numberOfAds = 1,
  className,
  hideDescription = false,
  descriptionSelectors,
}: ReadPeakProps) {
  return (
    <div className={`${className || ''}`}>
      <ReadPeakSlot
        id={'90924881c10805b4'}
        numberOfAds={numberOfAds}
        className="w-full "
        hideDescription={hideDescription}
        descriptionSelectors={descriptionSelectors}
      />
    </div>
  );
}
