import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { triggerPipeline } from "@/lib/pipeline/index";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ dealId: string }> }
) {
  const { dealId } = await params;

  const deal = await prisma.deal.findUnique({ where: { id: dealId } });
  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Reset status and re-trigger pipeline
  await prisma.deal.update({
    where: { id: dealId },
    data: { status: "PENDING", errorMessage: null },
  });

  await triggerPipeline(dealId);

  return NextResponse.json({ ok: true });
}
