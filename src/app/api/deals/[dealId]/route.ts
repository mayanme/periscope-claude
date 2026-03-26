import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ dealId: string }> }
) {
  const { dealId } = await params;

  const deal = await prisma.deal.findUnique({
    where: { id: dealId },
    select: {
      id: true,
      companyName: true,
      companyUrl: true,
      status: true,
      errorMessage: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!deal) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ deal: {
    ...deal,
    createdAt: deal.createdAt.toISOString(),
    updatedAt: deal.updatedAt.toISOString(),
  }});
}
