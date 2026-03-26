import type { CompanyOverview } from "@/types/brief";

interface BriefHeaderProps {
  companyName: string;
  companyUrl: string | null;
  overview: CompanyOverview;
  generatedAt: string;
}

const stageColors: Record<string, string> = {
  "Pre-seed": "bg-gray-100 text-gray-700",
  "Seed": "bg-green-100 text-green-700",
  "Series A": "bg-blue-100 text-blue-700",
  "Series B": "bg-indigo-100 text-indigo-700",
  "Growth": "bg-purple-100 text-purple-700",
  "Unknown": "bg-gray-100 text-gray-500",
};

export default function BriefHeader({
  companyName,
  companyUrl,
  overview,
  generatedAt,
}: BriefHeaderProps) {
  const stageClass = stageColors[overview.stage ?? "Unknown"] ?? stageColors["Unknown"];

  return (
    <div className="brief-header bg-white rounded-xl border border-gray-200 p-8 mb-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {companyUrl && (
            <img
              src={`https://www.google.com/s2/favicons?domain=${companyUrl}&sz=64`}
              alt={companyName}
              className="w-14 h-14 rounded-xl border border-gray-100 no-href-print"
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 capitalize">{companyName}</h1>
            {overview.oneLiner && (
              <p className="mt-1 text-base text-gray-500 max-w-2xl">{overview.oneLiner}</p>
            )}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              {overview.stage && overview.stage !== "Unknown" && (
                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full ${stageClass}`}>
                  {overview.stage}
                </span>
              )}
              {overview.hq && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {overview.hq}
                </span>
              )}
              {overview.foundingDate && (
                <span className="text-xs text-gray-500">Est. {overview.foundingDate}</span>
              )}
              {overview.website && (
                <a
                  href={overview.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:underline no-href-print"
                >
                  {overview.website.replace(/^https?:\/\//, "")}
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="text-right text-xs text-gray-400 flex-shrink-0">
          <p className="font-medium">Intelligence Brief</p>
          <p>{new Date(generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
        </div>
      </div>

      {overview.whatTheyDo && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">{overview.whatTheyDo}</p>
        </div>
      )}
    </div>
  );
}
