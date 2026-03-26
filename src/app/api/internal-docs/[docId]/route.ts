import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as fs from "fs";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ docId: string }> }
) {
  const { docId } = await params;

  const doc = await prisma.internalDoc.findUnique({ where: { id: docId } });
  if (!doc) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Delete DB record (chunks cascade)
  await prisma.internalDoc.delete({ where: { id: docId } });

  // Delete file
  if (doc.filePath && fs.existsSync(doc.filePath)) {
    fs.unlinkSync(doc.filePath);
  }

  return NextResponse.json({ ok: true });
}
