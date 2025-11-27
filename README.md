


***************'
"use client";

import { useEffect, useState } from "react";
import { Category_names, CategoryWithPosts, Post } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { limitExcerpt, handleSpecielChar } from "@/lib/globals/actions";
import ReadPeak from "@/components/Ads/Ads/Readpeak/ReadPeak";
import SectionBreaker from "@/components/SectionBreaker";

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
          `/api/categories?category=${encodeURIComponent(activeCategory)}&take=${encodeURIComponent(6)}`
        );
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
        const data: CategoryWithPosts | null = await res.json();

        if (!cancelled) setPosts(data?.posts.nodes ?? []);
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
    <div className="pt-[var(--section-spacing)] pb-[var(--section-spacing)]  bg-[#F5ECE4]">
      <SectionBreaker color="red" />

      <h2 className="text-2xl text-center sm:text-left text-[#1A1A1A]">
        Våra kategorier
      </h2>

      {/* CATEGORY BUTTONS */}
      <div className="flex flex-wrap gap-4 mt-5 pb-10">
        {getAllCategories.map((category, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(category.name)}
            aria-pressed={activeCategory === category.name}
            disabled={loading && activeCategory === category.name}
            className={`py-2 rounded-sm transition font-medium custom-button !border-black text-sm

            ${activeCategory === category.name
                ? "!bg-black !text-white"
                : "text-[#4B4B4B] hover:text-black"
              }

            ${loading && activeCategory === category.name
                ? "opacity-70 cursor-not-allowed"
                : ""
              }
          `}
          >
            {loading && activeCategory === category.name ? "Loading..." : category.name}
          </button>
        ))}
      </div>

      {/* POSTS LIST */}
      <div>
        {posts.length > 0 && (
          <ul
            className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-4 
        gap-x-6 
        gap-y-10
        border-b-2 border-[#e3d7cc]

        pb-8
        mt-3
      "
          >
            {(() => {
              const randomIndex = Math.floor(Math.random() * 4);

              return posts.slice(0, 6).map((post, index) => {
                const spanClasses =
                  index < 4 ? "col-span-1" : "col-span-1 lg:col-span-2";

                const showRightBorder = index < 3 || index === 4;

                /** -------------------------------------
                 *  AD SLOT
                 * ------------------------------------ */
                if (index === randomIndex) {
                  return (
                    <li
                      key="readpeak-ad"
                      className={`
                  ${spanClasses}
                  flex flex-col
                  transition-shadow
                  ${showRightBorder ? "lg:border-r lg:pr-6 border-[#e3d7cc]" : ""}
                `}
                    >
                      <div className="relative w-full bg-[#f2eee7] rounded-md">
                        <ReadPeak numberOfAds={1} />
                      </div>
                    </li>
                  );
                }

                /** -------------------------------------
                 *  NORMAL POST
                 * ------------------------------------ */
                return (
                  <li
                    key={post.id ?? index}
                    className={` ${spanClasses} transition-shadow  flex h-full  ${index >= 4 ? "flex-col lg:flex-row lg:gap-4" : "flex-col"} ${showRightBorder ? "lg:border-r lg:pr-6 border-[#e3d7cc]" : ""}`}
                  >
                    <Link
                      href={`/${post.slug}`}
                      className={`flex h-full w-full ${index >= 4 ? "flex-col lg:flex-row lg:gap-4" : "flex-col"}`}
                    >
                      {/* NEW IMAGE HANDLING */}
                      <div
                        className={`
    relative overflow-hidden rounded-sm
    flex items-start justify-center
    ${index < 4
                            ? "aspect-[4/3] sm:aspect-[16/9]"
                            : "aspect-[4/3] sm:aspect-[16/10] lg:w-[220px]"
                          }
  `}
                      >
                        <Image
                          src={post?.featuredImage?.node?.sourceUrl || "/placeholder.jpg"}
                          alt={post?.featuredImage?.node?.altText || post.title || "Image"}
                          fill
                          className="object-cover object-center"
                          sizes={index < 4
                            ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                            : "(max-width: 640px) 100vw, 220px"
                          }
                          priority={index === 0}
                          quality={95}
                        />
                      </div>


                      {/* TEXT */}
                      <div
                        className={` py-4 flex flex-col justify-between ${index >= 4 ? "lg:flex-1" : ""}`}
                      >
                        <h3 className="font-semibold text-base leading-snug line-clamp-2">
                          {post.title}
                        </h3>

                        <p className="mt-2 text-xs leading-snug line-clamp-3">
                          {limitExcerpt(post.excerpt)}
                        </p>
                      </div>
                    </Link>
                  </li>


                );
              });
            })()}
          </ul>
        )}
      </div>


      {/* READ MORE BUTTON */}
      <div className="mt-8 w-full flex justify-center mt-5">
        <button className="custom-button !bg-black !text-white px-4 py-2 rounded-sm">
          <Link href={`/category/${handleSpecielChar(activeCategory || "")}`}>
            <p>Läs mer om {activeCategory}</p>
          </Link>
        </button>
      </div>
    </div>
  );

}
