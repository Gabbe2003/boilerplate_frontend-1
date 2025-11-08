
import { getAuthorBySlug } from "@/lib/graphql_queries/getAuthor";
import { notFound } from "next/navigation";
import TaxonomyStream from "../../_components/TaxonomyStream";
import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import { getAuthorSeo } from "@/lib/seo/authorSeo";


export async function generateMetadata({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const authorData  = await getAuthorBySlug(slug, { take: 9 });
  const { metadata } = await getAuthorSeo(authorData!);
   metadata.robots = {
    index: false, 
    follow: true
  }
  return metadata;
}


export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const initial = await getAuthorBySlug(slug, { take: 9 }); 
  const { jsonLd } = await getAuthorSeo(initial!);

  
  if (!initial) return notFound();
  return (
    <div className="w-full ">
      <TaxonomyStream kind="author" slug={slug} initial={initial} />;
      <SeoJsonLd data={jsonLd} />
    </div>
  )
}
