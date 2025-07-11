import TocCard from "./TableOfContent";
import type { TOCItem } from "../page";

export default function PostTOC({ toc }: { toc: TOCItem[] }) {
  // You could add extra logic or effects here if you wish!
  return (
    <div className="hidden lg:block">
      <TocCard toc={toc} />
    </div>
  );
}
