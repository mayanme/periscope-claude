import { exa } from "@/lib/exa";
import { anthropic, CLAUDE_MODEL, extractJson } from "@/lib/claude";
import { extractTextFromPdf } from "@/lib/utils/pdf";
import type { ExtractedInfo } from "@/types/research";
import * as fs from "fs";

export async function extractFromUrl(url: string): Promise<ExtractedInfo> {
  try {
    const result = await exa.getContents([url], {
      text: { maxCharacters: 3000 },
    });

    const page = result.results[0];
    const text = page?.text ?? "";
    const title = page?.title ?? "";

    // Use Claude to extract structured info from the scraped content
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `From the following company website content, extract structured information.

PAGE TITLE: ${title}
URL: ${url}
CONTENT:
${text.slice(0, 2000)}

Return ONLY this JSON (no markdown):
{
  "companyName": "string",
  "companyUrl": "${url}",
  "hq": "City, Country or null",
  "foundingYear": "YYYY or null",
  "description": "one sentence what the company does or null"
}`,
        },
      ],
    });

    const extracted = extractJson(
      response.content[0].type === "text" ? response.content[0].text : ""
    ) as ExtractedInfo;

    return { ...extracted, pitchDeckText: null };
  } catch (err) {
    console.error("[extract] URL extraction failed:", err);
    return {
      companyName: new URL(url).hostname.replace("www.", ""),
      companyUrl: url,
      hq: null,
      foundingYear: null,
      description: null,
      pitchDeckText: null,
    };
  }
}

export async function extractFromPdf(filePath: string): Promise<ExtractedInfo> {
  let pdfText = "";

  try {
    const buffer = fs.readFileSync(filePath);
    pdfText = await extractTextFromPdf(buffer);
  } catch (err) {
    console.error("[extract] PDF read/parse failed:", err);
    return {
      companyName: "Unknown Company",
      companyUrl: null,
      hq: null,
      foundingYear: null,
      description: null,
      pitchDeckText: null,
    };
  }

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `From the following pitch deck text, extract structured information.

PITCH DECK TEXT (first 3000 chars):
${pdfText.slice(0, 3000)}

Return ONLY this JSON (no markdown):
{
  "companyName": "string",
  "companyUrl": "https://... or null",
  "hq": "City, Country or null",
  "foundingYear": "YYYY or null",
  "description": "one sentence what the company does or null"
}`,
        },
      ],
    });

    const extracted = extractJson(
      response.content[0].type === "text" ? response.content[0].text : ""
    ) as Omit<ExtractedInfo, "pitchDeckText">;

    return { ...extracted, pitchDeckText: pdfText };
  } catch (err) {
    console.error("[extract] Claude extraction from PDF failed:", err);
    return {
      companyName: "Unknown Company",
      companyUrl: null,
      hq: null,
      foundingYear: null,
      description: null,
      pitchDeckText: pdfText,
    };
  }
}
