import type { Metadata } from "next";
import PricingCard from "./_components/PricingCard";
import Policies from "./_components/Policies";
import NewsletterHighlight from "./_components/NewsletterHighlight";
import AdInquiryForm from "./_components/AdInquiryForm";
import { buildMetadataFromSeo, getSeo } from '@/lib/seo/seo';

const SITE = process.env.NEXT_PUBLIC_HOSTNAME ?? "Our Site";

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getSeo('/advertisement/');

  if (!payload?.nodeByUri) {
    return {
      title: `Advertisement | ${process.env.NEXT_PUBLIC_HOSTNAME}`,
      description: "Discover advertising opportunities, partnerships, and collaborations with us.",
      robots: { index: true, follow: true },
    };
  }

  const meta = buildMetadataFromSeo(payload, {
    metadataBase: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: process.env.NEXT_PUBLIC_SITENAME,
  });

  // fallback description if empty
  if (!meta.description) {
    meta.description = "Discover advertising opportunities, partnerships, and collaborations with us.";
  }

  return meta;
}


export default async function AdInquiryPage() {
  // All markup below is rendered on the server.
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-2 py-10">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left column (pure server) */}
          <div className="flex-1 mb-8 md:mb-0 rounded-2xl bg-white border border-blue-100 shadow-lg p-6 flex flex-col justify-between">
            <div>
              <PricingCard site={SITE} />
            </div>
            <div className="flex flex-col gap-3 w-full mt-6">
              <Policies site={SITE} />
              <NewsletterHighlight site={SITE} />
            </div>
          </div>

          {/* Right column: the form (small client island) */}
          <div className="flex-1 bg-white border border-gray-100 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow duration-300 p-8">
            <div className="mb-5 text-center">
              <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">
                Advertise / Partner With Us
              </h1>
              <p className="text-gray-500 text-base">
                For advertising, partnerships or collaborations. Let’s make something great together.
                <br />
                <span className="font-medium text-gray-400 text-sm">All prices are in EUR.</span>
              </p>
            </div>
            <AdInquiryForm />
            <p className="text-xs text-gray-400 text-center mt-2">
              Need support? Email us at{" "}
              <a href="mailto:publisheradsquestions@gmail.com" className="text-indigo-600 underline">
                publisheradsquestions@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
