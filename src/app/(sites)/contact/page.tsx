import FormInquiry from "@/components/FormInquiry";
import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";


export async function generateMetadata() {
  const { metadata } = await getWpSeo("/contact");
  return metadata;
}


export default async function ContactPage() {
  const SITE = process.env.NEXT_PUBLIC_HOSTNAME ?? "Our Site";
  const { jsonLd } = await getWpSeo("/contact");


  return (
    <div className="max-w-4xl mx-auto  py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Köp en länk</h1>

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

      {/* Full-width form outside the constrained container */}
      <div className="w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-6">
          <FormInquiry />
        </div>
      </div>
      <SeoJsonLd data={jsonLd} />
    </div>
  );
}
