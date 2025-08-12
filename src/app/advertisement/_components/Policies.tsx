import Link from "next/link";

export default function Policies({ site }: { site: string }) {
  return (
    <>
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg px-4 py-3">
        <div className="text-indigo-700 font-semibold mb-1">Content &amp; Link Guidelines</div>
        <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 pl-1">
          <li>Language: <span className="font-semibold">Swedish</span>, up to 1,000 words per article.</li>
          <li>Up to <span className="font-semibold">3 do-follow links</span> per article.</li>
          <li>
            All articles are <span className="font-semibold">published permanently</span> on {site}.
          </li>
          <li>
            No “sponsored” tag in article text.
            <br />
            <span className="text-gray-400">
              A small sponsorship indication appears on the cover image, per Swedish law (does not affect links).
            </span>
          </li>
        </ul>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
        <div className="text-amber-800 font-semibold mb-1">We Do Not Accept Content Related To:</div>
        <ul className="list-disc list-inside text-sm text-gray-700 pl-1">
          <li>Adult content</li>
          <li>CBD or cannabis-related products</li>
        </ul>
        <span className="block text-xs text-gray-400 mt-1">These restrictions help maintain platform quality.</span>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2">
        <div className="text-green-800 font-semibold mb-0.5">Payment Terms</div>
        <div className="text-sm text-gray-700">
          Pay by <strong>bank transfer</strong> or <strong>PayPal</strong>.<br />
          Payment due <span className="font-semibold">within 5 working days</span> from publication date.
        </div>
      </div>

      <div className="mt-2 text-gray-500 text-xs">
        For bulk order discounts or further inquiries,
        <br />
        <Link href="mailto:publisheradsquestions@gmail.com" className="font-medium text-indigo-700 underline hover:text-indigo-900 transition">
          contact us directly
        </Link>
        .<br />
        We look forward to helping you achieve outstanding SEO results on{" "}
        <span className="font-semibold text-indigo-700">{site}</span>!
      </div>
    </>
  );
}
