
import "server-only"; 

import Link from 'next/link';
import Image from 'next/image';
import NewsletterIsland from "../Ads/NewsLetter/NewsletterIsland";


export default function Footer() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const currentYear = new Date().getFullYear();
  
  const extraLinks = [
    { type: 'button', title: 'Nyhetsbrev' },
    { type: 'link', title: 'Jobba med oss', slug: '/work' },
    { type: 'link', title: 'Annonsering', slug: '/advertisement' },
  ];

  return (
<footer
  id="footer"
  className="w-full footer-border-theme bg-background border-t"
>
  {/* TOP SECTION */}
  <div className="w-full px-4 base-width-for-all-pages mx-auto py-10">
    <div className="flex flex-col md:flex-row md:items-start gap-12">

      {/* LOGO + DESCRIPTION */}
      <div className="flex flex-col min-w-[200px] max-w-[240px]">
        <Link
          href="/"
          aria-label="Gå till startsidan"
          className="flex items-center mb-4"
          prefetch={false}
        >
          <Image
            src="/Finanstidning_with_slogan.png"
            alt="Logotyp"
            width={150}
            height={60}
          />
        </Link>
      </div>

      {/* COLUMNS */}
      <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-10">

        {/* Column 1 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
            Företag
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li><Link href="/about">Om oss</Link></li>
            <li>
              <Link href="/fact-checking-and-source-criticism-at-finanstidning">
                Faktagranskning på {process.env.NEXT_PUBLIC_HOSTNAME}
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
            Tjänster
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            {extraLinks.map((item, index) => {
              if (item.type === "button") {
                return (
                  <li key={item.title}>
                    <NewsletterIsland
                      key={item.title}
                      className="text-gray-800 hover:text-black tracking-wide"
                      label={item.title}
                    />
                  </li>
                );
              }

              return (
                <li key={index}>
                  <Link href={item.slug || "#"} prefetch={false}>
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
            Om oss
          </h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li><Link href="/privacy-statement-eu">Integritetspolicy</Link></li>
            <li><Link href="/cookie-policy-eu">Cookie Policy</Link></li>
          </ul>
        </div>

      </div>
    </div>
  </div>

  {/* FULL-WIDTH SEPARATOR */}
  <hr className="w-full border-t border-border" />

  {/* BOTTOM BAR */}
  <div className="w-full px-4 base-width-for-all-pages mx-auto py-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
    <p className="text-xs text-gray-500 text-center md:text-left">
      &copy; {currentYear} {host}. Alla rättigheter förbehållna.
    </p>

    <Link
      href="/sitemap.xml"
      className="text-xs text-gray-700 hover:text-gray-900 transition"
    >
      Webbplatskarta
    </Link>
  </div>
</footer>


  );
}
