export interface Job {
  id: string;
  title: string;
  description: string;
  postedTime: string;
  budget: string;
  proposalCount: string;
  paymentVerified: boolean;
  matchScore: number;
  url: string;
}

export interface Filters {
  includeKeywords: string;
  excludeKeywords: string;
  watchedTitles: string;
}
