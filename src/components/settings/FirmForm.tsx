"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import type { FirmSettings } from "@/types/settings";

const STAGE_OPTIONS = ["Pre-seed", "Seed", "Series A", "Series B", "Growth"];
const SECTOR_OPTIONS = [
  "B2B SaaS", "Consumer", "Fintech", "Healthtech", "AI/ML", "Deep Tech",
  "Climate", "Enterprise Software", "Infrastructure", "Marketplace",
  "EdTech", "PropTech", "Supply Chain", "Security", "Developer Tools",
];

interface FirmFormProps {
  initial: FirmSettings;
}

export default function FirmForm({ initial }: FirmFormProps) {
  const [name, setName] = useState(initial.name);
  const [thesis, setThesis] = useState(initial.thesis);
  const [stageFocus, setStageFocus] = useState<string[]>(initial.stageFocus);
  const [sectorFocus, setSectorFocus] = useState<string[]>(initial.sectorFocus);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleStage(s: string) {
    setStageFocus((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  function toggleSector(s: string) {
    setSectorFocus((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, thesis, stageFocus, sectorFocus }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <Input
        label="Fund name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Horizon Ventures"
      />

      <Textarea
        label="Investment thesis"
        value={thesis}
        onChange={(e) => setThesis(e.target.value)}
        rows={5}
        placeholder="We invest in B2B SaaS companies at Seed to Series A stage, targeting $500K–$2M checks. We focus on enterprise software with strong founder-market fit and early signs of product-market fit (>$100K ARR or 10+ paying customers)."
        hint="This is used to personalize the Fund Fit section of every brief."
      />

      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">Stage focus</p>
        <div className="flex flex-wrap gap-2">
          {STAGE_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleStage(s)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                stageFocus.includes(s)
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-brand-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="block text-sm font-medium text-gray-700 mb-2">Sector focus</p>
        <div className="flex flex-wrap gap-2">
          {SECTOR_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSector(s)}
              className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                sectorFocus.includes(s)
                  ? "bg-brand-600 text-white border-brand-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-brand-400"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" loading={saving}>
          Save settings
        </Button>
        {saved && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Saved
          </span>
        )}
      </div>
    </form>
  );
}
