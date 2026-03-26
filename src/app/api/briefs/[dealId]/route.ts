import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dealId: string }> }
) {
  const { dealId } = await params;

  const brief = await prisma.brief.findUnique({
    where: { dealId },
  });

  if (!brief) {
    return NextResponse.json({ error: "Brief not found" }, { status: 404 });
  }

  return NextResponse.json({
    brief: {
      id: brief.id,
      dealId: brief.dealId,
      companyOverview: brief.companyOverview,
      founderAndTeam: brief.founderAndTeam,
      marketLandscape: brief.marketLandscape,
      tractionFinancials: brief.tractionFinancials,
      fundFit: brief.fundFit,
      sources: brief.sources,
      createdAt: brief.createdAt.toISOString(),
    },
  });
}
