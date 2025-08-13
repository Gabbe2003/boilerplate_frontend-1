// components/TodayPostsSidebar.tsx
import Link from "next/link";
import { getTodaysPosts } from "./todaysPosts";

type Props = {
  /** Max posts to show in the sidebar */
  limit?: number;
  /** Optional heading text */
  heading?: string;
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

export default async function TodayPostsSidebar({
  limit = 8,
  heading = "Today’s Posts",
}: Props) {
  // getTodaysPosts already accepts a limit
  const posts = await getTodaysPosts(limit);

  return (
    <aside className="flex flex-col w-full md:w-80 lg:w-96 border rounded-xl p-4 bg-white/50 dark:bg-zinc-900/50">
      <h2 className="text-lg font-semibold mb-3">{heading}</h2>

      {posts.length === 0 ? (
        <div className="text-sm text-zinc-500">No posts yet today.</div>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => {
            const date = formatDateStockholm(p.date);
            const excerpt = truncate(stripHtml(p.excerpt));
            return (
              <li key={p.id} className="group">
                <Link
                  href={p.uri || `/posts/${p.slug}`}
                  className="block focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg"
                >
                  <div className="text-sm text-zinc-500">{date}</div>
                  <div className="mt-0.5 font-medium leading-snug group-hover:underline">
                    {p.title}
                  </div>
                  {excerpt && (
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300 line-clamp-3">
                      {excerpt}
                    </p>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
