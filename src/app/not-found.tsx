import PostCard from "@/components/Main_page/Popular_posts_section1/_components/PostCard";
import { getAllPosts } from "@/lib/graphql_queries/getPost";
import Link from "next/link";


export function generateMetadata(){
  return {
    title: "Sidan hittades inte - 404",
    description: "Sidan du söker kunde inte hittas. Kanske har den flyttats eller tagits bort.",
    robots: {
      index: false, 
      follow: false
    }
  }
}

export default async function NotFound() {
  const posts = await getAllPosts(1,4); 
  
  return (
    <div className="w-full flex flex-col items-center">
      <section className="w-full bg-gray-50 border-b border-gray-200 py-24 px-6 flex flex-col items-center text-center">
        <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-4">
          404
        </h1>

        <p className="text-xl text-gray-700 max-w-xl leading-relaxed">
          Sidan du söker verkar ha tagit en liten omväg.
          <br />
          <span className="text-gray-600">
            (Ja, även webbsidor kan gå vilse ibland.)
          </span>
        </p>

        <Link
          href="/"
          className="mt-10 inline-block rounded-xl bg-blue-600 px-8 py-3 text-white font-semibold shadow-sm hover:bg-blue-700 transition"
        >
          Gå tillbaka till startsidan
        </Link>
      </section>

      {/* RECOMMENDED ARTICLES */}
      <section className="base-width-for-all-pages w-full flex flex-col justify-center items-center px-6 py-14">
        <h2 className="text-3xl font-semibold mb-8 text-gray-900">
          Artiklar du kanske letade efter
        </h2>

        {posts?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <div key={post.id} className="rounded-md">
                <PostCard post={post} className="p-4" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">
            Just nu kan vi inte visa rekommenderade artiklar. Prova gärna igen om en stund.
          </p>
        )}
      </section>
    </div>
  );
}
