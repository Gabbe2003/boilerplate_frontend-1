'use client';

import { useEffect, useState } from 'react';

export default function TagList() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await fetch('/api/tags');
        const data = await res.json();
        setTags(data.tags || []);
      } catch {
        setTags([]);
      }
      setLoading(false);
    }
    fetchTags();
  }, []);

  if (loading) return <span className="text-xs text-gray-400">Loading tags…</span>;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map(tag => (
        <span
          key={tag.id}
          className="px-3 py-1 rounded bg-gray-200 text-xs text-black"
        >
          {tag.name}
        </span>
      ))}
    </div>
  );
}
