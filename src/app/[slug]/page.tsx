import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/graphql_queries/getPost";
import SinglePost from "./_components/SinglePost";
import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { Metadata } from "next";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import { cache } from "react";


const getPostCached = cache(async (slug: string) => {
  return getPostBySlug(slug);
});


const getSeoCached = cache(async (uri: string) => {
  return getWpSeo(uri, true);
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
    const result = await getPostCached(slug);
  if (!result) return notFound();

  const uri = `/${slug}`;
  const { metadata } = await getSeoCached(uri);

  return metadata;
}


export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
    const result = await getPostCached(slug);
  if (!result) return notFound();

  const uri = `/${slug}/`;
  const { jsonLd } = await getSeoCached(uri);

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
