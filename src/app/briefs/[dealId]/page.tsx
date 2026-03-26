import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BriefShell from "@/components/brief/BriefShell";
import BriefPolling from "./BriefPolling";
import type { BriefData } from "@/types/brief";

interface PageProps {
  params: Promise<{ dealId: string }>;
}

export default async function BriefPage({ params }: PageProps) {
  const { dealId } = await params;

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    include: { brief: true },
  });

  if (!deal) notFound();

  // Brief is ready
  if (deal.brief) {
    const briefData: BriefData = {
      id: deal.brief.id,
      dealId: deal.brief.dealId,
      companyOverview: deal.brief.companyOverview as unknown as BriefData["companyOverview"],
      founderAndTeam: deal.brief.founderAndTeam as unknown as BriefData["founderAndTeam"],
      marketLandscape: deal.brief.marketLandscape as unknown as BriefData["marketLandscape"],
      tractionFinancials: deal.brief.tractionFinancials as unknown as BriefData["tractionFinancials"],
      fundFit: deal.brief.fundFit as unknown as BriefData["fundFit"],
      sources: deal.brief.sources as unknown as BriefData["sources"],
      createdAt: deal.brief.createdAt.toISOString(),
    };

    return (
      <BriefShell
        brief={briefData}
        companyName={deal.companyName}
        companyUrl={deal.companyUrl}
      />
    );
  }

  // Still processing or failed
  return (
    <BriefPolling
      dealId={dealId}
      initialStatus={deal.status}
      errorMessage={deal.errorMessage}
    />
  );
}
