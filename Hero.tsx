"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, FileStack } from "lucide-react";

const ThreeScene = dynamic(() => import("./ThreeScene"), {
  ssr: false,
  loading: () => <div className="w-full h-full animate-pulse" />,
});

function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

const title = "Top Headlines";

export default function Hero() {
  const webglSupported = useWebGLSupport();
  const isMobile = useIsMobile();

  return (
    <section className="relative overflow-hidden bg-grid pt-28 md:pt-36 pb-16 md:pb-24">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-purple-deep/30 rounded-full blur-[120px]" />
      <div className="pointer-events-none absolute top-10 -right-32 w-[28rem] h-[28rem] bg-neon/10 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-purple-bright/80 mb-5"
          >
            <FileStack className="w-3.5 h-3.5" />
            A digital newspaper for documents
          </motion.div>

          <h1 className="font-[var(--font-cursive)] italic font-semibold text-5xl sm:text-6xl md:text-7xl leading-[1.05] mb-4">
            <span className="sr-only">{title}</span>
            <motion.span
              aria-hidden="true"
              className="text-gradient inline-block"
              style={{ textShadow: "0 0 60px rgba(168,85,247,0.35)" }}
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              animate={{ clipPath: "inset(0 0% 0 0)" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            >
              {title}
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-display text-xl md:text-2xl text-white/90 mb-3"
          >
            Read. Discover. Download.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-white/60 max-w-md mb-8 leading-relaxed"
          >
            A modern digital library for discovering and accessing important
            documents and headlines.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="/documents"
              className="group inline-flex items-center gap-2 rounded-full bg-purple-bright px-6 py-3 font-medium text-white shadow-glow hover:shadow-[0_0_55px_rgba(168,85,247,0.55)] hover:-translate-y-0.5 transition-all"
            >
              Explore Documents
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-full border border-neon/40 px-6 py-3 font-medium text-neon hover:bg-neon/10 hover:shadow-glow-yellow hover:-translate-y-0.5 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </Link>
          </motion.div>
        </div>

        <div className="relative h-72 sm:h-96 md:h-[28rem]">
          {webglSupported === false ? (
            <div className="w-full h-full flex items-center justify-center glass rounded-3xl">
              <FileStack className="w-20 h-20 text-purple-bright animate-float" />
            </div>
          ) : webglSupported === null ? (
            <div className="w-full h-full rounded-3xl bg-panel/40 animate-pulse" />
          ) : (
            <ThreeScene reduced={isMobile} />
          )}
        </div>
      </div>
    </section>
  );
}
