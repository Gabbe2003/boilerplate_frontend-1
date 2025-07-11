import dynamic from "next/dynamic";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

const RecommendationList = dynamic(() => import("./RecommendationList"), { ssr: false });

export default function PostRecommendations({ currentSlug }: { currentSlug: string }) {
  const [open, setOpen] = useState(true);

  return (
    <Card
      className={clsx(
        "border border-neutral-100 shadow-sm transition-all duration-500 bg-white/90 overflow-hidden",
        "rounded-sm"
      )}
      style={{
        maxHeight: open ? "9999px" : "100px", // Ensures header + tap helper is visible when closed
        transition: "max-height 0.5s cubic-bezier(.4,0,.2,1)"
      }}
    >
      {/* Header toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className={clsx(
          "w-full flex items-center gap-2 p-3 border-b border-neutral-100/80 bg-neutral-50",
          "focus-visible:ring-2 focus-visible:ring-blue-800 transition",
          "hover:bg-blue-50 cursor-pointer select-none"
        )}
        aria-expanded={open}
        aria-controls="recommendation-list"
        type="button"
        tabIndex={0}
      >
        <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-800 flex-shrink-0" />
        <span className="text-lg font-semibold text-blue-700 dark:text-blue-800 tracking-tight flex-1 text-left">
          Others read
        </span>
        <span className="ml-auto">
          {open ? (
            <ChevronUp className="w-5 h-5 text-neutral-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-neutral-500" />
          )}
        </span>
      </button>

      {/* Animated List */}
      <CardContent className="p-0">
        <div
          id="recommendation-list"
          className={clsx(
            "transition-all duration-500 overflow-hidden",
            open ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"
          )}
          aria-hidden={!open}
        >
          <RecommendationList currentSlug={currentSlug}>
            {(recommendations) => (
              <ul className="space-y-4 px-2 py-3">
                {recommendations.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/${post.slug}`}
                      className="group block overflow-hidden rounded-lg border border-neutral-200 bg-[#fafafa] shadow hover:shadow-lg transition-all hover:border-blue-300 relative focus-visible:ring-2 focus-visible:ring-blue-300"
                    >
                      {post.featuredImage?.node.sourceUrl && (
                        <div className="relative w-full aspect-[6/3] overflow-hidden rounded-md">
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
                        <span className="absolute left-3 top-3 z-20 bg-blue-50 text-blue-700 text-[10px] px-1.5 py-0.5 rounded font-medium shadow-sm">
                          {post.categories.nodes[0].name}
                        </span>
                      )}
                      <div className="px-3 py-2 relative z-10">
                        <h4 className="font-semibold text-sm mb-0.5 group-hover:text-blue-700 transition truncate">
                          {post.title}
                        </h4>
                        <div className="text-[11px] text-neutral-600 truncate">
                          By {post.author?.node.name || 'Admin'} ·{' '}
                          {new Date(post.date).toLocaleDateString('sv-SE', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </div>
                      </div>
                      <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ArrowRight className="w-4 h-4 text-blue-600" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </RecommendationList>
        </div>
      </CardContent>
    </Card>
  );
}
