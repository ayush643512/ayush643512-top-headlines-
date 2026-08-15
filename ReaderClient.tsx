"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Share2, Check } from "lucide-react";
import { downloadDocument } from "@/lib/download-client";
import type { HeadlineDocument } from "@/types/document";

const PdfViewer = dynamic(() => import("@/components/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 rounded-2xl glass animate-pulse" />
  ),
});

export default function ReaderClient({ doc }: { doc: HeadlineDocument }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: doc.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // user cancelled share sheet — no action needed
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-neon transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? "Link copied" : "Share"}
        </button>
      </div>
      <PdfViewer fileUrl={doc.file_url} onDownload={() => downloadDocument(doc)} />
    </div>
  );
}
