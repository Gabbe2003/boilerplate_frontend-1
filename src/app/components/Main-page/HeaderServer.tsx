// app/components/Main-page/HeaderServer.tsx (RSC)
import Header from './Header';
import { getAllCategories } from '@/lib/graph_queries/getAllCategories';

export default async function HeaderServer() {
  // uses the caching you set inside getAllCategories (revalidate/tags)
  const initialCategories = await getAllCategories();
  return <Header initialCategories={initialCategories} />;
}
