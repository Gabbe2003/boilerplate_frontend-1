// AdCard.tsx
import { Ad } from './adsSideBar';

export function AdCard({ ad }: { ad: Ad }) {
  if (ad.script) {
    return (
      <div className="w-full rounded-lg border bg-white shadow flex flex-col items-stretch overflow-hidden ad-responsive">
        <span className="block text-xs font-semibold text-neutral-500 bg-neutral-100 px-3 py-1 border-b border-neutral-200 uppercase tracking-wide">
          Advertising cooperation
        </span>
        <div
          className="w-full flex-1 flex justify-center items-center"
          style={{ padding: 0 }}
          dangerouslySetInnerHTML={{ __html: ad.script }}
        />
      </div>
    );
  }
  return null;
}
