import { ITOCItem } from "@/lib/types";
import TocCard from "./TableOfContent";
 
export default function PostTOC({ toc }: { toc: ITOCItem[] }) {
  // You could add extra logic or effects here if you wish!
  return (
    <div className="hidden lg:block">
      <TocCard toc={toc} />
    </div>
  );
}
