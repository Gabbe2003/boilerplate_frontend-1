import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";

export async function generateMetadata() {
  const { metadata } = await getWpSeo("/privacy-statement-eu");
  return metadata;
}

export default async function PrivacyPage() {
  const { jsonLd } = await getWpSeo("/privacy-statement-eu");

  return (
    <div className="w-full bg-white py-12 flex justify-center ">
      <div className="base-width-for-all-pages">
        <h1 className="text-4xl font-bold mb-8 text-center">Integritetspolicy</h1>
        <section className="space-y-6 text-lg leading-relaxed text-gray-800">
          <p>
            På <strong>{process.env.NEXT_PUBLIC_HOSTNAME}</strong> är din integritet
            viktig för oss. Vi är fullt engagerade i att skydda din personliga
            information och säkerställa att din upplevelse med vår plattform är
            både trygg och säker.
          </p>

          <p>
            Vi samlar bara in de data som är nödvändiga för att ge dig den
            bästa möjliga upplevelsen. Detta kan inkludera din e-postadress för
            nyhetsbrevsprenumerationer eller preferenser som hjälper oss att anpassa vårt innehåll
            efter dina intressen.
          </p>

          <p>
            Du har alltid kontroll över dina data. Om du vid något tillfälle inte längre
            vill få vårt nyhetsbrev eller våra utskick kan du enkelt
            avsluta prenumerationen med ett klick via länken i varje e-post
            vi skickar.
          </p>

          <p>
            Vår plattform använder avancerade dataskyddssystem och följer strikta
            säkerhetsprotokoll för att förhindra obehörig åtkomst, intrång eller läckor.
            Vi övervakar och uppdaterar kontinuerligt vår infrastruktur för att följa
            moderna standarder för informationssäkerhet.
          </p>

          <p>
            Vi säljer, hyr ut eller delar inte dina personuppgifter med tredje part
            utan ditt uttryckliga samtycke. Din information stannar hos oss och dess
            integritet är vårt ansvar.
          </p>

          <p>
            Genom att använda <strong>{process.env.NEXT_PUBLIC_HOSTNAME}</strong>
            godkänner du de metoder som beskrivs i denna integritetspolicy. Vi uppmuntrar
            dig att kontakta oss om du har några frågor eller funderingar kring
            dina data eller hur de hanteras.
          </p>
        </section>

        <SeoJsonLd data={jsonLd} />

      </div>
    </div>
  );
}
