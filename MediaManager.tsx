"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, Copy, Trash2, Check } from "lucide-react";
import { isImageFile, formatBytes } from "@/lib/validations";
import type { MediaItem } from "@/types/media";

export default function MediaManager({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [media, setMedia] = useState(initialMedia);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback((files: FileList | File[]) => {
    const valid = Array.from(files).filter(isImageFile);
    if (valid.length === 0) return;

    setUploading(true);
    setProgress(0);

    const formData = new FormData();
    valid.forEach((f) => formData.append("images", f));

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/media/upload");
    xhr.upload.onprogress = (evt) => {
      if (evt.lengthComputable) setProgress(Math.round((evt.loaded / evt.total) * 100));
    };
    xhr.onload = () => {
      setUploading(false);
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText);
        setMedia((m) => [...(data.media ?? []), ...m]);
      } else {
        alert("Upload failed. Please try again.");
      }
    };
    xhr.onerror = () => {
      setUploading(false);
      alert("Something went wrong. Check your connection and try again.");
    };
    xhr.send(formData);
  }, []);

  const handleDelete = async (item: MediaItem) => {
    if (!confirm("Delete this image?")) return;
    const res = await fetch(`/api/media?id=${item.id}`, { method: "DELETE" });
    if (res.ok) {
      setMedia((m) => m.filter((x) => x.id !== item.id));
    } else {
      alert("Delete failed. Please try again.");
    }
  };

  const handleCopy = async (item: MediaItem) => {
    await navigator.clipboard.writeText(item.file_url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition-colors mb-4 ${
          dragOver ? "border-purple-bright bg-purple-bright/5" : "border-white/15 hover:border-white/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-2 text-white/50">
          <UploadCloud className="w-8 h-8" />
          <p className="text-sm">Drag &amp; drop images here, or click to browse</p>
          <p className="text-xs text-white/30">Multiple files supported</p>
        </div>
      </div>

      {uploading && (
        <div className="mb-6 space-y-1.5">
          <div className="flex justify-between text-xs text-white/50">
            <span>Uploading…</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-bright to-neon transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <div key={item.id} className="glass rounded-xl overflow-hidden group">
            <div className="relative aspect-square bg-panel">
              <Image src={item.file_url} alt={item.file_name} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="text-xs truncate mb-1">{item.file_name}</p>
              <p className="text-[11px] text-white/30 mb-2">{formatBytes(item.file_size)}</p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => handleCopy(item)}
                  className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
                >
                  {copiedId === item.id ? (
                    <Check className="w-3 h-3 text-green-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  {copiedId === item.id ? "Copied" : "Copy URL"}
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Delete image"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {media.length === 0 && !uploading && (
          <p className="col-span-full text-white/30 text-sm py-10 text-center">
            No images uploaded yet.
          </p>
        )}
      </div>
    </div>
  );
}
