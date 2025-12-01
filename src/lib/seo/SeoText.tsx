export default function SeoText() {
  const HOST = process.env.NEXT_PUBLIC_HOSTNAME;

  return (
    <div className="w-full flex justify-center mb-4">
      <section className="mt-10 base-width-for-all-pages">
        <h1 className="mb-6 text-3xl font-bold tracking-tight text-black">
          {HOST} – Finansnyheter, börsnyheter och ekonomiska analyser
        </h1>

        <div className="space-y-5 leading-relaxed text-gray-900">

          <p>
            {HOST} är en specialiserad nyhetssajt med fullt fokus på finansnyheter, börsnyheter
            och ekonomiska analyser. Här samlar vi de viktigaste nyheterna om finansmarknaden,
            börsen och näringslivet – med målet att bli Sveriges mest tillförlitliga och
            omfattande källa för finansnyheter och ekonominyheter.
          </p>

          <p>
            Vi bevakar dagligen de finansiella marknaderna i Sverige, Europa och världen.
            På {HOST} hittar du uppdaterade nyheter om Stockholmsbörsen, indexrörelser,
            börsintroduktioner (IPO), aktiekurser, ränteläge, inflation, konjunktur,
            valutakurser samt andra centrala delar inom makroekonomi och mikroekonomi.
            Våra aktieanalyser, marknadskommentarer och ekonomiska prognoser hjälper dig
            att förstå vad som driver börsen och finansmarknaden just nu.
          </p>

          <p>
            För dig som är intresserad av privatekonomi och vill följa finansnyheter som
            påverkar din vardag, erbjuder vi guider och nyheter om sparande, pension, bolån,
            fonder, kapitalförvaltning och skattefrågor. Innehållet är anpassat både för
            privatinvesterare och professionella aktörer – från ekonomistudenter och analytiker
            till företagsledare och finansiella rådgivare.
          </p>

          <p>
            {HOST} bevakar också trender inom finansiell teknologi (fintech), hållbara
            investeringar (ESG), grön ekonomi och digital ekonomi. Vi analyserar hur globala
            händelser, räntebesked från centralbanker och förändringar i världsekonomin
            påverkar svenska företag, börsen, import/export och internationell handel.
          </p>

          <p>
            Vår redaktion arbetar med hög journalistisk integritet och ett tydligt uppdrag:
            att göra finansnyheter och ekonomisk information tillgänglig, aktuell och
            begriplig för alla. Genom att kombinera löpande finansnyhetsrapportering,
            fördjupande analyser och tydliga genomgångar av komplexa ekonomiska skeenden,
            skapar {HOST} en helhetsbild av den moderna ekonomin.
          </p>

          <p className="font-medium text-gray-900">
            {HOST} – för dig som vill följa finansnyheter, förstå börsen och navigera i
            ekonomins landskap. Håll dig uppdaterad med det senaste inom finans, ekonomi,
            börsen, pengar och affärsnyheter – allt samlat på ett och samma ställe.
          </p>

        </div>
      </section>
    </div>
  );
}
