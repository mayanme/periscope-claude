"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import UrlInput from "./UrlInput";
import PdfUpload from "./PdfUpload";
import ErrorBanner from "@/components/ui/ErrorBanner";

type TabType = "url" | "pdf";

export default function AddDealForm() {
  const router = useRouter();
  const [tab, setTab] = useState<TabType>("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (tab === "url" && !url.trim()) {
      setError("Please enter a company URL.");
      return;
    }
    if (tab === "pdf" && !file) {
      setError("Please select a pitch deck PDF.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("type", tab);
      if (tab === "url") formData.append("url", url.trim());
      if (tab === "pdf" && file) formData.append("file", file);

      const res = await fetch("/api/deals", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Failed to create deal");
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tab toggle */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-lg w-fit">
        {(["url", "pdf"] as TabType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => { setTab(t); setError(null); }}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "url" ? "Company URL" : "Pitch Deck PDF"}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="min-h-[120px]">
        {tab === "url" && <UrlInput value={url} onChange={setUrl} />}
        {tab === "pdf" && <PdfUpload file={file} onChange={setFile} />}
      </div>

      {error && <ErrorBanner message={error} onDismiss={() => setError(null)} />}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button type="submit" loading={submitting} size="lg">
          {submitting ? "Starting research…" : "Generate Brief"}
        </Button>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>

      <p className="text-xs text-gray-400">
        Research typically takes 30–60 seconds. You can navigate away — the brief will be ready when you return.
      </p>
    </form>
  );
}
