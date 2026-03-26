// Use the direct file path to avoid pdf-parse's test file loader bug
import pdfParse from "pdf-parse/lib/pdf-parse.js";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text;
}
