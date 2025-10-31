"use client";
import { useEffect, useState } from "react";
import { Category_names, CategoryWithPosts, Post } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { getExcerpt, handleSpecielChar } from "@/lib/globals/actions";

type CategoryResponse = {
  categoryBySlug?: CategoryWithPosts;
  error?: string;
};

export default function CategorySections({
  getAllCategories,
}: {
  getAllCategories: Category_names[];
}) {
  const [activeCategory, setActiveCategory] = useState<string>("NYHETER");
  const [loading, setLoading] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/categories?category=${encodeURIComponent(activeCategory)}`
        );
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        const data: CategoryResponse = await res.json();
        if (!cancelled) setPosts(data?.categoryBySlug?.posts.nodes ?? []);
      } catch (err) {
        console.error("Error fetching category:", err);
        if (!cancelled) setPosts([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [activeCategory]);

  return (
    <div >
      <h2>
        Senast inom {activeCategory }
      </h2>
      <div className="flex gap-5 border-b-2 mb-10">
      {getAllCategories.map((category, index) => (
        category.count && category.count > 6 && (
          <button
            key={index}
            onClick={() => setActiveCategory(category.name)}
            aria-pressed={activeCategory === category.name}
            disabled={loading && activeCategory === category.name}
            className={`px-3 py-2 rounded transition custom-button
              ${activeCategory === category.name ? "bg-black text-white" : "bg-gray-200"}
              ${loading && activeCategory === category.name ? "opacity-70 cursor-not-allowed" : "hover:bg-gray-300"}
            `}
          >
            {loading && activeCategory === category.name ? "Loading..." : category.name}
          </button>
        )
      ))}
      </div>
      <div>
        {posts.length > 0 && (
          <>
            {/* Row 1: 4 columns */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b-2 pb-8">
              {posts.slice(0, 4).map((post, index) => (
                <li key={post.id ?? index}>
                  <Link href={`/${post.slug}`} className="block">
                    <Image
                      src={post?.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
                      alt={post?.featuredImage?.node?.altText || "Image"}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                    <h3 className="mt-3 font-semibold">{post.title}</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      {getExcerpt(post.excerpt)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Row 2: 2 columns */}
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.slice(4, 6).map((post, index) => (
                <li key={post.id ?? `b-${index}`}>
                  <Link href={`/${post.slug}`} className="block">
                    <Image
                      src={post?.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
                      alt={post?.featuredImage?.node?.altText || "Image"}
                      width={600}
                      height={400}
                      className="w-full h-48 object-cover"
                    />
                    <h3 className="mt-3 font-semibold">{post.title}</h3>
                    <div className="mt-2 text-sm text-gray-600">
                      {getExcerpt(post.excerpt)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="mt-8 w-full flex justify-center mt-5">
        <button className="custom-button">
          <Link href={`/category/${handleSpecielChar(activeCategory || "")}`}>
            <p>
              Läs mer om {activeCategory}
            </p>
          </Link>
        </button>
      </div>
    </div>
  );
}
