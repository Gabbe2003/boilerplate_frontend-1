import Link from "next/link";

interface BreadcrumbProps {
  /** Either "author" or "category" */
  type: "author" | "category";
  /** Optional: the name of the current author or category */
  name?: string | null;
}

/**
 * Displays breadcrumb navigation:
 * home / authorName
 * home / categoryName
 *
 * If name is not provided:
 * home
 */
export default function Breadcrumb({ type, name }: BreadcrumbProps) {

  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-8 text-sm text-muted-foreground"
    >
      <ol className="flex flex-wrap items-center gap-1 sm:gap-2">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors">
            Hem
          </Link>
        </li>

        {name && (
          <>
            <li>
              <span className="text-muted-foreground">/</span>
            </li>
            <li
              aria-current="page"
              className="font-medium text-foreground capitalize"
            >
              <div
                className="hover:text-foreground transition-colors"
              >
                {name}
              </div>
            </li>
          </>
        )}
      </ol>
    </nav>
  )
}
