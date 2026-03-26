import { exa } from "@/lib/exa";
import type { ExaResult, ExtractedInfo, ResearchBundle } from "@/types/research";

function safeResults(
  settled: PromiseSettledResult<{ results: ExaResult[] }>
): ExaResult[] {
  if (settled.status === "fulfilled") return settled.value.results ?? [];
  console.warn("[research] Query failed:", settled.reason?.message ?? settled.reason);
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toExaResults(results: any[]): ExaResult[] {
  return results.map((r) => ({
    url: r.url ?? "",
    title: r.title ?? null,
    text: r.text ?? undefined,
    highlights: r.highlights ?? undefined,
    publishedDate: r.publishedDate ?? null,
    author: r.author ?? null,
  }));
}

const oneYearAgo = () => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - 1);
  return d.toISOString().split("T")[0];
};

export async function runResearch(info: ExtractedInfo): Promise<ResearchBundle> {
  const name = info.companyName;
  const url = info.companyUrl;
  // Use description for market/competitor context when available; fall back to name
  const spaceQuery = info.description ?? name;

  const queries = await Promise.allSettled([
    // 0: Company overview via similar pages
    url
      ? exa
          .findSimilarAndContents(url, {
            numResults: 5,
            excludeSourceDomain: true,
            text: { maxCharacters: 1500 },
          })
          .then((r) => ({ results: toExaResults(r.results) }))
      : Promise.resolve({ results: [] }),

    // 1: Recent news
    exa
      .searchAndContents(`${name} company news announcement funding`, {
        numResults: 8,
        category: "news",
        startPublishedDate: oneYearAgo(),
        text: { maxCharacters: 1000 },
        highlights: { numSentences: 3, highlightsPerUrl: 2 },
      })
      .then((r) => ({ results: toExaResults(r.results) })),

    // 2: Founder profiles
    exa
      .searchAndContents(`founder CEO ${name}`, {
        numResults: 5,
        text: { maxCharacters: 1500 },
      })
      .then((r) => ({ results: toExaResults(r.results) })),

    // 3: Funding history
    exa
      .searchAndContents(
        `"${name}" funding raised million series seed`,
        {
          numResults: 6,
          category: "news",
          text: { maxCharacters: 800 },
          highlights: { numSentences: 2, highlightsPerUrl: 3 },
        }
      )
      .then((r) => ({ results: toExaResults(r.results) })),

    // 4: Competitors
    exa
      .searchAndContents(
        `competitors alternatives to ${name}`,
        {
          numResults: 8,
          text: { maxCharacters: 800 },
        }
      )
      .then((r) => ({ results: toExaResults(r.results) })),

    // 5: Market size
    exa
      .searchAndContents(
        `${spaceQuery} market size TAM total addressable market 2024 2025`,
        {
          numResults: 5,
          text: { maxCharacters: 1200 },
        }
      )
      .then((r) => ({ results: toExaResults(r.results) })),

    // 6: Twitter/X social signals
    exa
      .searchAndContents(`${name}`, {
        numResults: 8,
        includeDomains: ["twitter.com", "x.com"],
        text: { maxCharacters: 500 },
      })
      .then((r) => ({ results: toExaResults(r.results) })),

    // 7: LinkedIn company page
    exa
      .searchAndContents(`${name} site:linkedin.com/company`, {
        numResults: 3,
        includeDomains: ["linkedin.com"],
        text: { maxCharacters: 1000 },
      })
      .then((r) => ({ results: toExaResults(r.results) })),

    // 8: Job postings (headcount signal)
    exa
      .searchAndContents(`${name} jobs hiring careers`, {
        numResults: 5,
        includeDomains: [
          "linkedin.com",
          "greenhouse.io",
          "lever.co",
          "ashbyhq.com",
          "jobs.ashbyhq.com",
          "boards.greenhouse.io",
        ],
        text: { maxCharacters: 600 },
      })
      .then((r) => ({ results: toExaResults(r.results) })),

    // 9: Traction signals
    exa
      .searchAndContents(`${name} ARR revenue customers growth traction`, {
        numResults: 6,
        text: { maxCharacters: 1000 },
        highlights: { numSentences: 3, highlightsPerUrl: 2 },
      })
      .then((r) => ({ results: toExaResults(r.results) })),
  ]);

  // Collect first-pass results
  let companyOverview = safeResults(queries[0]);
  let recentNews = safeResults(queries[1]);
  let founders = safeResults(queries[2]);
  let funding = safeResults(queries[3]);
  let competitors = safeResults(queries[4]);
  let marketSize = safeResults(queries[5]);
  let socialSignals = safeResults(queries[6]);
  let linkedinCompany = safeResults(queries[7]);
  let jobPostings = safeResults(queries[8]);
  let tractionSignals = safeResults(queries[9]);

  // --- Fallback searches for empty buckets ---
  // Run all fallbacks in parallel; only fire for buckets that returned nothing.
  const fallbacks: Promise<void>[] = [];

  if (founders.length === 0) {
    fallbacks.push(
      exa
        .searchAndContents(`${name} team about founders leadership`, {
          numResults: 5,
          text: { maxCharacters: 1500 },
        })
        .then((r) => { founders = toExaResults(r.results); })
        .catch(() => {})
    );
  }

  if (funding.length === 0) {
    fallbacks.push(
      exa
        .searchAndContents(`${name} startup venture capital investment backed`, {
          numResults: 5,
          text: { maxCharacters: 800 },
        })
        .then((r) => { funding = toExaResults(r.results); })
        .catch(() => {})
    );
  }

  if (competitors.length === 0) {
    // Fall back to searching the product space rather than the company name
    fallbacks.push(
      exa
        .searchAndContents(`${spaceQuery} software tools platforms market leaders`, {
          numResults: 8,
          text: { maxCharacters: 800 },
        })
        .then((r) => { competitors = toExaResults(r.results); })
        .catch(() => {})
    );
  }

  if (marketSize.length === 0) {
    fallbacks.push(
      exa
        .searchAndContents(`${spaceQuery} industry report market forecast growth`, {
          numResults: 5,
          text: { maxCharacters: 1200 },
        })
        .then((r) => { marketSize = toExaResults(r.results); })
        .catch(() => {})
    );
  }

  if (tractionSignals.length === 0) {
    fallbacks.push(
      exa
        .searchAndContents(`${name} product launch customers case study`, {
          numResults: 5,
          text: { maxCharacters: 1000 },
        })
        .then((r) => { tractionSignals = toExaResults(r.results); })
        .catch(() => {})
    );
  }

  if (fallbacks.length > 0) {
    console.log(`[research] Running ${fallbacks.length} fallback queries for empty buckets`);
    await Promise.allSettled(fallbacks);
  }

  return {
    extractedInfo: info,
    companyOverview,
    recentNews,
    founders,
    funding,
    competitors,
    marketSize,
    socialSignals,
    linkedinCompany,
    jobPostings,
    tractionSignals,
  };
}

export function countTotalResults(bundle: ResearchBundle): number {
  return (
    bundle.companyOverview.length +
    bundle.recentNews.length +
    bundle.founders.length +
    bundle.funding.length +
    bundle.competitors.length +
    bundle.marketSize.length +
    bundle.socialSignals.length +
    bundle.linkedinCompany.length +
    bundle.jobPostings.length +
    bundle.tractionSignals.length
  );
}

export function collectSources(bundle: ResearchBundle): {
  urls: string[];
  titles: string[];
} {
  const allResults = [
    ...bundle.companyOverview,
    ...bundle.recentNews,
    ...bundle.founders,
    ...bundle.funding,
    ...bundle.competitors,
    ...bundle.marketSize,
    ...bundle.tractionSignals,
  ];

  const seen = new Set<string>();
  const urls: string[] = [];
  const titles: string[] = [];

  for (const r of allResults) {
    if (r.url && !seen.has(r.url)) {
      seen.add(r.url);
      urls.push(r.url);
      titles.push(r.title ?? r.url);
    }
  }

  return { urls: urls.slice(0, 20), titles: titles.slice(0, 20) };
}
