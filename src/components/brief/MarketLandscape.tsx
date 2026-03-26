import type { MarketLandscape } from "@/types/brief";
import SectionCard from "./SectionCard";

export default function MarketLandscapeSection({ data }: { data: MarketLandscape }) {
  return (
    <SectionCard number={3} title="Market &amp; Competitive Landscape">
      <div className="space-y-6">
        {/* Market size + timing */}
        <div className="grid sm:grid-cols-2 gap-4">
          {data.tam && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Total Addressable Market</p>
              <p className="text-xl font-bold text-gray-900">{data.tam}</p>
              {data.tamSource && (
                <p className="text-xs text-gray-400 mt-0.5">Source: {data.tamSource}</p>
              )}
            </div>
          )}
          {data.marketTiming && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-xs font-medium text-blue-700 mb-1">Why now?</p>
              <p className="text-sm text-blue-800 leading-relaxed">{data.marketTiming}</p>
            </div>
          )}
        </div>

        {/* Key trends */}
        {data.keyTrends.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Key Trends</p>
            <ul className="space-y-1">
              {data.keyTrends.map((trend, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-400" />
                  {trend}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Competitive advantage */}
        {data.competitiveAdvantage && (
          <div className="p-3 bg-brand-50 rounded-lg border border-brand-100">
            <p className="text-xs font-medium text-brand-700 mb-1">Competitive Advantage</p>
            <p className="text-sm text-brand-800">{data.competitiveAdvantage}</p>
          </div>
        )}

        {/* Competitors table */}
        {data.competitors.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Competitive Landscape</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left text-xs font-medium text-gray-500 pb-2 w-1/3">Competitor</th>
                    <th className="text-left text-xs font-medium text-gray-500 pb-2">Differentiator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.competitors.map((comp, i) => (
                    <tr key={i}>
                      <td className="py-2 pr-4 font-medium text-gray-900">
                        {comp.url ? (
                          <a href={comp.url} target="_blank" rel="noopener noreferrer" className="hover:text-brand-600 no-href-print">
                            {comp.name}
                          </a>
                        ) : comp.name}
                      </td>
                      <td className="py-2 text-gray-600">{comp.differentiator ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
