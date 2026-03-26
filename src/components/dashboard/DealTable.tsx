"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { formatRelativeTime } from "@/lib/utils/formatters";
import Button from "@/components/ui/Button";

type DealStatus = "PENDING" | "RESEARCHING" | "SYNTHESIZING" | "COMPLETE" | "FAILED";

interface Deal {
  id: string;
  companyName: string;
  companyUrl: string | null;
  status: DealStatus;
  errorMessage: string | null;
  createdAt: string;
  hasBrief: boolean;
}

const ACTIVE_STATUSES: DealStatus[] = ["PENDING", "RESEARCHING", "SYNTHESIZING"];

export default function DealTable() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [retrying, setRetrying] = useState<string | null>(null);

  const fetchDeals = useCallback(async () => {
    try {
      const res = await fetch("/api/deals");
      if (!res.ok) return;
      const data = await res.json();
      setDeals(data.deals);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll while any deal is active
  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  useEffect(() => {
    const hasActive = deals.some((d) => ACTIVE_STATUSES.includes(d.status));
    if (!hasActive) return;
    const id = setInterval(fetchDeals, 3000);
    return () => clearInterval(id);
  }, [deals, fetchDeals]);

  async function retryDeal(dealId: string) {
    setRetrying(dealId);
    try {
      await fetch(`/api/deals/${dealId}/research`, { method: "POST" });
      await fetchDeals();
    } finally {
      setRetrying(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
        <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-base font-medium text-gray-900 mb-1">No deals yet</h3>
        <p className="text-sm text-gray-500 mb-6">
          Add your first deal to generate an intelligence brief.
        </p>
        <Link
          href="/deals/new"
          className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
        >
          + Add Deal
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Added</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {deals.map((deal) => (
            <tr key={deal.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  {deal.companyUrl && (
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${deal.companyUrl}&sz=32`}
                      alt=""
                      className="w-6 h-6 rounded"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {deal.companyName || "—"}
                    </p>
                    {deal.companyUrl && (
                      <p className="text-xs text-gray-400 truncate max-w-xs">{deal.companyUrl}</p>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-1">
                  <StatusBadge status={deal.status} />
                  {deal.status === "COMPLETE" && deal.errorMessage && (
                    <p className="text-xs text-amber-600 max-w-xs">{deal.errorMessage}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {formatRelativeTime(deal.createdAt)}
              </td>
              <td className="px-6 py-4 text-right">
                {deal.status === "COMPLETE" && deal.hasBrief && (
                  <Link
                    href={`/briefs/${deal.id}`}
                    className="text-sm font-medium text-brand-600 hover:text-brand-700"
                  >
                    View Brief →
                  </Link>
                )}
                {deal.status === "FAILED" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={retrying === deal.id}
                    onClick={() => retryDeal(deal.id)}
                  >
                    Retry
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
