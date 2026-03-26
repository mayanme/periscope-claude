"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/dashboard/StatusBadge";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";

type DealStatus = "PENDING" | "RESEARCHING" | "SYNTHESIZING" | "COMPLETE" | "FAILED";

interface Props {
  dealId: string;
  initialStatus: DealStatus;
  errorMessage: string | null;
}

const statusMessages: Record<DealStatus, string> = {
  PENDING: "Queued for research…",
  RESEARCHING: "Researching the company across 10 data sources…",
  SYNTHESIZING: "Synthesizing your intelligence brief with Claude…",
  COMPLETE: "Brief is ready! Redirecting…",
  FAILED: "Research pipeline encountered an error.",
};

export default function BriefPolling({ dealId, initialStatus, errorMessage }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<DealStatus>(initialStatus);
  const [error, setError] = useState<string | null>(errorMessage);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (status === "COMPLETE" || status === "FAILED") return;

    const id = setInterval(async () => {
      try {
        const res = await fetch(`/api/deals/${dealId}`);
        if (!res.ok) return;
        const data = await res.json();
        setStatus(data.deal.status);
        setError(data.deal.errorMessage);

        if (data.deal.status === "COMPLETE") {
          clearInterval(id);
          router.refresh();
        }
      } catch {
        // silent
      }
    }, 2500);

    return () => clearInterval(id);
  }, [dealId, status, router]);

  async function retry() {
    setRetrying(true);
    setError(null);
    try {
      await fetch(`/api/deals/${dealId}/research`, { method: "POST" });
      setStatus("PENDING");
    } finally {
      setRetrying(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-24 text-center px-4">
      <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6">
        {status === "FAILED" ? (
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        ) : (
          <Spinner size="lg" className="text-brand-500" />
        )}
      </div>

      <StatusBadge status={status} />

      <p className="mt-3 text-gray-600 text-sm">
        {statusMessages[status]}
      </p>

      {error && status === "FAILED" && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg text-sm text-red-700 text-left">
          {error}
        </div>
      )}

      {status === "FAILED" && (
        <Button
          className="mt-6"
          loading={retrying}
          onClick={retry}
        >
          Retry Research
        </Button>
      )}

      {status !== "FAILED" && (
        <p className="mt-4 text-xs text-gray-400">
          This typically takes 30–60 seconds. You can also go back to the{" "}
          <a href="/" className="text-brand-600 hover:underline">dashboard</a> and come back.
        </p>
      )}
    </div>
  );
}
