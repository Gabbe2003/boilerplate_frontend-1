
import PricingCard from "./_components/PricingCard";
import Policies from "./_components/Policies";
import NewsletterHighlight from "./_components/NewsletterHighlight";
import FormInquiry from "@/components/FormInquiry";
import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import { cache } from "react";

const SITE = process.env.NEXT_PUBLIC_HOSTNAME ?? "Vår Webbplats";



const getSeoCached = cache(async (uri: string) => {
  return getWpSeo(uri, true);
});

export async function generateMetadata() {
  const { metadata } = await getSeoCached("/advertisement");
  return metadata;
}


export default async function AdInquiryPage() {
  const { jsonLd } = await getSeoCached("/advertisement");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-10">
      <div className="base-width-for-all-pages mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Vänster kolumn (server-renderad) */}
          <div className="flex-1 mb-8 md:mb-0 rounded-2xl bg-white border border-blue-100 shadow-lg p-6 flex flex-col justify-between">
            <div>
              <PricingCard site={SITE} />
            </div>
            <div className="flex flex-col gap-3 w-full mt-6">
              <Policies site={SITE} />
              <NewsletterHighlight site={SITE} />
            </div>
          </div>

          {/* Höger kolumn: formuläret (client island) */}
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8">
            <div className="mb-5 text-center">
              <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">
                Annonsera / Samarbeta Med Oss
              </h1>
              <p className="text-gray-500 text-base">
                För annonsering, partnerskap eller samarbeten. Låt oss skapa något fantastiskt tillsammans.
                <br />
                <span className="font-medium text-gray-400 text-sm">Alla priser är i EUR.</span>
              </p>
            </div>
            <FormInquiry variant="advertisement"/>
            <p className="text-xs text-gray-400 text-center mt-2">
              Behöver du support? Mejla oss på{" "}
              <a href="mailto:publisheradsquestions@gmail.com" className="text-indigo-600 underline">
                publisheradsquestions@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
      <SeoJsonLd data={jsonLd} />
    </div>
  );
}
