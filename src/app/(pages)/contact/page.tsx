import FormInquiry from "@/components/FormInquiry";
import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import { cache } from "react";

const getSeoCached = cache(async (uri: string) => {
  return getWpSeo(uri, true);
});


export async function generateMetadata() {
  const { metadata } = await getSeoCached("/contact");
  return metadata;
}


export default async function ContactPage() {
  const SITE = process.env.NEXT_PUBLIC_HOSTNAME ?? "Our Site";
  const { jsonLd } = await getSeoCached("/contact");


  return (
    <div className="full flex flex-col items-center">
    <div className="mx-auto base-width-for-all-pages justify-center py-12">
      <h1 className="text-4xl font-bold mb-8 text-center ">Köp en länk</h1>

      <section className="space-y-6 text-lg leading-relaxed text-gray-800">
        <p>
          Är du intresserad av att publicera en länk på <strong>{SITE}</strong>? Vi erbjuder gärna
          länkplaceringar för företag, byråer och privatpersoner som vill öka sin synlighet via vår plattform.
        </p>
        <p>
          <strong>Pris:</strong> Varje länkplacering kostar <span className="font-semibold">$250 USD</span>.
          Detta inkluderar permanent placering, relevant kategorisering och redaktionell formatering.
        </p>
        <p>
          Observera: Länkar relaterade till <strong>casino- eller spelinnehåll</strong> har ett högre pris
          på grund av branschens känslighet och redaktionell hantering. Dessa kostar <span className="font-semibold">$500 USD</span> per länk.
        </p>
        <p>
          Efter köpet kommer vårt team att granska din förfrågan och schemalägga din länk för publicering.
          Vi förbehåller oss rätten att avvisa inlämningar som inte uppfyller våra kvalitets- eller efterlevnadsstandarder.
        </p>
        <p>
          Använd formuläret nedan så guidar vi dig genom faktura, innehållskrav och tidslinjer.
        </p>
      </section>

      <SeoJsonLd data={jsonLd} />
      </div>

      <div className="w-full flex justify-center bg-gray-50 py-5">
        <div className="base-width-for-all-pages mt-5 mb-5">
          <FormInquiry />
        </div>
      </div>
    </div>

  );
}
