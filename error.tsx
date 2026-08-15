"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-grid">
      <AlertTriangle className="w-14 h-14 text-neon/70 mb-6" />
      <h1 className="font-display text-3xl mb-2">Something went wrong</h1>
      <p className="text-white/50 mb-8 max-w-sm">
        Check your connection and try again.
      </p>
      <button
        onClick={reset}
        className="rounded-full bg-purple-bright px-6 py-3 font-medium hover:shadow-glow transition-all"
      >
        Try Again
      </button>
    </main>
  );
}
