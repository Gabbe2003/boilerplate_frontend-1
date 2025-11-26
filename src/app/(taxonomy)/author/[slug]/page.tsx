
import { getAuthorBySlug } from "@/lib/graphql_queries/getAuthor";
import { notFound } from "next/navigation";
import TaxonomyStream from "../../_components/TaxonomyStream";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import { getAuthorSeo } from "@/lib/seo/authorSeo";
import { capitalizeFirstLetter } from "@/lib/globals/actions";
import { cache } from "react";
import { Author } from "@/lib/types";



const getSeoCached = cache(async (data?: Author) => {
  return getAuthorSeo(data!);
});

const getAuthorCached = cache(async (slug: string, opts?: any) => {
  return getAuthorBySlug(slug, opts);
});


export async function generateMetadata({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const authorData  = await getAuthorCached(slug, { take: 9 });
  const { metadata } = await getSeoCached(authorData!);

  metadata.title = `Author ${slug} | ${capitalizeFirstLetter(process.env.NEXT_PUBLIC_HOSTNAME!)} ` 

  return metadata;
}


export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const initial = await getAuthorCached(slug, { take: 9 }); 
  const { jsonLd } = await getSeoCached(initial!);

  
  if (!initial) return notFound();
  return (
    <div className="w-full flex justify-center">
      <TaxonomyStream kind="author" slug={slug} initial={initial} />
      <SeoJsonLd data={jsonLd} />
    </div>
  )
}
