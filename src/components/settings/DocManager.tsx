"use client";

import { useEffect, useState, useRef } from "react";
import Button from "@/components/ui/Button";
import type { InternalDocSummary } from "@/types/settings";
import { formatRelativeTime } from "@/lib/utils/formatters";

export default function DocManager() {
  const [docs, setDocs] = useState<InternalDocSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function fetchDocs() {
    const res = await fetch("/api/internal-docs");
    if (res.ok) {
      const data = await res.json();
      setDocs(data.docs);
    }
    setLoading(false);
  }

  useEffect(() => { fetchDocs(); }, []);

  async function uploadFile(file: File) {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/internal-docs", { method: "POST", body: formData });
      if (res.ok) await fetchDocs();
    } finally {
      setUploading(false);
    }
  }

  async function deleteDoc(id: string) {
    setDeleting(id);
    try {
      await fetch(`/api/internal-docs/${id}`, { method: "DELETE" });
      setDocs((prev) => prev.filter((d) => d.id !== id));
    } finally {
      setDeleting(null);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) uploadFile(f);
  }

  return (
    <div className="space-y-4">
      {/* Upload zone */}
      <div
        className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          dragOver ? "border-brand-400 bg-brand-50" : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-brand-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-gray-500">Processing document…</p>
          </div>
        ) : (
          <>
            <svg className="h-6 w-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-brand-600">Upload a document</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">PDF, TXT, or MD</p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.txt,.md,text/plain,text/markdown,application/pdf"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
        className="hidden"
      />

      {/* Docs list */}
      {loading ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : docs.length === 0 ? (
        <p className="text-sm text-gray-400 italic">
          No documents uploaded yet. Upload investment memos, thesis documents, or portfolio notes.
        </p>
      ) : (
        <ul className="space-y-2">
          {docs.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex items-center gap-3 min-w-0">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{doc.filename}</p>
                  <p className="text-xs text-gray-400">
                    {doc.chunkCount} chunks · {formatRelativeTime(doc.createdAt)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                loading={deleting === doc.id}
                onClick={() => deleteDoc(doc.id)}
                className="text-gray-400 hover:text-red-500 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
