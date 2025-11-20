import "server-only";
import { Suspense } from "react";

import PopularPosts_main_page from "../components/Main_page/Popular_posts_section1/PopularPosts_main_page";
import CategorySection_main_page from "../components/Main_page/Category_section2/CategorySection_main_page";
import LatestNews_main_page from "@/components/Main_page/LatestNews_section4/LastestNews_main_page";
import SeoText from "@/lib/seo/SeoText";
import RecommendFromCategory from "@/components/Main_page/RecommendFromCategory3/RecommendFromCategory";

import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";

export async function generateMetadata() {
  const { metadata } = await getWpSeo("/");
  return metadata;
}

export default async function Home() {
  const { jsonLd } = await getWpSeo("/");

  return (
    <div className="w-full mt-10">
      <div className="w-full flex justify-center">
        <h1 className="base-width-for-all-pages text-center text-base lg:text-3xl md:text-2xl sm:text-base">
          Dina dagliga nyheter inom finans, aktier och börsen
        </h1>
      </div>

      {/* Immediately streamed */}
      <PopularPosts_main_page />
      <CategorySection_main_page />

      <Suspense fallback={<div>Laddar rekommendationer…</div>}>
        <RecommendFromCategory />
      </Suspense>

      <Suspense fallback={<div>Laddar senaste nyheterna…</div>}>
        <LatestNews_main_page />
      </Suspense>

      <Suspense fallback={<div>Laddar SEO-text…</div>}>
        <SeoText />
      </Suspense>

      <SeoJsonLd data={jsonLd} />
    </div>
  );
}
