"use client";

import { useMemo, useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { sanitizeQuery, filterByTitle, highlightAll } from "@/lib/search";
import type { PostTitleSlug } from "@/lib/types";
import { Search as SearchIcon, X as XIcon } from "lucide-react";

type Props = {
  posts: PostTitleSlug[];  
  action?: string;         
  hrefPrefix?: string;      
  placeholder?: string;
  limitWidth?: string;
};

export default function SearchBar({
  posts,
  action = "/search",
  hrefPrefix = "/",
  placeholder = "Sök…",
  limitWidth = "100%"
}: Props) {
  const router = useRouter();
  const [value, setValue] = useState("");

  // User can now type anything — spaces included
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  // Suggestions based on raw user input (not sanitized yet)
  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return filterByTitle(posts, q).slice(0, 2);
  }, [posts, value]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    // sanitize only here (NOT while typing)
    const cleaned = sanitizeQuery(value);
    if (!cleaned) return;

    clear();

    if (suggestions.length > 0) {
      router.push(`${hrefPrefix}${suggestions[0].slug}`);
    } else {
      router.push(`${action}?q=${encodeURIComponent(cleaned)}`);
    }
  };

  const clear = () => setValue("");

  const showDropdown = value.trim() !== "" && posts.length > 0;

  return (
    <div className="relative mx-auto" style={{ maxWidth: limitWidth }}>

      <form className="relative" onSubmit={onSubmit}>
        <input
          type="text"
          name="q"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border p-2 pr-16 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
          autoComplete="off"
          inputMode="search"
          aria-label="Sök inlägg"
          maxLength={80}
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

      {showDropdown && (
        <ul className="absolute left-0 right-0 top-full mt-2 z-50 max-h-72 overflow-auto rounded-xl border bg-white shadow-lg">
          {suggestions.map((p) => (
            <li key={p.slug} className="group p-3 hover:bg-gray-50">
              <Link
                href={`${hrefPrefix}${p.slug}`}
                className="font-medium text-gray-900 hover:underline"
                onClick={clear}
              >
                {highlightAll(p.title, value)}
              </Link>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
