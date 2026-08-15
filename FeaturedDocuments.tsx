"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import DocumentCard from "@/components/DocumentCard";
import { DocumentGridSkeleton } from "@/components/LoadingSkeleton";
import type { DocumentListItem } from "@/types/document";
import { downloadDocument } from "@/lib/download-client";

export default function FeaturedDocuments() {
  const [docs, setDocs] = useState<DocumentListItem[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/documents?sort=latest&limit=6")
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setDocs(data.documents ?? []);
      })
      .catch(() => !cancelled && setDocs([]));
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-5 md:px-8 py-16 md:py-24">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-xs uppercase tracking-[0.2em] text-purple-bright/70">
            The library
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mt-2">
            Featured Documents
          </h2>
        </div>
        <Link
          href="/documents"
          className="hidden sm:inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-neon transition-colors"
        >
          View all <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {docs === null ? (
        <DocumentGridSkeleton />
      ) : docs.length === 0 ? (
        <p className="text-white/40 text-sm">
          No documents published yet. Check back soon.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} onDownload={downloadDocument} />
          ))}
        </div>
      )}
    </section>
  );
}
