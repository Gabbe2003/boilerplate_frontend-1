
import { getCategoryBySlug } from "@/lib/graphql_queries/getCategories";
import { notFound } from "next/navigation";
import TaxonomyStream from "../../_components/TaxonomyStream";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import { buildFallback } from "@/lib/seo/helpers/helpers";
import DisplayComponents from "../../_components/DisplayComponents";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const {metadata} = buildFallback(`/category/${slug}`); 

  metadata.title = `Category ${slug} | ${process.env.NEXT_PUBLIC_HOSTNAME}`

  return metadata;
}


export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const initial = await getCategoryBySlug(slug, { take: 9 });  
  const {jsonLd} = buildFallback(`/category/${slug}`); 

  
  if (!initial) return notFound();
  return (
    <DisplayComponents>
      <TaxonomyStream kind="category" slug={slug} initial={initial} />
      <SeoJsonLd data={jsonLd} /> 
    </DisplayComponents>
  )
}
