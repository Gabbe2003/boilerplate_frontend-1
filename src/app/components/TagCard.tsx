import { getAllTags } from "@/lib/graph_queries/getAllTags";

interface Props {
  id: number, 
  name: string
}

export default async function TagList(){
  const tags = await getAllTags();

  if (!tags) return <span className="text-xs text-gray-400">Loading tags…</span>;

  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag : Props) => (
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
