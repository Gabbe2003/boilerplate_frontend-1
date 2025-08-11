import type { Metadata } from "next";
import ContactForm from "./_component/ContactForm";

const SITE = process.env.NEXT_PUBLIC_HOSTNAME ?? "Our Site";

export const metadata: Metadata = {
  title: `${SITE} | Purchase a Link`,
  description: `Purchase a link placement on ${SITE}.`,
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Purchase a Link</h1>

      <section className="space-y-6 text-lg leading-relaxed text-gray-800">
        <p>
          Interested in publishing a link on <strong>{SITE}</strong>? We’re happy to
          offer link placements for businesses, agencies, and individuals looking to
          enhance their visibility through our platform.
        </p>
        <p>
          <strong>Pricing:</strong> Each link placement costs <span className="font-semibold">$250 USD</span>.
          This includes permanent placement, relevant categorization, and editorial formatting.
        </p>
        <p>
          Please note: Links related to <strong>casino or gaming content</strong> are subject to a higher rate
          due to industry sensitivity and editorial handling. These are priced at <span className="font-semibold">$500 USD</span> per link.
        </p>
        <p>
          After purchasing, our team will review your request and schedule your link for publication.
          We reserve the right to reject submissions that do not meet our quality or compliance standards.
        </p>
        <p>
          Use the form below and we’ll guide you through invoice, content requirements, and timelines.
        </p>

        <ContactForm />
      </section>
    </div>
  );
}
