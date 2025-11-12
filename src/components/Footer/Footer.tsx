
import "server-only"; 

import Link from 'next/link';
import Image from 'next/image';


export default function Footer() {
  const host = process.env.NEXT_PUBLIC_HOSTNAME;
  const currentYear = new Date().getFullYear();
  
  const extraLinks = [
    { type: 'button', title: 'Nyhetsbrev' },
    { type: 'link', title: 'Jobba med oss', slug: '/work' },
    { type: 'link', title: 'Webbplatskarta', slug: '/sitemap.xml' },
  ];
  // const links = [
  //   { title: 'Kontakt', slug: '/contact' },
  //   { title: host ? `Om ${host}` : 'Om', slug: '/about' },
  //   { title: 'Integritetspolicy', slug: '/privacy' },
  //   { title: 'Arkiv', slug: '/archive' },
  // ];

  return (
    <footer id="footer" className="w-full px-2 border-t border-gray-200 bg-gray-100">
      <div className="w-[100%] px-2 lg:w-[90%] xl:w-[70%] mx-auto py-6">
        {/* Logo and Links */}
        <div className="flex flex-col md:flex-row mb-8 gap-8">
          {/* Logo/Tagline */}
          <div className="flex flex-col items-start min-w-[170px]">
            <Link href="/" className="mb-4 flex-shrink-0 flex items-center py-6" aria-label="Gå till startsidan" prefetch={false}>
              <Image
                src="/Finanstidning_with_slogan.png"
                alt="Logotyp"
                width={150}
                height={60}
                priority
              />

            </Link>
          </div>

          {/* Links in columns */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 justify-end md:items-start min-w-0">
            <div className="min-w-0">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Läsarnas favoriter</h3>
              <ul className="space-y-2">
              
              </ul>
            </div>

            <div className="min-w-0">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Företag</h3>
              <ul className="space-y-2">
                <div className="flex flex-wrap flex-col items-start">
                  {extraLinks.map((item, index) => {
                    if (item.type === "button") {
                      return (
                        <button
                          key={index}
                          className=""
                          // onClick={} FIx this later
                        >
                          {item.title}
                        </button>
                      );
                    }

                    // Otherwise, it's a link
                    return (
                      <Link
                        key={index}
                        href={item.slug || "#"}
                        className=""
                        prefetch={false}
                      >
                        {item.title}
                      </Link>
                    );
                  })}
                </div>
              </ul>
            </div>

            <div className="min-w-0">
              <h3 className="mb-4 text-lg font-semibold text-gray-700">Om oss</h3>
              <ul className="space-y-2">
               
              </ul>
            </div>
          </div>
        </div>

        {/* Separator */}
        <hr className="my-8 border-t border-gray-300" />

        {/* Bottom row */}
        <div className="flex flex-col gap-4 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-center text-xs text-gray-500 md:text-left break-normal whitespace-normal hyphens-auto text-pretty">
            &copy; {currentYear} {host}. Alla rättigheter förbehållna.
          </p>
        </div>
      </div>
    </footer>
  );
}
