import Link from "next/link";
import { FileX2 } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-grid">
      <FileX2 className="w-14 h-14 text-purple-bright/60 mb-6" />
      <h1 className="font-display text-3xl mb-2">Document not found</h1>
      <p className="text-white/50 mb-8 max-w-sm">
        The page or document you&apos;re looking for doesn&apos;t exist or may have
        been removed.
      </p>
      <Link
        href="/"
        className="rounded-full bg-purple-bright px-6 py-3 font-medium hover:shadow-glow transition-all"
      >
        Go Home
      </Link>
    </main>
  );
}
