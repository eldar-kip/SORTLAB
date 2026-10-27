import { AlgorithmId, SortOrder } from './algorithm';

export type StepEventType =
  | 'init'
  | 'compare'
  | 'swap'
  | 'move'
  | 'pivot'
  | 'minimum'
  | 'merge-start'
  | 'merge-write'
  | 'heap-build'
  | 'heapify'
  | 'shell-gap'
  | 'count-update'
  | 'count-write'
  | 'mark-sorted'
  | 'complete';

export interface FrequencyBucket {
  value: number;
  count: number;
  active?: boolean;
}

export interface StepStatistics {
  comparisons: number;
  swaps: number;
  moves: number;
}

export interface SortingStep {
  stepNumber: number;
  type: StepEventType;
  array: number[];
  comparingIndices: number[];
  swappingIndices: number[];
  pivotIndex: number | null;
  minMaxIndex: number | null;
  currentIndex: number | null;
  mergeRange: [number, number, number] | null; // [left, mid, right]
  partitionRange: [number, number] | null; // [low, high]
  sortedIndices: number[];
  shellGap: number | null;
  shellGroupIndices: number[];
  heapSize: number | null;
  countArray: FrequencyBucket[] | null;
  recursionDepth: number;
  stats: StepStatistics;
  phase: string;
  title: string;
  description: string;
  reason?: string;
}

export interface AlgorithmExecutionResult {
  algorithmId: AlgorithmId;
  steps: SortingStep[];
  sortedArray: number[];
  computeTimeMs: number;
  totalComparisons: number;
  totalSwaps: number;
  totalMoves: number;
  warning?: string;
}

export type PlaybackStatus = 'idle' | 'running' | 'paused' | 'completed';

export interface ExperimentRecord {
  id: string;
  timestamp: string;
  algorithmId: AlgorithmId;
  algorithmName: string;
  arraySize: number;
  order: SortOrder;
  presetName: string;
  comparisons: number;
  swaps: number;
  moves: number;
  totalSteps: number;
  computeTimeMs: number;
  initialArray: number[];
}

