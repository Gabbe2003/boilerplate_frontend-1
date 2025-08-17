// Server Component (no "use client")
import { getViews } from '@/lib/graph_queries/getPostByPeriod';
import PopularNewsTickerClient from './Popular/featuredPostsTicker';

export type Item = {
  id: string;
  slug: string;
  title: string;
  date?: string;
  author_name?: string;
  featuredImage?: string | { node?: { sourceUrl?: string } };
};

export default async function PopularNewsTicker({
  intervalMs = 3000,
  className = '',
}: {
  intervalMs?: number; // <-- renamed
  className?: string;
}) {
  let items: Item[] = [];
  try {
    const posts = await getViews('month');
    items = (posts ?? []).slice(0, 12);
  } catch {
    items = [];
  }

  if (items.length === 0) {
    return (
      <div className={`w-full overflow-hidden border bg-secondary/40 p-3 ${className}`}>
        <div className="text-sm text-secondary-foreground">No popular posts for this month yet.</div>
      </div>
    );
  }

  return (
    <PopularNewsTickerClient
      items={items}
      intervalMs={intervalMs}   
      className={className}
    />
  );
}
