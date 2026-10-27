export type AlgorithmId =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap'
  | 'shell'
  | 'counting';

export type SortOrder = 'asc' | 'desc';

export type QuickPivotStrategy = 'middle' | 'last' | 'first' | 'median3';

export type ArrayPresetType =
  | 'random'
  | 'nearly-sorted'
  | 'reversed'
  | 'duplicates'
  | 'custom';

export type AlgorithmCategory =
  | 'simple'
  | 'efficient'
  | 'in-place'
  | 'stable'
  | 'linear';

export interface CodeSnippets {
  pseudocode: string;
  javascript: string;
  typescript: string;
  lineExplanations: {
    lines: string;
    explanation: string;
  }[];
}

export interface AlgorithmInfo {
  id: AlgorithmId;
  nameEn: string;
  nameRu: string;
  fullName: string;
  shortDescription: string;
  detailedPrinciple: string;
  stepByStepSummary: string[];
  bestComplexity: string;
  bestComplexityNote?: string;
  averageComplexity: string;
  averageComplexityNote?: string;
  worstComplexity: string;
  worstComplexityNote?: string;
  spaceComplexity: string;
  spaceComplexityNote?: string;
  stable: boolean;
  stableNote: string;
  inPlace: boolean;
  inPlaceNote: string;
  difficulty: 'Начальный' | 'Средний' | 'Продвинутый';
  categories: AlgorithmCategory[];
  advantages: string[];
  disadvantages: string[];
  useCases: string[];
  pivotOrGapStrategy?: string;
  code: CodeSnippets;
}

