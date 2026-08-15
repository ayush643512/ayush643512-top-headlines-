import { z } from "zod";

export const CATEGORIES = [
  "world",
  "technology",
  "business",
  "science",
  "culture",
  "politics",
  "other",
] as const;

export const MAX_PDF_BYTES = 25 * 1024 * 1024; // 25MB
export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB

export const documentMetadataSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(160, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),
  category: z.enum(CATEGORIES),
  keywords: z
    .array(z.string().trim().min(1).max(40))
    .max(15, "Use at most 15 keywords")
    .default([]),
  published: z.boolean().default(true),
});

export function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

export function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

export function sanitizeFileName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

export function slugify(title: string) {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") +
    "-" +
    Math.random().toString(36).slice(2, 7)
  );
}
