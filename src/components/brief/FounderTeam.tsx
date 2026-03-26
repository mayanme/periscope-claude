import type { FounderAndTeam } from "@/types/brief";
import SectionCard from "./SectionCard";

export default function FounderTeamSection({ data }: { data: FounderAndTeam }) {
  return (
    <SectionCard number={2} title="Founder &amp; Team">
      <div className="space-y-6">
        {/* Founders */}
        {data.founders.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.founders.map((founder, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-semibold text-gray-900">{founder.name}</p>
                    <p className="text-xs text-brand-600 font-medium">{founder.role}</p>
                  </div>
                  {founder.linkedinUrl && (
                    <a
                      href={founder.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:text-blue-700 flex-shrink-0 no-href-print"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                  )}
                </div>
                {founder.background && (
                  <p className="text-sm text-gray-600 leading-relaxed">{founder.background}</p>
                )}
                {founder.notableCredentials.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {founder.notableCredentials.map((cred, j) => (
                      <span key={j} className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs text-gray-600">
                        {cred}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No founder information available from public sources.</p>
        )}

        {/* Team metadata */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          {data.estimatedTeamSize && (
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Team size</p>
              <p className="text-sm font-medium text-gray-900">{data.estimatedTeamSize}</p>
            </div>
          )}
        </div>

        {data.teamStrengths && (
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-xs font-medium text-green-700 mb-1">Strengths</p>
            <p className="text-sm text-green-800">{data.teamStrengths}</p>
          </div>
        )}
        {data.teamGaps && (
          <div className="p-3 bg-amber-50 rounded-lg">
            <p className="text-xs font-medium text-amber-700 mb-1">Gaps to probe</p>
            <p className="text-sm text-amber-800">{data.teamGaps}</p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
