import PageShell from "@/components/layout/PageShell";
import AddDealForm from "@/components/deals/AddDealForm";

export default function NewDealPage() {
  return (
    <PageShell
      title="Add Deal"
      subtitle="Submit a company URL or pitch deck PDF to generate an intelligence brief."
    >
      <div className="max-w-xl bg-white rounded-xl border border-gray-200 p-8">
        <AddDealForm />
      </div>
    </PageShell>
  );
}
