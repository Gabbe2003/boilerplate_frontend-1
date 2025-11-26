import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import { cache } from "react";


const getSeoCached = cache(async (uri: string) => {
  return getWpSeo(uri, true);
});



export async function generateMetadata() {
  const { metadata } = await getSeoCached("/fact-checking-and-source-criticism-at-finanstidning");
  return metadata;
}


export default async function FactCheckingAndSourceCriticismAtFinanstidningPage() {
  const { jsonLd } = await getSeoCached("/fact-checking-and-source-criticism-at-finanstidning");
  return (
    <main className="w-full py-10">
      <article className="base-width-for-all-pages max-w-3xl mx-auto px-4">
        
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Faktagranskning och källkritik på Finanstidning
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            På Finanstidning värnar vi om korrekthet, transparens och förtroende. 
            Alla artiklar, analyser och nyheter vi publicerar genomgår en noggrann 
            faktagranskningsprocess innan publicering. Vårt mål är att ge läsarna 
            tillförlitlig, verifierad och aktuell information inom ekonomi, finans 
            och näringsliv.
          </p>
        </header>

        {/* Section 1 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Vår grundprincip: sanningsenlig och verifierad rapportering
          </h2>
          <p className="text-gray-700 mb-4">
            Varje publicerad text på Finanstidning bygger på verifierade uppgifter 
            från trovärdiga och etablerade källor. Vi strävar alltid efter att:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>använda minst två oberoende källor vid nyhetsrapportering,</li>
            <li>kontrollera all fakta, siffror och citat mot ursprungskällor,</li>
            <li>undvika spridning av obekräftade uppgifter, rykten eller spekulationer,</li>
            <li>uppdatera artiklar när nya fakta framkommer.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Källhantering och urval
          </h2>
          <p className="text-gray-700 mb-4">
            Våra källor omfattar:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Officiella rapporter från myndigheter, centralbanker och statistikbyråer,</li>
            <li>Pressmeddelanden och årsrapporter från börsnoterade företag och finansiella institutioner,</li>
            <li>Analysdata från etablerade ekonomiska databaser (t.ex. SCB, Eurostat, IMF, OECD),</li>
            <li>Uttalanden från erkända ekonomer, analytiker och experter inom finanssektorn.</li>
          </ul>

          <p className="mt-4 text-gray-700">
            Vi väljer alltid källor baserat på deras relevans, trovärdighet och expertis inom 
            ämnesområdet. När vi använder sekundärkällor anger vi detta tydligt i texten.
          </p>
        </section>

        {/* Section 3 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Källkritisk metod
          </h2>
          <p className="text-gray-700 mb-4">
            Finanstidning tillämpar en systematisk källkritisk granskning i varje publicering. 
            Det innebär att vi bedömer:
          </p>

          <dl className="space-y-3">
            <div>
              <dt className="font-semibold text-gray-900">Äkthet</dt>
              <dd className="text-gray-700">Är källan genuin och ursprunglig?</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Relevans</dt>
              <dd className="text-gray-700">Är uppgiften relevant för sammanhanget?</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Oberoende</dt>
              <dd className="text-gray-700">Har källan intressekonflikter eller påverkan?</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Aktualitet</dt>
              <dd className="text-gray-700">Är informationen uppdaterad och korrekt i tid?</dd>
            </div>
            <div>
              <dt className="font-semibold text-gray-900">Sakkunskap</dt>
              <dd className="text-gray-700">Har källan dokumenterad expertis inom området?</dd>
            </div>
          </dl>
        </section>

        {/* Section 4 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Redaktionell kontroll och uppdateringar
          </h2>
          <p className="text-gray-700">
            Innan publicering granskas alla artiklar av redaktör eller ansvarig utgivare. 
            Vid behov konsulteras externa experter eller källor för att verifiera särskilt 
            komplexa uppgifter, exempelvis ekonomiska prognoser eller statistik från tredje part.
          </p>
          <p className="mt-4 text-gray-700">
            Om felaktigheter skulle upptäckas efter publicering rättas dessa skyndsamt och 
            förtydligas öppet på sidan enligt vår riktlinje för transparens och ansvar.
          </p>
        </section>

        {/* Section 5 */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Vår ambition
          </h2>
          <p className="text-gray-700">
            Vi vill att Finanstidning ska vara en trovärdig, neutral och faktabaserad källa inom 
            ekonomi, finans och börs. Genom noggrann faktakontroll, oberoende analys och 
            källkritik stärker vi vår journalistiska kvalitet och ditt förtroende som läsare.
          </p>
        </section>

        {/* Contact */}
        <section className="border-t pt-6 mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Kontakt vid frågor om faktagranskning
          </h2>
          <p className="text-gray-700 mb-2">
            Har du frågor, synpunkter eller vill uppmärksamma oss på ett eventuellt fel?
          </p>
          <p className="text-gray-700">
            <strong>E-post:</strong>{" "}
            <a
              href="mailto:info@finanstidning.se"
              className="text-blue-600 hover:underline"
            >
              info@finanstidning.se
            </a>
          </p>
        </section>

      </article>
      <SeoJsonLd data={jsonLd} />
    </main>
  );
}
