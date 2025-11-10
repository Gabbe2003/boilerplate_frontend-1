import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/graphql_queries/getPost";
import type { PostBySlugResult } from "@/lib/types";
import SinglePost from "./_components/SinglePost";
import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { Metadata,  } from "next";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const uri = `/${slug}`;
  const { metadata } = await getWpSeo(uri, true);
  
  return metadata;
}


export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const result: PostBySlugResult | null = await getPostBySlug(slug);
  if (!result) return notFound();

  const uri = `/${slug}/`;
  const { jsonLd } = await getWpSeo(uri);

  const { post, updatedHtml, toc } = result;

  return (
    <>
     <SinglePost
      post={post}
      currentSlug={slug}
      updatedHtml={updatedHtml}
      toc={toc}
    />
      <SeoJsonLd data={jsonLd} />
    </>
  );
}
