import "server-only";
import dynamic from "next/dynamic";

// Lazy load both client components
const FetchLatestNew = dynamic(() => import("./_components/FetchLatestNew"), {
  ssr: true, 
  loading: () => (
    <div className="flex justify-center items-center py-10 text-gray-500 text-sm">
      Laddar nyheter...
    </div>
  ),
});

const TradingViewWidget = dynamic(
  () => import("@/components/Sidebar/Connections/TradingViewWidget"),
  {
    ssr: true,
    loading: () => (
      <div className="flex justify-center items-center py-10 text-gray-500 text-sm border rounded-md">
        Laddar händelser...
      </div>
    ),
  }
);

export default async function LatestNews_main_page() {
  return (
    <section className="w-full mt-10 flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4">Senaste nyheterna</h2>

      <div className="base-width-for-all-pages grid grid-cols-1 lg:grid-cols-3 gap-6 ">
        {/* Main news section */}
        <div className="col-span-2 w-full">
          <FetchLatestNew />
        </div>

        {/* Sidebar widget */}
      <div className="hidden lg:block col-span-1 w-full relative">
        <TradingViewWidget
          title="Kommande händelser"
          heights={{ base: 360, sm: 420, md: 500, lg: 560 }}
          className="rounded-md overflow-hidden border w-full"
        />
      </div>
      </div>
    </section>
  );
}
