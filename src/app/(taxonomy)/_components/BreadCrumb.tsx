import Link from "next/link";

interface BreadcrumbProps {
  /** Either "author" or "category" */
  type: "author" | "category";
  /** Optional: the name of the current author or category */
  name?: string | null;
}

/**
 * Displays breadcrumb navigation:
 * home / author / authorName
 * home / category / categoryName
 *
 * If name is not provided:
 * home / author
 * home / category
 */
export default function Breadcrumb({ type, name }: BreadcrumbProps) {
  const basePath = `/${type}`;
  const label =
    type === "author" ? "author" : type === "category" ? "category" : "";

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

        <li>
          <span className="text-muted-foreground">/</span>
        </li>

        {/* Author or Category */}
        <li>
          <Link
            href={basePath}
            className="hover:text-foreground transition-colors"
          >
            {label}
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
              {name}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}
