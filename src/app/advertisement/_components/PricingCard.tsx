import Dollar from "@/app/components/Icons/dollar";
import Sparkles from "@/app/components/Icons/sparks";

export default async function PricingCard({ site }: { site: string }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-3 text-indigo-700 font-semibold">
        <Dollar width={22} color="#6366f1" className="mr-2" />
        <span className="text-lg">{site} Article Pricing</span>
      </div>

      <ul className="space-y-2 text-gray-700 text-base ml-1">
        <li className="flex items-center gap-2">
          <Sparkles width={16} color="#6366f1" className="mt-0.5" />
          <span>
            <strong>€350</strong> per article{" "}
            <span className="text-gray-500">(General Content)</span>
            <br />
            <span className="text-xs text-gray-400">
              Business, finance, and other standard topics.
            </span>
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Sparkles width={16} color="#f59e42" className="mt-0.5" />
          <span>
            <strong>€550</strong> per article{" "}
            <span className="text-gray-500">(Crypto, Forex, Loans &amp; Finance)</span>
            <br />
            <span className="text-xs text-gray-400">
              High-competition topics such as cryptocurrency, forex, or loan services.
            </span>
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Sparkles width={16} color="#fb7185" className="mt-0.5" />
          <span>
            <strong>€700</strong> per article{" "}
            <span className="text-gray-500">(Casino, Betting &amp; Gambling)</span>
            <br />
            <span className="text-xs text-gray-400">
              For casino, betting, and gambling topics.
            </span>
          </span>
        </li>
      </ul>

      <div className="mt-4 text-sm text-gray-600">
        <strong>Discounts:</strong> Bundle orders of{" "}
        <span className="font-semibold">3+ articles</span> get reduced pricing.
        <br />
        <span className="text-gray-400">Contact us to discuss options tailored to your needs.</span>
      </div>

      <div className="mt-5 text-indigo-700 font-bold">Additional Writing Service</div>
      <div className="text-sm text-gray-600 mb-1">
        <strong>€200</strong> per article (optional add-on: high-quality, SEO-optimized writing by our team)
      </div>
    </>
  );
}
