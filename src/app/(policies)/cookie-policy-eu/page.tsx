import "server-only"

import { getWpSeo } from "@/lib/seo/graphqlSeo";
import { SeoJsonLd } from "@/lib/seo/SeoJsonLd";
import { cache } from "react";
import Link from "next/link";


const getSeoCached = cache(async (uri: string) => {
  return getWpSeo(uri, true);
});


export async function generateMetadata() {
  const { metadata } = await getSeoCached("/cookie-policy-eu");
  return metadata;
}


export default async function CookiePolicyPage() {
    const { jsonLd } = await getSeoCached("/cookie-policy-eu");
  return (
    <main className="w-full py-10">
      <article className="base-width-for-all-pages max-w-3xl mx-auto px-4">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
            Cookiepolicy för {process.env.NEXT_PUBLIC_HOSTNAME}
          </h1>
          <p className="mt-4 text-gray-700 text-lg">
            Denna cookiepolicy beskriver hur {process.env.NEXT_PUBLIC_HOSTNAME} använder cookies och liknande tekniker
            på vår webbplats. Vi värnar om din integritet och vill att du ska känna dig trygg när
            du besöker oss. Här förklarar vi vilka typer av cookies vi använder, varför vi använder
            dem och hur du kan hantera dina cookie-inställningar.
          </p>
        </header>

        {/* What are cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Vad är cookies?</h2>
          <p className="text-gray-700">
            Cookies är små textfiler som lagras på din dator, mobil eller surfplatta när du
            besöker en webbplats. De används för att webbplatsen ska fungera korrekt, komma ihåg
            dina inställningar och ge oss statistik som hjälper oss att förbättra användarupplevelsen.
          </p>
        </section>

        {/* Cookie types */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Vilka typer av cookies använder vi?
          </h2>

          <div className="overflow-x-auto mt-4">
            <table className="w-full border border-gray-300 text-left text-gray-800 text-sm sm:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border-b font-semibold w-1/4">Typ av cookie</th>
                  <th className="p-3 border-b font-semibold w-1/2">Syfte</th>
                  <th className="p-3 border-b font-semibold w-1/4">Exempel</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Nödvändiga cookies</td>
                  <td className="p-3">Krävs för att webbplatsen ska fungera korrekt, t.ex. för inloggning och säkerhet.</td>
                  <td className="p-3">Sessionshantering, sidnavigering</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Funktionella cookies</td>
                  <td className="p-3">Kommer ihåg inställningar och preferenser.</td>
                  <td className="p-3">Språkval, sparade artiklar</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Analys- och prestandacookies</td>
                  <td className="p-3">Hjälper oss förstå hur webbplatsen används.</td>
                  <td className="p-3">Google Analytics, Matomo</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">Marknadsföringscookies</td>
                  <td className="p-3">Visar relevant annonsering baserat på intressen.</td>
                  <td className="p-3">Google Ads, Meta Pixel</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Tredjepartscookies</td>
                  <td className="p-3">Placeras av externa leverantörer för statistik, annonser eller social delning.</td>
                  <td className="p-3">YouTube, LinkedIn, X (Twitter)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Hur använder {process.env.NEXT_PUBLIC_HOSTNAME} cookies?
          </h2>
          <p className="text-gray-700 mb-4">Vi använder cookies för att:</p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>analysera trafik och användarbeteende,</li>
            <li>förbättra webbplatsens prestanda och innehåll,</li>
            <li>komma ihåg användarinställningar,</li>
            <li>visa relevanta annonser och mäta kampanjresultat,</li>
            <li>möjliggöra delning av artiklar via sociala medier.</li>
          </ul>

          <p className="mt-4 text-gray-700">
            Vi sparar aldrig personuppgifter utan ditt samtycke.
          </p>
        </section>

        {/* Managing cookies */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Hur kan du hantera cookies?</h2>
          <p className="text-gray-700 mb-4">
            Du kan själv välja om du vill tillåta, blockera eller radera cookies:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>Via vår cookie-banner när du besöker webbplatsen första gången.</li>
            <li>Genom inställningar i din webbläsare (Chrome, Safari, Edge, Firefox m.fl.).</li>
          </ul>

          <p className="mt-4 text-gray-700">
            Observera att om du blockerar nödvändiga cookies kan vissa delar av webbplatsen sluta fungera korrekt.
          </p>
        </section>

        {/* Storage time */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Lagringstid</h2>
          <p className="text-gray-700">
            Vi sparar cookies under olika lång tid beroende på deras syfte:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
            <li><strong>Sessionscookies</strong> raderas automatiskt när du stänger webbläsaren.</li>
            <li><strong>Beständiga cookies</strong> sparas i upp till 12 månader eller tills du själv raderar dem.</li>
          </ul>
        </section>

        {/* Third-party services */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Tredjepartstjänster</h2>
          <p className="text-gray-700">
            {process.env.NEXT_PUBLIC_HOSTNAME} kan använda externa verktyg för analys och marknadsföring, exempelvis:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
            <li>Google Analytics (trafikanalys)</li>
            <li>Google Ads / Meta Ads (annonsering)</li>
          </ul>

          <p className="mt-4 text-gray-700">
            Dessa leverantörer kan behandla data utanför EU/EES. Vi säkerställer att alla
            överföringar sker enligt gällande GDPR-krav och skyddsåtgärder, såsom standardavtalsklausuler (SCC).
          </p>
        </section>

        {/* Consent */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Samtycke och återkallelse</h2>
          <p className="text-gray-700">
            När du besöker {process.env.NEXT_PUBLIC_HOSTNAME} för första gången får du välja vilka cookies du samtycker till.
            Du kan när som helst ändra eller återkalla ditt samtycke via länken <strong>”Hantera cookies”</strong> längst ned på sidan.
          </p>
        </section>

        {/* Contact */}
        <section className="border-t pt-6 mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Kontakt</h2>
          <p className="text-gray-700 mb-2">Om du har frågor om vår cookieanvändning:</p>
          <p className="text-gray-700">
            <strong>E-post:</strong>{" "}
            <Link href="mailto:info@finanstidning.se" className="text-blue-600 hover:underline">
              info@finanstidning.se
            </Link>
          </p>
        </section>

      </article>
      <SeoJsonLd data={jsonLd} />
    </main>
  );
}
