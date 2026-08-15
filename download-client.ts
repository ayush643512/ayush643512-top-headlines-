import type { DocumentListItem } from "@/types/document";

// Shared client-side download handler: records the download event via the
// API (which also increments the counter server-side) and then triggers
// the browser download from the public Supabase Storage URL.
export async function downloadDocument(doc: Pick<DocumentListItem, "id" | "title">) {
  try {
    const res = await fetch("/api/downloads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documentId: doc.id }),
    });
    const data = await res.json();
    if (!res.ok || !data.fileUrl) {
      throw new Error(data.error || "Download failed. Please try again.");
    }
    const link = document.createElement("a");
    link.href = data.fileUrl;
    link.download = `${doc.title}.pdf`;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Check your connection and try again.");
  }
}
