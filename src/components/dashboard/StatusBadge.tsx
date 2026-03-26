"use client";

import Spinner from "@/components/ui/Spinner";

type DealStatus = "PENDING" | "RESEARCHING" | "SYNTHESIZING" | "COMPLETE" | "FAILED";

const config: Record<DealStatus, { label: string; className: string; showSpinner: boolean }> = {
  PENDING: {
    label: "Pending",
    className: "bg-gray-100 text-gray-600",
    showSpinner: false,
  },
  RESEARCHING: {
    label: "Researching",
    className: "bg-blue-100 text-blue-700",
    showSpinner: true,
  },
  SYNTHESIZING: {
    label: "Synthesizing",
    className: "bg-purple-100 text-purple-700",
    showSpinner: true,
  },
  COMPLETE: {
    label: "Complete",
    className: "bg-green-100 text-green-700",
    showSpinner: false,
  },
  FAILED: {
    label: "Failed",
    className: "bg-red-100 text-red-700",
    showSpinner: false,
  },
};

export default function StatusBadge({ status }: { status: DealStatus }) {
  const { label, className, showSpinner } = config[status] ?? config.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full ${className}`}>
      {showSpinner && <Spinner size="sm" />}
      {!showSpinner && status === "COMPLETE" && (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      )}
      {!showSpinner && status === "FAILED" && (
        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
      {label}
    </span>
  );
}
