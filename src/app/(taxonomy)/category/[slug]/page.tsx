
import { getCategoryBySlug } from "@/lib/graphql_queries/getCategories";
import { notFound } from "next/navigation";
import TaxonomyStream from "../../_components/TaxonomyStream";
import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const { metadata } = await getWpSeo(`/category/${slug}`);
  metadata.robots = {
    index: false, 
    follow: true
  }

  metadata.title = `Kategori ${slug} | ${process.env.NEXT_PUBLIC_HOSTNAME}`

  return metadata;
}


export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const {slug} =  await params
  const initial = await getCategoryBySlug(slug, { take: 9 });  
  const { jsonLd } = await getWpSeo(`/category/${slug}`);

  
  if (!initial) return notFound();
  return (
    <div className="w-full ">
      <TaxonomyStream kind="category" slug={slug} initial={initial} />;
      <SeoJsonLd data={jsonLd} /> 
    </div>
  )
}
