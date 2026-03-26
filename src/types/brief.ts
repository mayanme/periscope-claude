export interface CompanyOverview {
  whatTheyDo: string | null;
  stage: string | null;
  hq: string | null;
  foundingDate: string | null;
  website: string | null;
  oneLiner: string | null;
}

export interface Founder {
  name: string;
  role: string;
  background: string | null;
  notableCredentials: string[];
  linkedinUrl: string | null;
}

export interface FounderAndTeam {
  founders: Founder[];
  estimatedTeamSize: string | null;
  teamStrengths: string | null;
  teamGaps: string | null;
}

export interface Competitor {
  name: string;
  url: string | null;
  differentiator: string | null;
}

export interface MarketLandscape {
  tam: string | null;
  tamSource: string | null;
  marketTiming: string | null;
  keyTrends: string[];
  competitors: Competitor[];
  competitiveAdvantage: string | null;
}

export interface FundingRound {
  round: string;
  amount: string | null;
  date: string | null;
  investors: string[];
}

export interface TractionFinancials {
  arr: string | null;
  revenueGrowth: string | null;
  fundingHistory: FundingRound[];
  totalRaised: string | null;
  headcount: string | null;
  keyMetrics: string[];
  tractionSummary: string | null;
}

export interface ThesisPoint {
  thesisPoint: string;
  evidence: string | null;
  fits: boolean;
}

export interface SuggestedQuestion {
  category: "Traction" | "Market" | "Team" | "Product" | "Financials" | "Strategy";
  question: string;
}

export interface FundFit {
  fitScore: number | null;
  fitRationale: string | null;
  thesisMapped: ThesisPoint[];
  redFlags: string[];
  suggestedQuestions: SuggestedQuestion[];
}

export interface Sources {
  urls: string[];
  titles: string[];
}

export interface BriefData {
  id: string;
  dealId: string;
  companyOverview: CompanyOverview;
  founderAndTeam: FounderAndTeam;
  marketLandscape: MarketLandscape;
  tractionFinancials: TractionFinancials;
  fundFit: FundFit;
  sources: Sources;
  createdAt: string;
}
