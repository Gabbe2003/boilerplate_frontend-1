
import { getCategoryBySlug } from "@/lib/graphql_queries/getCategories";
import { notFound } from "next/navigation";
import TaxonomyStream from "../../_components/TaxonomyStream";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import { buildFallback } from "@/lib/seo/helpers/helpers";
import DisplayComponents from "../../_components/DisplayComponents";
import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { cache } from "react";


const getSeoCached = cache(async (uri: string) => {
  return  buildFallback(uri);
});

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const {metadata} = await getSeoCached(`/category/${slug}`); 

  metadata.title = `Category ${slug} | ${process.env.NEXT_PUBLIC_HOSTNAME}`

  return metadata;
}


export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const initial = await getCategoryBySlug(slug, { take: 9 });  
  const {jsonLd} = await getSeoCached(`/category/${slug}`); 

  
  if (!initial) return notFound();
  return (
    <DisplayComponents>
      <TaxonomyStream kind="category" slug={slug} initial={initial} />
      <SeoJsonLd data={jsonLd} /> 
    </DisplayComponents>
  )
}
