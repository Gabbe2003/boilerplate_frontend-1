// app/components/Main-page/HeaderServer.tsx (RSC)
import { getAllCategories } from '@/lib/graph_queries/getCategory';
import Header from './Header';

export default async function HeaderServer() {
  
  // uses the caching you set inside getAllCategories (revalidate/tags)
  const initialCategories = await getAllCategories();
  return <Header initialCategories={initialCategories} />;
}
