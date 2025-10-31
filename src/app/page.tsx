import PopularPosts_main_page from "../components/Main_page/Popular_posts_section1/PopularPosts_main_page";
import CategorySection_main_page from "../components/Main_page/Category_section2/CategorySection_main_page";
import LatestNews_main_page from "@/components/Main_page/LatestNews_section3/LastestNews_main_page";
import SeoText from "@/lib/seo/SeoText";

export default async function Home() {
  return(
    <div>
      {/* Section 1 */}
      <PopularPosts_main_page /> 
      
      {/* Section 2 */}
      <CategorySection_main_page /> 

      {/* Section 3 */}
      <LatestNews_main_page />

      <SeoText />
    </div>
  )
}
