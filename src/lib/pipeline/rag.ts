import { prisma } from "@/lib/prisma";
import { chunkText } from "@/lib/utils/chunker";

export async function storeDocumentChunks(
  docId: string,
  text: string
): Promise<number> {
  const chunks = chunkText(text);
  if (chunks.length === 0) return 0;

  // Insert all chunks — the DB trigger auto-populates tsv
  await prisma.$transaction(
    chunks.map((content, idx) =>
      prisma.docChunk.create({
        data: { docId, chunkIdx: idx, content },
      })
    )
  );

  return chunks.length;
}

export async function retrieveRelevantChunks(
  query: string,
  limit = 8
): Promise<string[]> {
  if (!query.trim()) return [];

  try {
    const chunks = await prisma.$queryRaw<{ content: string; rank: number }[]>`
      SELECT content, ts_rank(tsv, query) AS rank
      FROM "DocChunk", plainto_tsquery('english', ${query}) query
      WHERE tsv @@ query
      ORDER BY rank DESC
      LIMIT ${limit}
    `;
    return chunks.map((c) => c.content);
  } catch (err) {
    console.error("[RAG] Full-text search failed:", err);
    return [];
  }
}
