import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import clsx from "clsx";
import Link from "next/link";
import AdCard from "./adcard";
import { ADS } from "./adsSideBar";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const RecommendationList = dynamic(() => import("./RecommendationList"), { ssr: false });

export default function PostRecommendations({ currentSlug }: { currentSlug: string }) {
  const [adIndex, setAdIndex] = useState(0);
  const AD_ROTATE_INTERVAL = 15000;

  useEffect(() => {
    const interval = setInterval(() => {
      setAdIndex((i) => (i + 1) % ADS.length);
    }, AD_ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card
      className={clsx(
        "border border-neutral-100 shadow-sm transition-all duration-500 bg-white/90 overflow-hidden",
        "rounded-sm"
      )}
    >
      <CardContent className="p-0">
        <div id="recommendation-list">
          <RecommendationList currentSlug={currentSlug}>
            {(recommendations) => {
              const postsToShow = recommendations.slice(0, 2);
              return (
                <ul className="space-y-4 px-2 py-3">
                  {postsToShow.map((post, idx) => (
                    <li key={post.slug}>
                      <Link
                        href={`/${post.slug}`}
                        className="group block overflow-hidden rounded border border-neutral-200 bg-[#fafafa] shadow hover:shadow-lg transition-all hover:border-blue-300 relative focus-visible:ring-2 focus-visible:ring-blue-300"
                      >
                        {post.featuredImage?.node.sourceUrl && (
                          <div className="relative w-full aspect-[6/3] overflow-hidden rounded-t">
                            <Image
                              src={post.featuredImage.node.sourceUrl}
                              alt={post.title}
                              fill
                              className="object-cover transition-transform duration-300 group-hover:scale-105"
                              sizes="160px"
                              style={{ minHeight: 72 }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#fafafa]/60 via-[#fafafa]/5 to-transparent" />
                          </div>
                        )}
                        {post.categories?.nodes?.[0]?.name && (
                          <span className="absolute left-3 top-3 z-20 bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded-sm font-medium shadow-sm">
                            {post.categories.nodes[0].name}
                          </span>
                        )}
                        <div className="px-3 py-2 relative z-10">
                          <h4 className="font-semibold text-sm mb-0.5 group-hover:text-blue-700 transition truncate">
                            {post.title}
                          </h4>
                          <div className="text-[11px] text-neutral-600 truncate">
                            By {post.author?.node.name || 'Admin'} ·{" "}
                            {new Date(post.date).toLocaleDateString("sv-SE", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <ArrowRight className="w-4 h-4 text-blue-600" />
                        </div>
                      </Link>
                      {/* Show ad after the first post */}
                      {idx === 0 && (
                        <div className="my-2">
                          <AdCard ad={ADS[adIndex]} />
                        </div>
                      )}
                    </li>
                  ))}
                  {/* Optionally, show a second ad at the end */}
                  <li className="my-2">
                    <AdCard ad={ADS[(adIndex + 1) % ADS.length]} />
                  </li>
                </ul>
              );
            }}
          </RecommendationList>
        </div>
      </CardContent>
    </Card>
  );
}
