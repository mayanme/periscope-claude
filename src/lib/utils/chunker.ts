/**
 * Splits text into overlapping chunks suitable for RAG.
 * Target: ~512 chars per chunk with 64 char overlap.
 */
export function chunkText(
  text: string,
  chunkSize = 512,
  overlap = 64
): string[] {
  // Normalize whitespace
  const normalized = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();

  if (normalized.length === 0) return [];

  // Split into paragraphs first
  const paragraphs = normalized.split(/\n\n+/);
  const chunks: string[] = [];
  let currentChunk = "";

  for (const paragraph of paragraphs) {
    const trimmed = paragraph.trim();
    if (!trimmed) continue;

    if (currentChunk.length + trimmed.length + 2 <= chunkSize) {
      currentChunk = currentChunk ? currentChunk + "\n\n" + trimmed : trimmed;
    } else {
      // Flush current chunk if non-empty
      if (currentChunk) {
        chunks.push(currentChunk);
        // Start next chunk with overlap from end of current
        const overlapText = currentChunk.slice(-overlap);
        currentChunk = overlapText + "\n\n" + trimmed;
      } else {
        // Single paragraph too long — split by sentences
        const sentences = trimmed.match(/[^.!?]+[.!?]+/g) ?? [trimmed];
        for (const sentence of sentences) {
          if (currentChunk.length + sentence.length + 1 <= chunkSize) {
            currentChunk = currentChunk ? currentChunk + " " + sentence : sentence;
          } else {
            if (currentChunk) chunks.push(currentChunk);
            currentChunk = sentence.slice(0, chunkSize);
          }
        }
      }
    }
  }

  if (currentChunk) chunks.push(currentChunk);

  return chunks.filter((c) => c.trim().length > 20);
}
