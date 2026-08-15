"use client";

import { Search } from "lucide-react";
import type { DocumentCategory, DocumentSort } from "@/types/document";
import { CATEGORIES } from "@/lib/validations";

export default function SearchBar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: {
  query: string;
  onQueryChange: (v: string) => void;
  category: DocumentCategory | "all";
  onCategoryChange: (v: DocumentCategory | "all") => void;
  sort: DocumentSort;
  onSortChange: (v: DocumentSort) => void;
}) {
  return (
    <div className="glass rounded-2xl p-3 md:p-4 flex flex-col md:flex-row gap-3">
      <div className="flex-1 flex items-center gap-2 bg-black/30 rounded-xl px-4 py-2.5">
        <Search className="w-4 h-4 text-white/40 shrink-0" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Search documents..."
          aria-label="Search documents"
          className="bg-transparent outline-none w-full text-sm placeholder:text-white/30"
        />
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as DocumentCategory | "all")}
        aria-label="Filter by category"
        className="bg-black/30 rounded-xl px-4 py-2.5 text-sm outline-none border border-white/5 focus:border-purple-bright/50"
      >
        <option value="all">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c} value={c} className="bg-panel">
            {c[0].toUpperCase() + c.slice(1)}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as DocumentSort)}
        aria-label="Sort documents"
        className="bg-black/30 rounded-xl px-4 py-2.5 text-sm outline-none border border-white/5 focus:border-purple-bright/50"
      >
        <option value="latest" className="bg-panel">Latest</option>
        <option value="downloads" className="bg-panel">Most downloaded</option>
      </select>
    </div>
  );
}
