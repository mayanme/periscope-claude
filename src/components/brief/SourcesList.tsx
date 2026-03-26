"use client";

import { useState } from "react";
import type { Sources } from "@/types/brief";

export default function SourcesList({ sources }: { sources: Sources }) {
  const [open, setOpen] = useState(false);

  if (sources.urls.length === 0) return null;

  return (
    <div className="sources-section mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden print-hide">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          {sources.urls.length} Sources Used
        </span>
        <svg className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-gray-100 px-6 py-4">
          <ul className="space-y-1.5">
            {sources.urls.map((url, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:underline truncate block max-w-full no-href-print"
                  title={sources.titles[i] ?? url}
                >
                  {sources.titles[i] ?? url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
