import { capitalizeFirstLetter } from "@/lib/globals/actions"; 
import { getWpSeo } from "@/lib/seo/graphqlSeo";

export async function generateMetadata() {
  const { metadata } = await getWpSeo('/work'); 
  metadata.title = `Work | ${capitalizeFirstLetter(process.env.NEXT_PUBLIC_HOSTNAME!)}`;
  return metadata; 
}

export default async function Work() {
  const { jsonLd } = await getWpSeo('/work'); 

  return (
    <main className="w-full flex justify-center  bg-gradient-to-br from-gray-50 via-white to-blue-50 py-10">
      <div className="base-width-for-all-pages flex justify-center">
        
        <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-[75%] text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">
            Jobbansökningar
          </h1>

          <p className="text-lg text-gray-600 mb-6">
            Tack för ditt intresse att ansluta till vårt team!
            <br />
            <span className="block mt-2 font-semibold text-red-500">
              Vi anställer inte för tillfället.
            </span>
          </p>

          <div className="flex flex-col items-center gap-2 mb-6">
            <span className="text-4xl mb-2">🚫</span>
            <p className="text-gray-500">
              Inga lediga tjänster just nu. Men gå inte långt!
            </p>
            <p className="text-gray-500">
              Håll ett öga på den här sidan för framtida möjligheter. 
              Vi uppdaterar denna sida varje vecka.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
