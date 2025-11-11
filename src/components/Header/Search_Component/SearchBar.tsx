"use client";

import { useMemo, useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sanitizeQuery, filterByTitle, highlightAll } from "@/lib/search";
import type { PostTitleSlug } from "@/lib/types";
import { Search as SearchIcon, X as XIcon } from "lucide-react";

type Props = {
  posts: PostTitleSlug[];     // up to 100 items fetched on the server
  action?: string;            // where to go when no suggestions; default "/search"
  hrefPrefix?: string;        // e.g. "/blog/" if needed; default "/"
  placeholder?: string;
};

export default function SearchBar({
  posts,
  action = "/search",
  hrefPrefix = "/",
  placeholder = "Sök…",
}: Props) {
  const router = useRouter();
  const [value, setValue] = useState("");

  // Only compute suggestions when the user typed something; show 2 max
  const suggestions = useMemo(() => {
    const q = sanitizeQuery(value);
    if (!q) return [];
    return filterByTitle(posts, q).slice(0, 2);
  }, [posts, value]);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(sanitizeQuery(e.target.value));
  };

  // Enter behavior:
  // - if suggestions exist → go to first post
  // - else → go to /search?q=...
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = sanitizeQuery(value);
    if (!q) return;
    clear(); 
    if (suggestions.length > 0) {
      router.push(`${hrefPrefix}${suggestions[0].slug}`);
    } else {
      router.push(`${action}?q=${encodeURIComponent(q)}`);
    }
  };

  const clear = () => setValue("");

  // Only render dropdown when: user typed AND we actually have posts in memory
  const showDropdown = value.trim().length > 0 && posts.length > 0;

  return (
    <div className="w-full mx-auto relative px-2">
      {/* input */}
      <form className="relative" action={action} method="GET" onSubmit={onSubmit}>
        <input
          type="text"
          name="q"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border p-2 pr-16 border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300"
          inputMode="search"
          autoComplete="off"
          maxLength={80}
          aria-label="Sök inlägg"
        />
        {value && (
          <button
            type="button"
            onClick={clear}
            aria-label="Rensa"
            className="absolute inset-y-0 right-9 flex items-center px-1 text-gray-500 hover:text-gray-700"
          >
            <XIcon className="w-5 h-5" />
          </button>
        )}
        <div className="absolute inset-y-0 right-3 flex items-center text-gray-500 pointer-events-none">
          <SearchIcon className="w-5 h-5" />
        </div>
      </form>

      {/* dropdown: positioned absolutely, same width as input */}
      {showDropdown && (
        <ul className="absolute left-0 right-0 top-full mt-2 z-50 max-h-72 overflow-auto rounded-xl border bg-white shadow-lg">
          {suggestions.map((p) => (
            <li key={p.slug} className="group p-3 hover:bg-gray-50">
              <Link href={`${hrefPrefix}${p.slug}`} className="font-medium text-gray-900 hover:underline">
                {highlightAll(p.title, value)}
              </Link>
            </li>
          ))}
          {/* Silent if no matches — no placeholder text */}
        </ul>
      )}
    </div>
  );
}
