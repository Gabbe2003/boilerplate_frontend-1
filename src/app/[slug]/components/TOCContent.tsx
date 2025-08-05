import { ITOCItem } from '@/lib/types';
import { TocCard } from './TableOfContent';

export function PostTOC({ toc }: { toc: ITOCItem[] }) {
  return (
    <div className="hidden lg:block">
      <TocCard toc={toc} />
    </div>
  );
}
