import "server-only";
import { cache, Suspense } from "react";

import PopularPosts_main_page from "../components/Main_page/Popular_posts_section1/PopularPosts_main_page";
import CategorySection_main_page from "../components/Main_page/Category_section2/CategorySection_main_page";
import LatestNews_main_page from "@/components/Main_page/LatestNews_section4/LastestNews_main_page";
import SeoText from "@/lib/seo/SeoText";
import RecommendFromCategory from "@/components/Main_page/RecommendFromCategory3/RecommendFromCategory";

import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import ReadPeakProvider from "@/components/Ads/Ads/Readpeak/ReadProvider";
import AdsenseInFeed from "./adsGoogle";

const getSeoCached = cache(async (uri: string) => {
  return getWpSeo(uri, true);
});


export async function generateMetadata() {
  const { metadata } = await getSeoCached("/");
  return metadata;
}

export default async function Home() {
  const { jsonLd } = await getSeoCached("/");

  return (
    <div className="w-full mt-5">
    <ReadPeakProvider />
      <PopularPosts_main_page />

     {/* <div
  style={{
    display: "flex",
    justifyContent: "center",
    padding: "10px 0",
    margin: "20px 0",
  }}
>
  <div style={{ width: "80%", maxWidth: 1100, margin: "0 auto" }}>
    <AdsenseInFeed client="ca-pub-4868110039996635" slot="7924586422" />
  </div>
</div> */}
      <Suspense fallback={<div>Laddar Kategorier</div>}>
        <CategorySection_main_page />
      </Suspense>
         
      <Suspense fallback={<div>Laddar rekommendationer…</div>}>
        <RecommendFromCategory />
      </Suspense>
        
      <Suspense fallback={<div>Laddar senaste nyheterna…</div>}>
        <LatestNews_main_page />
      </Suspense>
   
      <Suspense fallback={<div>Laddar text…</div>}>
        <SeoText />
      </Suspense>
 
      <SeoJsonLd data={jsonLd} />
    </div>
  );
}
