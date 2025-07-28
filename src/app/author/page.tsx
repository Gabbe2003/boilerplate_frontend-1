import { getAllAuthors } from "@/lib/graph_queries/getAllAuthors";
import { AuthorNode } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";

export default async function AuthorPage() {
  const authors = await getAllAuthors();

  if (!authors?.length) {
    return (
      <div className="p-8 text-center text-gray-600">
        No authors found.
      </div>
    );
  }


  
  return (
    <section className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">All Authors</h1>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 items-stretch">
        {authors.map((author: AuthorNode) => (
          <Link
            href={`/author/${author.slug}`}
            key={author.id}
            className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-5 text-center group h-full"
          >
            <div className="flex flex-col items-center gap-3">
            <div className="relative w-full" style={{ height: "96px", width: "96px" }}>
                <Image
                  src={author?.avatar?.url || "/placeholder.jpg"}
                  alt={author.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                  priority
                />
              </div>
              <h2 className="text-lg font-bold group-hover:text-blue-600 transition-colors">{author.name}</h2>
              {author?.description && (
                <p className="text-gray-600 text-sm line-clamp-3">{author.description || ""}</p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
