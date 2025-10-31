import { getAllPosts } from "@/lib/graphql_queries/getPost";
import FetchLatestNew from "./_components/FetchLatestNew";


export default async function LatestNews_main_page(){
    const posts = await getAllPosts(10);

    return (
        <section className="w-full mt-10">
            <h2>Senaste nyheterna</h2>
            <FetchLatestNew posts={posts} />
        </section>
    )
}