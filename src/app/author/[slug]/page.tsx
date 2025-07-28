import { getAuthorBySlug } from "@/lib/graph_queries/getAuthorBySlug";
import { stripHtml } from "@/lib/helper_functions/strip_html";
import { Post } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";



export default async function AuthorInfo({ params }: {params: Promise<{ slug: string }>}) {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    return (
      <div className="p-8 text-center text-black-600 mt-5" style={{ height: "87vh" }}>
        {`Author `}
          <strong>{slug}</strong>
        {` not found.`}
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto p-4">
      <div className="flex flex-col items-center gap-4 mb-8">
        <Image
          src={author.avatar.url}
          alt={author.name}
          width={96}
          height={96}
          className="rounded-full object-cover border"
          priority
        />
        <h1 className="text-2xl font-bold">{author.name}</h1>
        <p className="text-gray-600 text-center">{author.description}</p>
      </div>
      <h2 className="text-xl font-semibold mb-4">Recent Posts</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {author.posts.nodes.map((post: Post) => {
          const imgSrc =
            post.featuredImage?.node?.sourceUrl ||
            author.avatar?.url ||
            "/placeholder.jpg";
          const imgAlt =
            post.featuredImage?.node?.altText ||
            post.title ||
            author.name;
          return (
            <Link
              href={`/${post.slug}`}
              key={post.id}
              className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4"
            >
            <div className="relative w-full" style={{ paddingTop: "60%" }}>
              <Image
                src={imgSrc}
                alt={imgAlt}
                fill
                className="object-cover rounded-lg mb-2"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>

            <h3 className="text-lg font-bold mb-1">{post.title}</h3>

            <p>{stripHtml(post.excerpt)}</p>
            <div className="text-xs text-gray-500 mb-1">
              {new Date(post.date).toISOString().slice(0, 10)}
            </div>
          </Link>
          );
        })}
      </div>
    </section>
  );
}
