import { anthropic, CLAUDE_MODEL, extractJson } from "@/lib/claude";
import type { ResearchBundle } from "@/types/research";
import type {
  CompanyOverview,
  FounderAndTeam,
  MarketLandscape,
  TractionFinancials,
  FundFit,
} from "@/types/brief";

interface FirmContext {
  name: string;
  thesis: string;
  stageFocus: string[];
  sectorFocus: string[];
}

function resultsToText(
  results: { text?: string; title?: string | null; highlights?: string[] }[],
  maxChars = 3000
): string {
  if (results.length === 0) return "(no data available)";
  let out = "";
  for (const r of results) {
    const content = r.highlights?.join(" ") ?? r.text ?? "";
    const title = r.title ?? "";
    out += `[${title}]\n${content}\n\n`;
    if (out.length >= maxChars) break;
  }
  return out.slice(0, maxChars) || "(no data available)";
}

function systemPrompt(firm: FirmContext): string {
  return `You are a senior VC analyst at ${firm.name}. Your fund's investment thesis: "${firm.thesis}". Stage focus: ${firm.stageFocus.join(", ") || "all stages"}. Sectors: ${firm.sectorFocus.join(", ") || "all sectors"}.

SOURCE VALIDATION RULE: The pitch deck is the authoritative ground truth. Web research results may be about a different company that happens to share the same name. Before using any web result, verify it is about the same company as described in the pitch deck (same product, same founders, same business model). If web results describe a different product, different founders, or a different business than the pitch deck, discard those web results entirely and rely on the pitch deck instead.

Return ONLY valid JSON matching the requested schema. Do not include markdown code fences. Use null for unavailable fields.`;
}

export async function synthesizeBrief(
  bundle: ResearchBundle,
  firm: FirmContext,
  ragChunks: string[]
): Promise<{
  companyOverview: CompanyOverview;
  founderAndTeam: FounderAndTeam;
  marketLandscape: MarketLandscape;
  tractionFinancials: TractionFinancials;
  fundFit: FundFit;
}> {
  const info = bundle.extractedInfo;
  const deckText = info.pitchDeckText ?? "";
  const sys = systemPrompt(firm);

  const [overviewRes, teamRes, marketRes, tractionRes, fitRes] =
    await Promise.allSettled([
      // Section 1: Company Overview
      anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1200,
        system: sys,
        messages: [
          {
            role: "user",
            content: `Synthesize a company overview section for the intelligence brief.

PITCH DECK TEXT (authoritative — use as primary source):
${deckText.slice(0, 2000) || "(none)"}

COMPANY HOMEPAGE & SIMILAR PAGES (supplement only — discard if about a different company):
${resultsToText(bundle.companyOverview)}

RECENT NEWS (supplement only — discard if about a different company):
${resultsToText(bundle.recentNews, 1500)}

Return JSON:
{
  "whatTheyDo": "one clear sentence describing the product/service",
  "stage": "Pre-seed | Seed | Series A | Series B | Growth | Unknown",
  "hq": "City, Country or null",
  "foundingDate": "YYYY or null",
  "website": "https://... or null",
  "oneLiner": "elevator pitch in 15 words or fewer"
}`,
          },
        ],
      }),

      // Section 2: Founder & Team
      anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 1200,
        system: sys,
        messages: [
          {
            role: "user",
            content: `Synthesize a founder and team section for the intelligence brief.

PITCH DECK TEXT (authoritative — use founder names and roles from here first):
${deckText.slice(0, 1500) || "(none)"}

FOUNDER/TEAM RESEARCH (supplement only — if names differ from pitch deck, the pitch deck wins):
${resultsToText(bundle.founders)}

LINKEDIN COMPANY PAGE (supplement only):
${resultsToText(bundle.linkedinCompany, 1000)}

JOB POSTINGS (headcount signal):
${resultsToText(bundle.jobPostings, 800)}

Return JSON:
{
  "founders": [
    {
      "name": "string",
      "role": "string",
      "background": "2-3 sentence career summary",
      "notableCredentials": ["string"],
      "linkedinUrl": "url or null"
    }
  ],
  "estimatedTeamSize": "1-10 | 11-50 | 51-200 | 200+ | Unknown",
  "teamStrengths": "string or null",
  "teamGaps": "string or null"
}`,
          },
        ],
      }),

      // Section 3: Market & Competitive Landscape
      anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        system: sys,
        messages: [
          {
            role: "user",
            content: `Synthesize a market and competitive landscape section.

MARKET SIZE RESEARCH:
${resultsToText(bundle.marketSize)}

COMPETITOR RESEARCH:
${resultsToText(bundle.competitors)}

RECENT NEWS (market signals):
${resultsToText(bundle.recentNews, 1000)}

PITCH DECK TEXT:
${deckText.slice(0, 1000) || "(none)"}

Return JSON:
{
  "tam": "dollar figure with source, e.g. '$12B (Gartner 2024)' or null",
  "tamSource": "source name or null",
  "marketTiming": "2-3 sentences on why now",
  "keyTrends": ["trend string"],
  "competitors": [
    { "name": "string", "url": "string or null", "differentiator": "1 sentence" }
  ],
  "competitiveAdvantage": "string or null"
}`,
          },
        ],
      }),

      // Section 4: Traction & Financials
      anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2000,
        system: sys,
        messages: [
          {
            role: "user",
            content: `Synthesize a traction and financials section.

TRACTION SIGNALS:
${resultsToText(bundle.tractionSignals)}

FUNDING HISTORY:
${resultsToText(bundle.funding)}

SOCIAL SIGNALS:
${resultsToText(bundle.socialSignals, 800)}

PITCH DECK TEXT (primary source):
${deckText.slice(0, 3000) || "(none)"}

Return JSON:
{
  "arr": "dollar figure or null",
  "revenueGrowth": "e.g. '3x YoY' or null",
  "fundingHistory": [
    { "round": "string", "amount": "string or null", "date": "YYYY-MM or null", "investors": ["string"] }
  ],
  "totalRaised": "dollar figure or null",
  "headcount": "string or null",
  "keyMetrics": ["metric string"],
  "tractionSummary": "2-3 sentence summary"
}`,
          },
        ],
      }),

      // Section 5: Fund Fit & Meeting Questions
      anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 2500,
        system: sys,
        messages: [
          {
            role: "user",
            content: `Rate this deal's fit with your fund and generate meeting questions.

FUND THESIS: ${firm.thesis || "(not configured)"}
STAGE FOCUS: ${firm.stageFocus.join(", ") || "all stages"}
SECTOR FOCUS: ${firm.sectorFocus.join(", ") || "all sectors"}

INTERNAL CONTEXT FROM FUND DOCUMENTS:
${ragChunks.length > 0 ? ragChunks.join("\n\n---\n\n") : "(no internal documents uploaded)"}

COMPANY: ${info.companyName}
DESCRIPTION: ${info.description ?? "(see pitch deck)"}
PITCH DECK EXCERPT:
${deckText.slice(0, 2000) || "(none)"}

Return JSON:
{
  "fitScore": 7,
  "fitRationale": "3-4 sentences explaining the score",
  "thesisMapped": [
    { "thesisPoint": "string", "evidence": "string or null", "fits": true }
  ],
  "redFlags": ["string"],
  "suggestedQuestions": [
    { "category": "Traction", "question": "string" }
  ]
}

Categories for suggestedQuestions must be one of: Traction, Market, Team, Product, Financials, Strategy.
Generate 8-12 questions total across categories.`,
          },
        ],
      }),
    ]);

  function parseSection<T>(result: PromiseSettledResult<{ content: { type: string; text?: string }[] }>, fallback: T): T {
    if (result.status === "rejected") {
      console.error("[synthesize] Claude call failed:", result.reason);
      return fallback;
    }
    try {
      const text = result.value.content[0].type === "text" ? result.value.content[0].text ?? "" : "";
      return extractJson(text) as T;
    } catch (err) {
      console.error("[synthesize] JSON parse failed:", err);
      return fallback;
    }
  }

  const overviewFallback: CompanyOverview = {
    whatTheyDo: null, stage: null, hq: null, foundingDate: null, website: null, oneLiner: null,
  };
  const teamFallback: FounderAndTeam = {
    founders: [], estimatedTeamSize: null, teamStrengths: null, teamGaps: null,
  };
  const marketFallback: MarketLandscape = {
    tam: null, tamSource: null, marketTiming: null, keyTrends: [], competitors: [], competitiveAdvantage: null,
  };
  const tractionFallback: TractionFinancials = {
    arr: null, revenueGrowth: null, fundingHistory: [], totalRaised: null, headcount: null, keyMetrics: [], tractionSummary: null,
  };
  const fitFallback: FundFit = {
    fitScore: null, fitRationale: null, thesisMapped: [], redFlags: [], suggestedQuestions: [],
  };

  return {
    companyOverview: parseSection(overviewRes, overviewFallback),
    founderAndTeam: parseSection(teamRes, teamFallback),
    marketLandscape: parseSection(marketRes, marketFallback),
    tractionFinancials: parseSection(tractionRes, tractionFallback),
    fundFit: parseSection(fitRes, fitFallback),
  };
}
