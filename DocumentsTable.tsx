"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Eye, Pencil, Trash2, FileText, X, Loader2 } from "lucide-react";
import { formatBytes, CATEGORIES } from "@/lib/validations";
import type { HeadlineDocument, DocumentCategory } from "@/types/document";

export default function DocumentsTable({
  initialDocuments,
}: {
  initialDocuments: HeadlineDocument[];
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [editing, setEditing] = useState<HeadlineDocument | null>(null);
  const [deleting, setDeleting] = useState<HeadlineDocument | null>(null);
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    if (!deleting) return;
    setBusy(true);
    const res = await fetch(`/api/documents/${deleting.id}`, { method: "DELETE" });
    setBusy(false);
    if (res.ok) {
      setDocuments((docs) => docs.filter((d) => d.id !== deleting.id));
      setDeleting(null);
    } else {
      alert("Delete failed. Please try again.");
    }
  };

  const handleSaveEdit = async (updated: Partial<HeadlineDocument>) => {
    if (!editing) return;
    setBusy(true);
    const res = await fetch(`/api/documents/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    setBusy(false);
    if (res.ok) {
      const { document } = await res.json();
      setDocuments((docs) => docs.map((d) => (d.id === document.id ? document : d)));
      setEditing(null);
    } else {
      alert("Update failed. Please try again.");
    }
  };

  return (
    <>
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm min-w-[720px]">
          <thead className="bg-black/30 text-white/40 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Thumbnail</th>
              <th className="text-left px-4 py-3 font-medium">Title</th>
              <th className="text-left px-4 py-3 font-medium">Category</th>
              <th className="text-left px-4 py-3 font-medium">Uploaded</th>
              <th className="text-left px-4 py-3 font-medium">Size</th>
              <th className="text-left px-4 py-3 font-medium">Downloads</th>
              <th className="text-left px-4 py-3 font-medium">Status</th>
              <th className="text-right px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-white/[0.02]">
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-lg bg-panel overflow-hidden relative flex items-center justify-center">
                    {doc.thumbnail_url ? (
                      <Image src={doc.thumbnail_url} alt="" fill className="object-cover" />
                    ) : (
                      <FileText className="w-4 h-4 text-purple-bright/50" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 max-w-[220px] truncate">{doc.title}</td>
                <td className="px-4 py-3 capitalize text-white/60">{doc.category}</td>
                <td className="px-4 py-3 text-white/50">
                  {new Date(doc.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-white/50">{formatBytes(doc.file_size)}</td>
                <td className="px-4 py-3 text-white/50">{doc.downloads}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      doc.published
                        ? "bg-green-500/15 text-green-400"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    {doc.published ? "Published" : "Draft"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/documents/${doc.id}`}
                      target="_blank"
                      className="p-2 rounded-lg hover:bg-white/10"
                      aria-label="View"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setEditing(doc)}
                      className="p-2 rounded-lg hover:bg-white/10"
                      aria-label="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(doc)}
                      className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-400"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {documents.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center text-white/30 py-10">
                  No documents yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditModal
          doc={editing}
          busy={busy}
          onClose={() => setEditing(null)}
          onSave={handleSaveEdit}
        />
      )}

      {deleting && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-5">
          <div className="glass rounded-2xl p-6 max-w-sm w-full">
            <h3 className="font-display text-lg mb-2">Delete document?</h3>
            <p className="text-white/50 text-sm mb-6">
              Are you sure you want to delete this document? This also removes
              the file from storage and cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleting(null)}
                className="px-4 py-2 rounded-full text-sm text-white/60 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={busy}
                className="px-4 py-2 rounded-full text-sm bg-red-500/90 hover:bg-red-500 disabled:opacity-50 flex items-center gap-2"
              >
                {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function EditModal({
  doc,
  busy,
  onClose,
  onSave,
}: {
  doc: HeadlineDocument;
  busy: boolean;
  onClose: () => void;
  onSave: (updated: Partial<HeadlineDocument>) => void;
}) {
  const [title, setTitle] = useState(doc.title);
  const [description, setDescription] = useState(doc.description);
  const [category, setCategory] = useState<DocumentCategory>(doc.category);
  const [published, setPublished] = useState(doc.published);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-5">
      <div className="glass rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Edit document</h3>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none"
            placeholder="Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
            placeholder="Description"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as DocumentCategory)}
            className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-panel">
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-white/60">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            Published
          </label>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-full text-sm text-white/60 hover:bg-white/5">
            Cancel
          </button>
          <button
            onClick={() => onSave({ title, description, category, published })}
            disabled={busy}
            className="px-4 py-2 rounded-full text-sm bg-purple-bright hover:shadow-glow disabled:opacity-50 flex items-center gap-2"
          >
            {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
