import type { TractionFinancials } from "@/types/brief";
import SectionCard from "./SectionCard";

export default function TractionFinancialsSection({ data }: { data: TractionFinancials }) {
  return (
    <SectionCard number={4} title="Traction &amp; Financials">
      <div className="space-y-6">
        {/* Key numbers */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.arr && (
            <div className="p-3 bg-green-50 rounded-lg border border-green-100 text-center">
              <p className="text-xs text-green-600 mb-1">ARR</p>
              <p className="text-lg font-bold text-green-800">{data.arr}</p>
            </div>
          )}
          {data.revenueGrowth && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-100 text-center">
              <p className="text-xs text-blue-600 mb-1">Growth</p>
              <p className="text-lg font-bold text-blue-800">{data.revenueGrowth}</p>
            </div>
          )}
          {data.totalRaised && (
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-100 text-center">
              <p className="text-xs text-purple-600 mb-1">Total Raised</p>
              <p className="text-lg font-bold text-purple-800">{data.totalRaised}</p>
            </div>
          )}
          {data.headcount && (
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
              <p className="text-xs text-gray-500 mb-1">Team</p>
              <p className="text-lg font-bold text-gray-800">{data.headcount}</p>
            </div>
          )}
        </div>

        {/* Traction summary */}
        {data.tractionSummary && (
          <p className="text-sm text-gray-700 leading-relaxed">{data.tractionSummary}</p>
        )}

        {/* Key metrics */}
        {data.keyMetrics.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Key Metrics</p>
            <div className="flex flex-wrap gap-2">
              {data.keyMetrics.map((metric, i) => (
                <span key={i} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                  {metric}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Funding history */}
        {data.fundingHistory.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Funding History</p>
            <div className="space-y-2">
              {data.fundingHistory.map((round, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-2 h-2 mt-1.5 rounded-full bg-brand-400" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-gray-900">{round.round}</span>
                      {round.amount && (
                        <span className="text-sm text-gray-600">{round.amount}</span>
                      )}
                      {round.date && (
                        <span className="text-xs text-gray-400">{round.date}</span>
                      )}
                    </div>
                    {round.investors.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {round.investors.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!data.arr && !data.totalRaised && data.keyMetrics.length === 0 && data.fundingHistory.length === 0 && (
          <p className="text-sm text-gray-400 italic">
            No public traction or financial data found. If a pitch deck was uploaded, check the Company Overview section for deck-sourced metrics.
          </p>
        )}
      </div>
    </SectionCard>
  );
}
