"use client";

import { useState, useEffect } from "react";
import Input from "@/components/ui/Input";

interface UrlInputProps {
  value: string;
  onChange: (v: string) => void;
}

function isValidUrl(str: string) {
  try {
    const u = new URL(str);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export default function UrlInput({ value, onChange }: UrlInputProps) {
  const [favicon, setFavicon] = useState<string | null>(null);

  useEffect(() => {
    if (isValidUrl(value)) {
      setFavicon(`https://www.google.com/s2/favicons?domain=${value}&sz=32`);
    } else {
      setFavicon(null);
    }
  }, [value]);

  return (
    <div className="space-y-3">
      <div className="relative">
        {favicon && (
          <img
            src={favicon}
            alt=""
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded"
            onError={() => setFavicon(null)}
          />
        )}
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://company.com"
          className={`w-full py-3 pr-4 border border-gray-300 rounded-lg text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 ${
            favicon ? "pl-10" : "pl-4"
          }`}
        />
      </div>
      <p className="text-xs text-gray-500">
        Periscope will research the company website, news, founders, competitors, and funding history.
      </p>
    </div>
  );
}
