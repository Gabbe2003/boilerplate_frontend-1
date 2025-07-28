import { getViews } from "@/lib/graph_queries/getViews";
import PopularNews from "./MonthPouplarPosts";
import { ADS } from "../[slug]/components/adsSideBar";

// --- Helper utilities ---
function pickTwoUniqueAds(adsArray) {
  if (adsArray.length < 2) return [0, 0];
  const first = Math.floor(Math.random() * adsArray.length);
  let second = Math.floor(Math.random() * adsArray.length);
  while (second === first && adsArray.length > 1) {
    second = Math.floor(Math.random() * adsArray.length);
  }
  return [first, second];
}
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default async function Page() {
  const posts = await getViews("month");
  if (!posts.length) return <div>No fun posts!</div>;

  const mainPosts = posts.slice(0, 7).map(p => ({ ...p, type: "post" }));
  const [adIndex1, adIndex2] = pickTwoUniqueAds(ADS);
  const ad1 = { type: "ad", adIndex: adIndex1 };
  const ad2 = { type: "ad", adIndex: adIndex2 };
  const mixed = shuffleArray([...mainPosts, ad1, ad2]);

  return <PopularNews items={mixed} />;
}
