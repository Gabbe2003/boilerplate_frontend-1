import CategorySections from "@/app/components/categories/CategoryFeed";
import TodayPostsSidebar from "@/app/components/TodayPostsSidebar";

export default function CatsPage() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Main content */}
        <section className="lg:col-span-8 min-w-0">
          <CategorySections />
        </section>

        {/* Sidebar */}
        <aside className="lg:col-span-4 min-w-0 lg:sticky lg:py-50">
          <TodayPostsSidebar />
        </aside>
      </div>
    </div>
  );
}
