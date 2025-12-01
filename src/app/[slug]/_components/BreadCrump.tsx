import { handleSpecielChar } from "@/lib/globals/actions";
import Link from "next/link";

export type Crumb = { text: string; url: string };

type BreadCrumpProps = {
  breadcrumbs?: Crumb |  null;
  title?: string | null
};

export default function BreadCrump({ breadcrumbs, title }: BreadCrumpProps) {
  const raw: Crumb[] = Array.isArray(breadcrumbs)
    ? breadcrumbs
    : breadcrumbs
    ? [breadcrumbs]
    : [];

  if (!Array.isArray(raw) || raw.length <= 1) return null;

  const items = raw.slice(1);

  return (
    <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${crumb.url}-${i}`} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden> / </span>}
              {isLast ? (
                <span className="text-gray-900 text-xs sm:text-base" aria-current="page">
                  {title || crumb.text}
                </span>
              ) : (
                <Link href={`category/${handleSpecielChar(crumb.text)}`} prefetch={false} className="hover:underline text-xs sm:text-base">
                  {crumb.text}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
