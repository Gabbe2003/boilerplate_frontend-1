import "server-only"

import PopularPosts_main_page from "../components/Main_page/Popular_posts_section1/PopularPosts_main_page";
import CategorySection_main_page from "../components/Main_page/Category_section2/CategorySection_main_page";
import LatestNews_main_page from "@/components/Main_page/LatestNews_section3/LastestNews_main_page";
import SeoText from "@/lib/seo/SeoText";
import RulePopUp from "@/components/Ads/NewsLetter/AdsPopup";
import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import ReadPeakProvider from "@/components/Ads/Ads/Readpeak/ReadProvider";
import ReadPeak from "@/components/Ads/Ads/Readpeak/ReadPeak";


export async function generateMetadata() {
  const { metadata } = await getWpSeo("/");
  return metadata;
}


export default async function Home() {
  const { jsonLd } = await getWpSeo("/");

  return(
    <div>
      <h1>Dina dagliga nyheter inom finans, aktier och börsen</h1>
      {/* Section 1 */}
      <ReadPeakProvider />
      {/* <ReadPeak numberOfAds={1} /> */}
      
      <PopularPosts_main_page /> 

      {/* Section 2 */}
      <CategorySection_main_page /> 

      {/* Section 3 */}
      <LatestNews_main_page />

      {/* Seciton */}
      {/* <RulePopUp /> */}
      <SeoText />
      <SeoJsonLd data={jsonLd} />
    </div>
  )
}
