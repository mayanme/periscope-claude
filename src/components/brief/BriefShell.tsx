"use client";

import type { BriefData } from "@/types/brief";
import BriefHeader from "./BriefHeader";
import FounderTeamSection from "./FounderTeam";
import MarketLandscapeSection from "./MarketLandscape";
import TractionFinancialsSection from "./TractionFinancials";
import FundFitSection from "./FundFit";
import SourcesList from "./SourcesList";

interface BriefShellProps {
  brief: BriefData;
  companyName: string;
  companyUrl: string | null;
}

export default function BriefShell({ brief, companyName, companyUrl }: BriefShellProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Print button */}
      <div className="no-print flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-gray-700">Intelligence Brief</h1>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print / Save PDF
        </button>
      </div>

      {/* Brief content */}
      <BriefHeader
        companyName={companyName}
        companyUrl={companyUrl}
        overview={brief.companyOverview}
        generatedAt={brief.createdAt}
      />

      <div className="space-y-4">
        <FounderTeamSection data={brief.founderAndTeam} />
        <MarketLandscapeSection data={brief.marketLandscape} />
        <TractionFinancialsSection data={brief.tractionFinancials} />
        <FundFitSection data={brief.fundFit} />
        <SourcesList sources={brief.sources} />
      </div>
    </div>
  );
}
