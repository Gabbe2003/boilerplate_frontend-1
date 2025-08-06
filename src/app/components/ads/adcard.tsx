import { Ad } from './adsContent';

export function AdCard({ ad }: { ad: Ad }) {
  if (ad.script) {
    return (
      <div className="w-full flex flex-col items-stretch overflow-hidden">
        <span className="block text-xs font-semibold text-neutral-500 px-3 py-1 uppercase tracking-wide w-full text-center">
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
