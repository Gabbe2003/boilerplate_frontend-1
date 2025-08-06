import { Ad } from './adsContent';

export function AdCard({ ad }: { ad: Ad }) {
  if (ad.script) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center overflow-hidden">
        <div
          className="flex-1 w-full h-full flex items-center justify-center overflow-hidden"
          style={{ padding: 0 }}
          dangerouslySetInnerHTML={{ __html: ad.script }}
        />
      </div>
    );
  }
  return null;
}
