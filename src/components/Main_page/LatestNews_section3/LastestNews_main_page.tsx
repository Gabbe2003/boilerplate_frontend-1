import "server-only"
import FetchLatestNew from "./_components/FetchLatestNew";


export default async function LatestNews_main_page(){
    return (
        <section className="w-full mt-10">
            <h2>Senaste nyheterna</h2>
            <FetchLatestNew  />
        </section>
    )
}