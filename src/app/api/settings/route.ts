import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const settings = await prisma.firmSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: "My Fund", thesis: "", stageFocus: [], sectorFocus: [] },
  });
  return NextResponse.json({ settings });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { name, thesis, stageFocus, sectorFocus } = body as {
    name?: string;
    thesis?: string;
    stageFocus?: string[];
    sectorFocus?: string[];
  };

  const settings = await prisma.firmSettings.upsert({
    where: { id: 1 },
    update: {
      ...(name !== undefined && { name }),
      ...(thesis !== undefined && { thesis }),
      ...(stageFocus !== undefined && { stageFocus }),
      ...(sectorFocus !== undefined && { sectorFocus }),
    },
    create: {
      id: 1,
      name: name ?? "My Fund",
      thesis: thesis ?? "",
      stageFocus: stageFocus ?? [],
      sectorFocus: sectorFocus ?? [],
    },
  });

  return NextResponse.json({ settings });
}
