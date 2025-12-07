import "server-only";

import BreadCrump from "./BreadCrump";
import PostHero from "./_post/PostHero";
import PostBody from "./_post/PostBody";
import { PostShell } from "./PostShell";
import PostFeed from "./InfinityScroll/PostFeed";
import { randomIntInclusive } from "@/lib/globals/actions";
import { getPostSlugs } from "@/lib/graphql_queries/getPost";
import { ITOCItem, Post } from "@/lib/types";
import { updateViewedPost } from "@/lib/graphql_queries/updated_view";
import AdsenseAd from "@/app/adsGoogle";


type SinglePostProps = {
  post: Post;
  currentSlug: string;
  toc: ITOCItem[];
  updatedHtml: string;
};

export default async function SinglePost({
  post,
  currentSlug,
  toc,
  updatedHtml,
}: SinglePostProps) {

  const breadcrumbs = post.seo?.breadcrumbs;
  const R = randomIntInclusive(10, 50);
  const H = 200;
  const slugs = await getPostSlugs(R + H, { revalidate: 3000 });
  const slugQueue = slugs.slice(R + 1).filter((s) => s && s !== currentSlug);

  const title = post.title;
  const databaseId = post.databaseId; 
  
  updateViewedPost(databaseId!);  


  return (
    <div className="w-full flex justify-center !bg-[#F5ECE4]">
      <PostShell>
        <div className="mb-8 w-full flex justify-center">
          <div className="max-w-2xl text-center">
            {breadcrumbs && <BreadCrump breadcrumbs={breadcrumbs} title={title} />}
          </div>
        </div>

       
        <PostHero
          title={title}
          author={post.author}
          date={post.date}
          excerpt={post.excerpt}
          uri={post.uri}
          featured={post.featuredImage}
          modified={post.modified}
        />
       <AdsenseAd
            client="ca-pub-4868110039996635"
            slot="4681978434"
            format="auto"
        />
        
        <main>
          <PostBody post={post} contentHtml={updatedHtml} toc={toc} />
        </main>

        <PostFeed initialPost={post} slugQueue={slugQueue} currentSlug={currentSlug} />
      </PostShell>
    </div>
  );
}
