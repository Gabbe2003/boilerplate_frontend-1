// app/api/categories/route.ts
import { getAllCategories } from '@/lib/graph_queries/getAllCategories';
export async function GET() {
  const categories = await getAllCategories();
  return Response.json({ categories });
}
