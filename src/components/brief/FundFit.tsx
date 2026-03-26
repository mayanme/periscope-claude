import type { FundFit } from "@/types/brief";
import SectionCard from "./SectionCard";

const questionCategoryColors: Record<string, string> = {
  Traction: "bg-green-100 text-green-700",
  Market: "bg-blue-100 text-blue-700",
  Team: "bg-purple-100 text-purple-700",
  Product: "bg-orange-100 text-orange-700",
  Financials: "bg-emerald-100 text-emerald-700",
  Strategy: "bg-indigo-100 text-indigo-700",
};

function FitScoreMeter({ score }: { score: number }) {
  const color =
    score >= 8 ? "text-green-600" :
    score >= 5 ? "text-amber-600" :
    "text-red-600";

  const bgColor =
    score >= 8 ? "bg-green-500" :
    score >= 5 ? "bg-amber-500" :
    "bg-red-500";

  return (
    <div className="flex items-center gap-4">
      <div className={`fit-score-chip text-4xl font-bold ${color}`}>
        {score}<span className="text-lg text-gray-400">/10</span>
      </div>
      <div className="flex-1">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${bgColor}`}
            style={{ width: `${score * 10}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {score >= 8 ? "Strong fit" : score >= 5 ? "Moderate fit" : "Weak fit"} with fund thesis
        </p>
      </div>
    </div>
  );
}

export default function FundFitSection({ data }: { data: FundFit }) {
  const groupedQuestions: Record<string, string[]> = {};
  for (const q of data.suggestedQuestions) {
    if (!groupedQuestions[q.category]) groupedQuestions[q.category] = [];
    groupedQuestions[q.category].push(q.question);
  }

  return (
    <SectionCard number={5} title="Fund Fit &amp; Meeting Questions">
      <div className="space-y-6">
        {/* Fit score */}
        {data.fitScore !== null && (
          <FitScoreMeter score={data.fitScore} />
        )}

        {/* Rationale */}
        {data.fitRationale && (
          <p className="text-sm text-gray-700 leading-relaxed">{data.fitRationale}</p>
        )}

        {/* Thesis mapping */}
        {data.thesisMapped.length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Thesis Alignment</p>
            <div className="space-y-2">
              {data.thesisMapped.map((point, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 ${point.fits ? "bg-green-100" : "bg-red-100"}`}>
                    {point.fits ? (
                      <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{point.thesisPoint}</p>
                    {point.evidence && (
                      <p className="text-xs text-gray-500 mt-0.5">{point.evidence}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Red flags */}
        {data.redFlags.length > 0 && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-100">
            <p className="text-xs font-medium text-red-700 uppercase tracking-wide mb-2">Red Flags to Watch</p>
            <ul className="space-y-1">
              {data.redFlags.map((flag, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-red-700">
                  <span className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-red-400" />
                  {flag}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggested questions */}
        {Object.keys(groupedQuestions).length > 0 && (
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Suggested Meeting Questions</p>
            <div className="space-y-4">
              {Object.entries(groupedQuestions).map(([category, questions]) => (
                <div key={category}>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold mb-2 ${questionCategoryColors[category] ?? "bg-gray-100 text-gray-700"}`}>
                    {category}
                  </span>
                  <ul className="space-y-2">
                    {questions.map((q, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="mt-2 flex-shrink-0 w-1 h-1 rounded-full bg-gray-400" />
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
