import { getRecommendation } from "@/lib/graphql_queries/getPost";
import RecommendationRail from "../Postheader&footer/RecommendationRail";
import PostBodyShell from "../PostBodyShell";
import TableOfConet from "./TableOfContent";
import { ITOCItem, Post } from "@/lib/types";
import AdsenseAd from "@/app/adsGoogle";


export default async function PostBody({
  post,
  contentHtml,
  toc,
}: {
  post: Post;
  contentHtml: string;
  toc: ITOCItem[];
}) {  const featured = post.featuredImage?.node;
  const posts = await getRecommendation({ excludeSlug: post.slug, count: 8 });

  return (
  <>

    <PostBodyShell featured={featured}>
      <TableOfConet toc={toc} />

      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

       <AdsenseAd
            client="ca-pub-4868110039996635"
            slot="2219466628"
            format="auto"
        />
        
    </PostBodyShell>
      <div className="mt-10">
        <RecommendationRail posts={posts} />
      </div>
  </>
  );
}
// 2435089044