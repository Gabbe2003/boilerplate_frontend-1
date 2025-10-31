'use client';

import { Search } from "lucide-react";

export default function SearchBar() {
  return (
    <form
      className="relative w-full max-w-lg"
      onSubmit={(e) => e.preventDefault()}
    >
      <input
        type="text"
        placeholder="Sök..."
        name="Searchbar"
        className="w-full border p-1 border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300"
      />
      <div className="absolute inset-y-0 right-3 flex items-center text-gray-500">
        <Search className="w-5 h-5" />
      </div>
    </form>
  );
}
