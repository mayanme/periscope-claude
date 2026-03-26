import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { storeDocumentChunks } from "@/lib/pipeline/rag";
import { extractTextFromPdf } from "@/lib/utils/pdf";
import * as fs from "fs";
import * as path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR ?? "./uploads";

function ensureUploadDir() {
  const dir = path.join(process.cwd(), UPLOAD_DIR, "internal-docs");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export async function GET() {
  const docs = await prisma.internalDoc.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { chunks: true } } },
  });

  return NextResponse.json({
    docs: docs.map((d) => ({
      id: d.id,
      filename: d.filename,
      createdAt: d.createdAt.toISOString(),
      chunkCount: d._count.chunks,
    })),
  });
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["application/pdf", "text/plain", "text/markdown"];
  if (!allowedTypes.includes(file.type) && !file.name.endsWith(".txt") && !file.name.endsWith(".md")) {
    return NextResponse.json(
      { error: "Only PDF, TXT, and MD files are supported" },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadDir = ensureUploadDir();

  // Create DB record first to get the ID for the filename
  const doc = await prisma.internalDoc.create({
    data: {
      filename: file.name,
      filePath: "", // will update below
    },
  });

  const ext = path.extname(file.name) || ".bin";
  const filePath = path.join(uploadDir, `${doc.id}${ext}`);
  fs.writeFileSync(filePath, buffer);

  await prisma.internalDoc.update({
    where: { id: doc.id },
    data: { filePath },
  });

  // Extract text
  let text = "";
  if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
    text = await extractTextFromPdf(buffer);
  } else {
    text = buffer.toString("utf-8");
  }

  // Chunk and store for RAG
  const chunkCount = await storeDocumentChunks(doc.id, text);

  return NextResponse.json(
    {
      doc: {
        id: doc.id,
        filename: doc.filename,
        chunkCount,
      },
    },
    { status: 201 }
  );
}
