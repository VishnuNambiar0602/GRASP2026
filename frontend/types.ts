
export interface Assessment {
  id: string;
  date: string;
  symptoms: string;
  summary: string;
  riskLevel: 'Low' | 'Moderate' | 'High';
  recommendations: string[];
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  ASSESSMENT_FORM = 'ASSESSMENT_FORM',
  ANALYZING = 'ANALYZING',
  RESULT = 'RESULT',
  SUCCESS = 'SUCCESS',
  HISTORY = 'HISTORY'
}
