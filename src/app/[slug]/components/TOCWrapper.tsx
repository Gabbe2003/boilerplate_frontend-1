import { ITOCItem } from '@/lib/types';
import { TocCard } from './TOCCard';

export function PostTOC({ toc }: { toc: ITOCItem[] }) {
  return (
    <div className="hidden lg:block">
      <TocCard toc={toc} />
    </div>
  );
}
