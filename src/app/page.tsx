import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import DealTable from "@/components/dashboard/DealTable";

export default function DashboardPage() {
  return (
    <PageShell
      title="Deal Pipeline"
      subtitle="Your active deals and generated intelligence briefs."
      actions={
        <Link
          href="/deals/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors"
        >
          + Add Deal
        </Link>
      }
    >
      <DealTable />
    </PageShell>
  );
}
