export interface CommitteeInfo {
  id: string;
  code: string;
  name: string;
  category: string;
  description: string;
  portfolios: Array<{ id: string; name: string }>;
}
