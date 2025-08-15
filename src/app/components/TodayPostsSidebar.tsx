import clsx from "clsx";
import Link from "next/link";
import { getTodaysPosts } from "./todaysPosts";
import TradingViewTickerTape from "./TradingViewTicker";

type Props = {
  heading?: string;
};

type Post = {
  id: string | number;
  title: string;
  date?: string;
  excerpt?: string;
  slug?: string;
  uri?: string;
  category?: string;
  categories?: Array<{ name?: string }>;
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
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function getCategory(p: Post): string {
  if (p.category) return p.category;
  const first = p.categories?.find(c => !!c?.name)?.name;
  return first ?? "";
}

export default async function TodayPostsSidebar({
  heading = "Today’s Posts",
}: Props) {
  let posts: Post[] = [];
  try {
    posts = await getTodaysPosts(5);
  } catch {
    posts = [];
  }

  return (
    <div
      className={clsx(
        "transition-all duration-500 overflow-hidden",
        "bg-[#ffff]"
      )}
    >
      <div className="rounded-sm">
        <div className="p-3 space-y-4 flex flex-col items-start rounded-sm">
          <section className="w-full bg-muted flex flex-col">
            <h2 className="text-base font-semibold flex items-center">
              <span className="relative inline-flex h-2.5 w-2.5">
              </span>
              {heading}
            </h2>

            <div className="rounded-md overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm">
              <TradingViewTickerTape />
            </div>

            {posts.length === 0 ? (
              <div className="text-sm text-zinc-600 dark:text-black-300">
                No posts yet today.
              </div>
            ) : (
              <ul className="space-y-3 w-full">
                {posts.map((p) => {
                  const date = formatDateStockholm(p.date);
                  const excerpt = truncate(stripHtml(p.excerpt), 70);
                  const category = getCategory(p);

                  return (
                    <li
                      key={p.id}
                      className="group bg-white dark:bg-black-800 rounded-sm p-3 shadow-sm hover:shadow-sm transition-shadow flex items-start gap-2"
                    >
                      {/* Red pulsing dot */}
                      <span className="relative inline-flex flex-shrink-0 h-2.5 w-2.5 mt-1">
                        <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-red-500 opacity-75 animate-ping" />
                        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-600" />
                      </span>

                      <Link
                        href={`/${p.slug}`}
                        className="block flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
                      >
                        {(category || date) && (
                          <div className="text-xs text-red-700 flex items-center gap-1">
                            {category && (
                              <span className="font-medium">{category}</span>
                            )}
                            {category && date && <span aria-hidden>•</span>}
                            {date && <span>{date}</span>}
                          </div>
                        )}

                        {/* Reduced top margin here */}
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
  );
}
