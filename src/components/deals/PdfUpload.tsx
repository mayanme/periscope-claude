"use client";

import { useRef, useState } from "react";

interface PdfUploadProps {
  file: File | null;
  onChange: (f: File | null) => void;
}

const MAX_SIZE_MB = 20;

export default function PdfUpload({ file, onChange }: PdfUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [sizeError, setSizeError] = useState(false);

  function handleFile(f: File) {
    setSizeError(false);
    if (!f.name.endsWith(".pdf") && f.type !== "application/pdf") {
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setSizeError(true);
      return;
    }
    onChange(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  if (file) {
    return (
      <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <svg className="h-8 w-8 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8" stroke="white" strokeWidth="1.5" fill="none"/>
        </svg>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
        </div>
        <button
          type="button"
          onClick={() => { onChange(null); setSizeError(false); }}
          className="text-gray-400 hover:text-gray-600"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
          dragOver
            ? "border-brand-400 bg-brand-50"
            : "border-gray-300 bg-gray-50 hover:bg-gray-100"
        }`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-brand-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-400 mt-1">PDF only, up to {MAX_SIZE_MB}MB</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,application/pdf"
        onChange={handleChange}
        className="hidden"
      />
      {sizeError && (
        <p className="text-xs text-red-600">File is too large. Maximum size is {MAX_SIZE_MB}MB.</p>
      )}
      <p className="text-xs text-gray-500">
        Upload a pitch deck PDF. Periscope will extract company information from the slides.
      </p>
    </div>
  );
}
