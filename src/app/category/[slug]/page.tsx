// app/categories/page.tsx

import { getAllCategories } from "@/lib/graph_queries/getAllCategories";
import Link from "next/link";

export default async function CategoriesPage() {
  let categories: any[] = [];
  try {
    categories = await getAllCategories();
  } catch (e) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Categories</h1>
        <p className="text-red-500">Failed to load categories.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>
      {categories.length === 0 ? (
        <p>No categories found.</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="border p-4 rounded-xl shadow hover:shadow-md transition"
            >
              <Link href={`/categories/${cat.slug}`}>
                <span className="text-xl font-semibold hover:underline">
                  {cat.name}
                </span>
              </Link>
              <div className="text-sm text-gray-500">{cat.slug}</div>
              {cat.description && (
                <div className="mt-1">{cat.description}</div>
              )}
              {cat.parent?.node && (
                <div className="text-xs text-gray-400 mt-1">
                  Parent: {cat.parent.node.name}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Posts: {cat.count}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
