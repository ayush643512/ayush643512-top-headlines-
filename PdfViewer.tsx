"use client";

import { useState, useCallback, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  Download,
  Loader2,
} from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfViewer({
  fileUrl,
  onDownload,
}: {
  fileUrl: string;
  onDownload: () => void;
}) {
  const [numPages, setNumPages] = useState<number>(0);
  const [page, setPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  return (
    <div
      ref={containerRef}
      className="w-full rounded-2xl overflow-hidden glass"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 sm:px-5 py-3 bg-black/40 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Previous page"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/60 min-w-[70px] text-center">
            Page {page} / {numPages || "…"}
          </span>
          <button
            aria-label="Next page"
            onClick={() => setPage((p) => Math.min(numPages, p + 1))}
            disabled={page >= numPages}
            className="p-2 rounded-lg hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            aria-label="Zoom out"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.15))}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/60 w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button
            aria-label="Zoom in"
            onClick={() => setScale((s) => Math.min(2.5, s + 0.15))}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            aria-label="Fullscreen"
            onClick={toggleFullscreen}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Maximize className="w-4 h-4" />
          </button>
          <button
            aria-label="Download"
            onClick={onDownload}
            className="ml-1 p-2 rounded-lg bg-neon text-ink hover:bg-neon/90 transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="w-full overflow-auto max-h-[75vh] flex justify-center bg-black/60 py-6">
        {loading && (
          <div className="flex items-center gap-2 text-white/40 text-sm py-20">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading document…
          </div>
        )}
        <Document
          file={fileUrl}
          onLoadSuccess={onLoadSuccess}
          loading={null}
          error={
            <p className="text-white/50 text-sm py-20">
              Couldn&apos;t load this PDF. Try downloading it instead.
            </p>
          }
        >
          {!loading && (
            <Page
              pageNumber={page}
              scale={scale}
              className="!w-full max-w-full [&>canvas]:mx-auto [&>canvas]:!max-w-full [&>canvas]:!h-auto"
              renderAnnotationLayer
              renderTextLayer
            />
          )}
        </Document>
      </div>
    </div>
  );
}
