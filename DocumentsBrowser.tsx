"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FileSearch } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import DocumentCard from "@/components/DocumentCard";
import { DocumentGridSkeleton } from "@/components/LoadingSkeleton";
import { downloadDocument } from "@/lib/download-client";
import type { DocumentCategory, DocumentListItem, DocumentSort } from "@/types/document";

export default function DocumentsBrowser() {
  const [docs, setDocs] = useState<DocumentListItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<DocumentCategory | "all">("all");
  const [sort, setSort] = useState<DocumentSort>("latest");

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ sort });
    if (query.trim()) params.set("q", query.trim());
    if (category !== "all") params.set("category", category);

    const handle = setTimeout(() => {
      fetch(`/api/documents?${params.toString()}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data) => setDocs(data.documents ?? []))
        .catch((err) => {
          if (err.name !== "AbortError") setDocs([]);
        });
    }, 250); // debounce search input

    return () => {
      clearTimeout(handle);
      controller.abort();
    };
  }, [query, category, sort]);

  const isEmpty = useMemo(() => docs !== null && docs.length === 0, [docs]);

  return (
    <div>
      <div className="mb-8">
        <SearchBar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      {docs === null ? (
        <DocumentGridSkeleton count={9} />
      ) : isEmpty ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center text-center py-24 glass rounded-2xl"
        >
          <FileSearch className="w-12 h-12 text-purple-bright/50 mb-4 animate-float" />
          <p className="text-lg font-display">No documents found</p>
          <p className="text-white/40 text-sm mt-1">
            Try a different search term or category.
          </p>
        </motion.div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onDownload={downloadDocument} />
          ))}
        </div>
      )}
    </div>
  );
}
