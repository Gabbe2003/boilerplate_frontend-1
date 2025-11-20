import { getRecommendation } from "@/lib/graphql_queries/getPost";
import RecommendationRail from "../Postheader&footer/RecommendationRail";
import PostBodyShell from "../PostBodyShell";
import TableOfConet from "./TableOfContent";
import { ITOCItem, Post } from "@/lib/types";


export default async function PostBody({
  post,
  contentHtml,
  toc,
}: {
  post: Post;
  contentHtml: string;
  toc: ITOCItem[];
}) {  const featured = post.featuredImage?.node;
  const posts = await getRecommendation({ excludeSlug: post.slug });

  return (
    <PostBodyShell featured={featured}>
      <TableOfConet toc={toc} />

      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

      <div className="mt-10">
        <RecommendationRail posts={posts} />
      </div>
    </PostBodyShell>
  );
}
