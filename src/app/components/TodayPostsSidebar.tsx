import clsx from "clsx";
import Link from "next/link";
import { getTodaysPosts } from "./todaysPosts";

type Props = {
  /** Optional heading text */
  heading?: string;
};

type Post = {
  id: string | number;
  title: string;
  date?: string;
  excerpt?: string;
  slug?: string;
  uri?: string;
};

function stripHtml(input?: string): string {
  if (!input) return "";
  return input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function truncate(s: string, n = 140) {
  if (s.length <= n) return s;
  return s.slice(0, n - 1) + "…";
}

function formatDateStockholm(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Stockholm",
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(d);
}

// Server Component (no "use client")
export default async function TodayPostsSidebar({
  heading = "Today’s Posts",
}: Props) {
  // Force limit to 5
  let posts: Post[] = [];
  try {
    posts = await getTodaysPosts(5);
  } catch {
    posts = [];
  }

  return (
    <>
      <div
        className={clsx(
          "transition-all duration-500 overflow-hidden",
          "bg-[var(--secBG)]"
        )}
      >
        <div>
          <div className="p-3 space-y-4 flex flex-col items-start">
            <section className="w-full p-3 bg-muted flex flex-col gap-3 rounded-md">
              <h2 className="text-base font-semibold">{heading}</h2>

              {posts.length === 0 ? (
                <div className="text-sm text-zinc-600 dark:text-black-300">
                  No posts yet today.
                </div>
              ) : (
                <ul className="space-y-3 w-full">
                  {posts.map((p) => {
                    const date = formatDateStockholm(p.date);
                    const excerpt = truncate(stripHtml(p.excerpt), 40);
                    return (
                      <li
                        key={p.id}
                        className="group bg-white dark:bg-black-800 rounded-md p-3 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <Link
                          href={p.uri || `/posts/${p.slug}`}
                          className="block focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
                        >
                          {date && (
                            <div className="text-xs text-black-500">{date}</div>
                          )}
                          <div className="mt-0.5 font-medium leading-snug group-hover:underline">
                            {p.title}
                          </div>
                          {excerpt && (
                            <p className="mt-1 text-sm text-black-600 dark:text-black-300">
                              {excerpt}
                            </p>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
