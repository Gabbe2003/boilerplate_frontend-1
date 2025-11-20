import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";

export async function generateMetadata() {
  const { metadata } = await getWpSeo("/privacy-statement-eu");
  return metadata;
}

export default async function PrivacyPage() {
  const { jsonLd } = await getWpSeo("/privacy-statement-eu");

  const siteName = process.env.NEXT_PUBLIC_HOSTNAME || "vår webbplats";

  return (
    <main className="w-full bg-white py-12">
      <article className="base-width-for-all-pages max-w-3xl mx-auto px-4">
        
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 text-center leading-tight">
            Integritetspolicy
          </h1>
        </header>

        {/* Content */}
        <section className="space-y-6 text-lg leading-relaxed text-gray-800">

          <p>
            På <strong>{siteName}</strong> är din integritet viktig för oss. Vi är fullt 
            engagerade i att skydda din personliga information och säkerställa att din 
            upplevelse med vår plattform är både trygg och säker.
          </p>

          <p>
            Vi samlar endast in data som är nödvändiga för att ge dig den bästa möjliga 
            upplevelsen. Detta kan inkludera din e-postadress vid 
            nyhetsbrevsprenumerationer eller preferenser som hjälper oss att anpassa vårt 
            innehåll efter dina intressen.
          </p>

          <p>
            Du har alltid full kontroll över dina egna data. Om du vid något tillfälle 
            inte längre vill ta emot vårt nyhetsbrev eller andra utskick kan du enkelt 
            avsluta prenumerationen via länken i varje e-post vi skickar.
          </p>

          <p>
            Vår plattform använder moderna dataskyddssystem och följer strikta 
            säkerhetsprotokoll för att förhindra obehörig åtkomst, intrång och 
            informationsläckor. Vi övervakar kontinuerligt vår infrastruktur och 
            uppdaterar den enligt aktuella säkerhetsstandarder.
          </p>

          <p>
            Vi säljer, hyr ut eller delar aldrig dina personuppgifter med tredje part 
            utan ditt uttryckliga samtycke. Din information stannar hos oss — och dess 
            säkerhet är vårt ansvar.
          </p>

          <p>
            Genom att använda <strong>{siteName}</strong> godkänner du de principer och 
            metoder som beskrivs i denna integritetspolicy. Tveka inte att kontakta oss om 
            du har frågor kring hur dina uppgifter används eller hanteras.
          </p>

        </section>

        {/* SEO JSON-LD */}
        <SeoJsonLd data={jsonLd} />

      </article>
    </main>
  );
}
