import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { triggerPipeline } from "@/lib/pipeline/index";
import * as fs from "fs";
import * as path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "./uploads";

function ensureUploadDir() {
  const dir = path.join(process.cwd(), UPLOAD_DIR, "pitch-decks");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export async function GET() {
  const deals = await prisma.deal.findMany({
    orderBy: { createdAt: "desc" },
    include: { brief: { select: { id: true } } },
  });

  return NextResponse.json({
    deals: deals.map((d) => ({
      id: d.id,
      companyName: d.companyName,
      companyUrl: d.companyUrl,
      status: d.status,
      errorMessage: d.errorMessage,
      createdAt: d.createdAt.toISOString(),
      updatedAt: d.updatedAt.toISOString(),
      hasBrief: d.brief !== null,
    })),
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const type = formData.get("type") as "url" | "pdf";
  const url = formData.get("url") as string | null;
  const file = formData.get("file") as File | null;

  if (type === "url" && !url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }
  if (type === "pdf" && !file) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  // Create the deal record
  const deal = await prisma.deal.create({
    data: {
      companyUrl: url ?? null,
      companyName: url ? new URL(url).hostname.replace("www.", "") : (file?.name ?? ""),
      status: "PENDING",
    },
  });

  // Save PDF if provided
  if (type === "pdf" && file) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = ensureUploadDir();
    const filePath = path.join(uploadDir, `${deal.id}.pdf`);
    fs.writeFileSync(filePath, buffer);

    await prisma.deal.update({
      where: { id: deal.id },
      data: { pitchDeckPath: filePath },
    });
  }

  await triggerPipeline(deal.id);

  return NextResponse.json({ dealId: deal.id }, { status: 201 });
}
