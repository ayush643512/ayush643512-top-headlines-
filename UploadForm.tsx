"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { CATEGORIES, isPdfFile, isImageFile, formatBytes } from "@/lib/validations";
import type { DocumentCategory } from "@/types/document";

type Status = "idle" | "uploading" | "success" | "error";

export default function UploadForm() {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("technology");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [published, setPublished] = useState(true);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && isPdfFile(file)) setPdfFile(file);
    else setErrorMsg("Only PDF files are accepted.");
  }, []);

  const addKeyword = () => {
    const k = keywordInput.trim();
    if (k && !keywords.includes(k) && keywords.length < 15) {
      setKeywords([...keywords, k]);
    }
    setKeywordInput("");
  };

  const resetForm = () => {
    setPdfFile(null);
    setThumbnail(null);
    setTitle("");
    setDescription("");
    setCategory("technology");
    setKeywords([]);
    setPublished(true);
    setProgress(0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!pdfFile) {
      setErrorMsg("A PDF file is required.");
      return;
    }
    if (!title.trim()) {
      setErrorMsg("Title is required.");
      return;
    }
    if (!description.trim()) {
      setErrorMsg("Description is required.");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", pdfFile);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("category", category);
    formData.append("keywords", JSON.stringify(keywords));
    formData.append("published", String(published));

    setStatus("uploading");
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/documents/upload");
    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) {
        setProgress(Math.round((evt.loaded / evt.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        setStatus("success");
        resetForm();
      } else {
        setStatus("error");
        try {
          const body = JSON.parse(xhr.responseText);
          setErrorMsg(body.error || "Upload failed. Please try again.");
        } catch {
          setErrorMsg("Upload failed. Please try again.");
        }
      }
    };
    xhr.onerror = () => {
      setStatus("error");
      setErrorMsg("Something went wrong. Check your connection and try again.");
    };
    xhr.send(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* PDF drop zone */}
      <div>
        <label className="block text-sm text-white/60 mb-2">PDF File</label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            dragOver ? "border-purple-bright bg-purple-bright/5" : "border-white/15 hover:border-white/30"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file && isPdfFile(file)) setPdfFile(file);
              else if (file) setErrorMsg("Only PDF files are accepted.");
            }}
          />
          {pdfFile ? (
            <div className="flex items-center justify-center gap-3 text-sm">
              <FileText className="w-5 h-5 text-purple-bright" />
              <span>{pdfFile.name}</span>
              <span className="text-white/40">{formatBytes(pdfFile.size)}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPdfFile(null);
                }}
                className="text-white/40 hover:text-red-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-white/50">
              <UploadCloud className="w-8 h-8" />
              <p className="text-sm">Drag &amp; drop a PDF here, or click to browse</p>
              <p className="text-xs text-white/30">PDF only, up to 25MB</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm text-white/60 mb-2">Title</label>
        <input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full bg-black/30 border border-white/10 focus:border-purple-bright/50 rounded-xl px-4 py-2.5 text-sm outline-none"
          placeholder="e.g. Global Markets Outlook 2026"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm text-white/60 mb-2">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full bg-black/30 border border-white/10 focus:border-purple-bright/50 rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
          placeholder="A short summary of what this document covers…"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm text-white/60 mb-2">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as DocumentCategory)}
            className="w-full bg-black/30 border border-white/10 focus:border-purple-bright/50 rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-panel">
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2">Thumbnail (optional)</label>
          <label className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm cursor-pointer hover:border-white/25">
            <ImageIcon className="w-4 h-4 text-white/40" />
            {thumbnail ? thumbnail.name : "Choose image"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file && isImageFile(file)) setThumbnail(file);
              }}
            />
          </label>
        </div>
      </div>

      <div>
        <label htmlFor="keywords" className="block text-sm text-white/60 mb-2">Keywords</label>
        <div className="flex gap-2 mb-2">
          <input
            id="keywords"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === ",") {
                e.preventDefault();
                addKeyword();
              }
            }}
            placeholder="Type a keyword and press Enter"
            className="flex-1 bg-black/30 border border-white/10 focus:border-purple-bright/50 rounded-xl px-4 py-2.5 text-sm outline-none"
          />
          <button
            type="button"
            onClick={addKeyword}
            className="px-4 rounded-xl bg-white/5 hover:bg-white/10 text-sm"
          >
            Add
          </button>
        </div>
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {keywords.map((k) => (
              <span
                key={k}
                className="flex items-center gap-1.5 bg-purple-bright/15 text-purple-bright text-xs px-3 py-1 rounded-full"
              >
                {k}
                <button
                  type="button"
                  onClick={() => setKeywords(keywords.filter((x) => x !== k))}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <label className="flex items-center gap-3 cursor-pointer w-fit">
        <span className="text-sm text-white/60">Publish immediately</span>
        <button
          type="button"
          role="switch"
          aria-checked={published}
          onClick={() => setPublished((v) => !v)}
          className={`w-11 h-6 rounded-full relative transition-colors ${
            published ? "bg-purple-bright" : "bg-white/15"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
              published ? "translate-x-5" : ""
            }`}
          />
        </button>
      </label>

      <AnimatePresence>
        {status === "uploading" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-1.5"
          >
            <div className="flex justify-between text-xs text-white/50">
              <span>Uploading {pdfFile?.name}</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-bright to-neon"
                animate={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        )}
        {status === "success" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-green-400 text-sm"
          >
            <CheckCircle2 className="w-4 h-4" /> PDF uploaded successfully.
          </motion.div>
        )}
        {(status === "error" || errorMsg) && status !== "uploading" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-red-400 text-sm"
          >
            <AlertCircle className="w-4 h-4" /> {errorMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "uploading"}
        className="inline-flex items-center gap-2 rounded-full bg-purple-bright px-6 py-3 font-medium hover:shadow-glow disabled:opacity-50 transition-all"
      >
        {status === "uploading" && <Loader2 className="w-4 h-4 animate-spin" />}
        Upload PDF
      </button>
    </form>
  );
}
