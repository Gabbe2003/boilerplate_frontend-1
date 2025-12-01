// app/(whatever)/category-sections/page.tsx
import "server-only"

import { get_all_categories_by_name } from '@/lib/graphql_queries/getCategories';
import CategorySections from './_components/CategorySections';
import type { Category_names } from '@/lib/types';

export default async function CategorySection_main_page() {
  const getAllCategories: Category_names[] = await get_all_categories_by_name();
  return (
    <div className="section2-border-theme pt-[var(--section-spacing)] pb-[var(--section-spacing)]">
      <div className="mx-auto w-full">
        <div className="flex flex-col items-center justify-center gap-6">
          <section className="min-w-0 base-width-for-all-pages ">
            <CategorySections getAllCategories={getAllCategories} />
          </section>
        </div>
      </div>
    </div>
  );
}
