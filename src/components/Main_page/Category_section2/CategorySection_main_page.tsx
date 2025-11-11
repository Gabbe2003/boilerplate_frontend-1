// app/(whatever)/category-sections/page.tsx
import "server-only"

import { get_all_categories_by_name } from '@/lib/graphql_queries/getCategories';
import CategorySections from './_components/CategorySections';
import type { Category_names } from '@/lib/types';

export default async function CategorySection_main_page() {
  const getAllCategories: Category_names[] = await get_all_categories_by_name();
  return (
    <div className="bg-[var(--firstBG)] mt-15">
      <div className="mx-auto w-full py-6">
        <div className="grid grid-cols-1 gap-6">
          <section className="min-w-0">
            <CategorySections getAllCategories={getAllCategories} />
          </section>
        </div>
      </div>
    </div>
  );
}
