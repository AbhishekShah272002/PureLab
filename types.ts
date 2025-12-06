export interface TechnicalTerm {
  term: string;
  simpleExplanation: string;
  category: 'Safe' | 'Caution' | 'Avoid';
}

export interface AnalysisResult {
  productName: string;
  isVegan: boolean;
  veganReasoning: string;
  detectedAllergens: string[];
  technicalTerms: TechnicalTerm[];
  summary: string;
}

export enum AnalysisMode {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE'
}
