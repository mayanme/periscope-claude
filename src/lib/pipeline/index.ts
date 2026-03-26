import type { Prisma } from "@prisma/client";
import { inngest } from "@/lib/inngest";
import { prisma } from "@/lib/prisma";
import { extractFromUrl, extractFromPdf } from "./extract";
import { runResearch, collectSources, countTotalResults } from "./research";
import { retrieveRelevantChunks } from "./rag";
import { synthesizeBrief } from "./synthesize";

// Round-trip through JSON.parse/stringify to satisfy Prisma's strict InputJsonValue type
function toJson(data: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
}

// ── Core pipeline logic (shared by both modes) ─────────────────────────────

export async function runPipeline(dealId: string): Promise<void> {
  try {
    // Step 1: Extract
    const deal = await prisma.deal.findUniqueOrThrow({ where: { id: dealId } });
    await prisma.deal.update({ where: { id: dealId }, data: { status: "RESEARCHING" } });

    let extractedInfo;
    if (deal.pitchDeckPath) {
      extractedInfo = await extractFromPdf(deal.pitchDeckPath);
    } else if (deal.companyUrl) {
      extractedInfo = await extractFromUrl(deal.companyUrl);
    } else {
      extractedInfo = { companyName: deal.companyName || "Unknown", companyUrl: null, hq: null, foundingYear: null, description: null, pitchDeckText: null };
    }

    if (extractedInfo.companyName) {
      await prisma.deal.update({ where: { id: dealId }, data: { companyName: extractedInfo.companyName } });
    }

    // Step 2: Research
    const researchBundle = await runResearch(extractedInfo);
    await prisma.deal.update({ where: { id: dealId }, data: { researchData: toJson(researchBundle) } });

    // Step 3: Synthesize
    await prisma.deal.update({ where: { id: dealId }, data: { status: "SYNTHESIZING" } });

    const firm = await prisma.firmSettings.findUnique({ where: { id: 1 } });
    const firmContext = {
      name: firm?.name ?? "My Fund",
      thesis: firm?.thesis ?? "",
      stageFocus: firm?.stageFocus ?? [],
      sectorFocus: firm?.sectorFocus ?? [],
    };

    const ragQuery = [extractedInfo.companyName, extractedInfo.description ?? "", ...firmContext.stageFocus, ...firmContext.sectorFocus].filter(Boolean).join(" ");
    const ragChunks = await retrieveRelevantChunks(ragQuery);
    const brief = await synthesizeBrief(researchBundle, firmContext, ragChunks);

    // Step 4: Save
    const sources = collectSources(researchBundle);
    const briefJson = {
      companyOverview: toJson(brief.companyOverview),
      founderAndTeam: toJson(brief.founderAndTeam),
      marketLandscape: toJson(brief.marketLandscape),
      tractionFinancials: toJson(brief.tractionFinancials),
      fundFit: toJson(brief.fundFit),
      sources: toJson(sources),
    };

    await prisma.brief.upsert({ where: { dealId }, create: { dealId, ...briefJson }, update: briefJson });
    await prisma.deal.update({
      where: { id: dealId },
      data: {
        status: "COMPLETE",
        errorMessage: countTotalResults(researchBundle) === 0
          ? "Limited public data found — brief relies primarily on pitch deck."
          : null,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "An unexpected error occurred";
    console.error(`[pipeline] Deal ${dealId} failed:`, message);
    await prisma.deal.update({ where: { id: dealId }, data: { status: "FAILED", errorMessage: message } });
  }
}

// ── Inngest wrapper (used when QUEUE_MODE=inngest) ─────────────────────────

export const researchPipelineFunction = inngest.createFunction(
  { id: "research-pipeline", name: "Research Pipeline", retries: 1 },
  { event: "periscope/deal.created" },
  async ({ event }) => {
    await runPipeline(event.data.dealId);
    return { dealId: event.data.dealId, status: "COMPLETE" };
  }
);

// ── Unified trigger (used by API routes) ───────────────────────────────────
//
// QUEUE_MODE=local  (default) — fire-and-forget within the Node.js process.
//   ✓ Works for local dev and any persistent server (Docker, VPS, Railway).
//   ✗ Will be killed by Vercel serverless timeouts (10s free / 300s Pro).
//
// QUEUE_MODE=inngest — sends an event to Inngest for background execution.
//   ✓ Works on Vercel (any tier) — Inngest calls back into /api/inngest.
//   ✗ Requires `npx inngest-cli@latest dev` running locally.
//   ✗ Requires INNGEST_EVENT_KEY + INNGEST_SIGNING_KEY set on Vercel.

export async function triggerPipeline(dealId: string): Promise<void> {
  if (process.env.QUEUE_MODE === "inngest") {
    await inngest.send({ name: "periscope/deal.created", data: { dealId } });
  } else {
    // Fire-and-forget — no await, error is caught inside runPipeline
    runPipeline(dealId).catch(console.error);
  }
}
