export interface ExaResult {
  url: string;
  title: string | null;
  text?: string;
  highlights?: string[];
  publishedDate?: string | null;
  author?: string | null;
}

export interface ExtractedInfo {
  companyName: string;
  companyUrl: string | null;
  hq: string | null;
  foundingYear: string | null;
  description: string | null;
  pitchDeckText: string | null;
}

export interface ResearchBundle {
  extractedInfo: ExtractedInfo;
  companyOverview: ExaResult[];
  recentNews: ExaResult[];
  founders: ExaResult[];
  funding: ExaResult[];
  competitors: ExaResult[];
  marketSize: ExaResult[];
  socialSignals: ExaResult[];
  linkedinCompany: ExaResult[];
  jobPostings: ExaResult[];
  tractionSignals: ExaResult[];
}
