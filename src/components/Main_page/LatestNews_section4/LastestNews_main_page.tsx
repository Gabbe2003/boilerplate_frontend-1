import "server-only";
import dynamic from "next/dynamic";
import SectionBreaker from "@/components/SectionBreaker";

const LatestNewsInitial = dynamic(
  () => import("./_components/LatestNewsInitial"),
  { ssr: true }
);

const LatestNewsInfinite = dynamic(
  () => import("./_components/LatestNewsInfinite"),
  { ssr: true }
);

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
  <section className="w-full pt-[var(--section-spacing)] flex flex-col items-center bg-snow-white ">
    <div className="base-width-for-all-pages flex flex-col   ">
    <SectionBreaker />
       <h2 className="text-xl font-semibold mb-4 text-start">Senaste nyheterna</h2>

      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* FIRST 8 POSTS */}
        <div className="col-span-2 w-full">
          <LatestNewsInitial />
        </div>

        {/* SIDEBAR */}
        <div className="hidden lg:block col-span-1 w-full relative">
          <TradingViewWidget
            title="Kommande händelser"
            heights={{ base: 360, sm: 420, md: 500, lg: 560 }}
            className="rounded-md overflow-hidden border w-full"
          />
        </div>
      </div>

      {/* Full-width infinite scroll */}
      <div className=" w-full mt-10">
        <LatestNewsInfinite />
      </div>
    </div>
    </section>
  );
}
