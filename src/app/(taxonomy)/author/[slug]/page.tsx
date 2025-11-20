
import { getAuthorBySlug } from "@/lib/graphql_queries/getAuthor";
import { notFound } from "next/navigation";
import TaxonomyStream from "../../_components/TaxonomyStream";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import { getAuthorSeo } from "@/lib/seo/authorSeo";
import { capitalizeFirstLetter } from "@/lib/globals/actions";


export async function generateMetadata({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const authorData  = await getAuthorBySlug(slug, { take: 9 });
  const { metadata } = await getAuthorSeo(authorData!);

  metadata.title = `Author ${slug} | ${capitalizeFirstLetter(process.env.NEXT_PUBLIC_HOSTNAME!)} ` 

  return metadata;
}


export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const initial = await getAuthorBySlug(slug, { take: 9 }); 
  const { jsonLd } = await getAuthorSeo(initial!);

  
  if (!initial) return notFound();
  return (
    <div className="w-full flex justify-center">
      <TaxonomyStream kind="author" slug={slug} initial={initial} />
      <SeoJsonLd data={jsonLd} />
    </div>
  )
}
