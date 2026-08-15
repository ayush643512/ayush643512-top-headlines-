"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Download, FileText, Eye } from "lucide-react";
import { formatBytes } from "@/lib/validations";
import type { DocumentListItem } from "@/types/document";

export default function DocumentCard({
  doc,
  onDownload,
}: {
  doc: DocumentListItem;
  onDownload?: (doc: DocumentListItem) => void;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45 }}
      className="group glass rounded-2xl overflow-hidden hover:shadow-glow hover:-translate-y-1 transition-all duration-300"
    >
      <Link href={`/documents/${doc.id}`} className="block relative aspect-[4/3] bg-panel">
        {doc.thumbnail_url ? (
          <Image
            src={doc.thumbnail_url}
            alt={`Thumbnail for ${doc.title}`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileText className="w-14 h-14 text-purple-bright/50" />
          </div>
        )}
        <span className="absolute top-3 left-3 text-[11px] uppercase tracking-wide bg-ink/70 border border-purple-bright/30 text-purple-bright px-2.5 py-1 rounded-full">
          {doc.category}
        </span>
      </Link>

      <div className="p-5">
        <Link href={`/documents/${doc.id}`}>
          <h3 className="font-display text-lg font-semibold mb-1.5 line-clamp-2 group-hover:text-purple-bright transition-colors">
            {doc.title}
          </h3>
        </Link>
        <p className="text-sm text-white/55 line-clamp-2 mb-4">{doc.description}</p>

        <div className="flex items-center justify-between text-xs text-white/40 mb-4">
          <span>{new Date(doc.created_at).toLocaleDateString()}</span>
          <span>{formatBytes(doc.file_size)}</span>
          <span className="flex items-center gap-1">
            <Download className="w-3 h-3" /> {doc.downloads}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/documents/${doc.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-white/5 hover:bg-purple-bright/20 border border-white/10 py-2 text-sm transition-colors"
          >
            <Eye className="w-3.5 h-3.5" /> Read
          </Link>
          <button
            onClick={() => onDownload?.(doc)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-full bg-neon/90 hover:bg-neon text-ink font-medium py-2 text-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>
    </motion.article>
  );
}
