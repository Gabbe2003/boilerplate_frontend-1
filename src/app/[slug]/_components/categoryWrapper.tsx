import CategorySections from "@/app/components/categories/CategoryFeed";
import TodayPostsSidebar from "@/app/components/TodayPostsSidebar";

export default function CatsPage() {
  return (
    <div className="w-full px-2 lg:w-[70%] mx-auto py-6 flex flex-col lg:flex-row lg:items-start gap-4">
      {/* Main content - 70% width */}
      <section className="w-full lg:w-[70%]">
        <CategorySections />
      </section>

      {/* Sidebar - 30% width, no forced height */}
      <aside className="w-full lg:w-[30%] lg:py-50">
        <TodayPostsSidebar heading="Today’s Posts" />
      </aside>
    </div>
  );
}
