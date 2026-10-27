import { SortingStep, StepEventType, FrequencyBucket } from '../types/visualization';
import { SortOrder } from '../types/algorithm';

export class StepRecorder {
  private steps: SortingStep[] = [];
  private comparisons = 0;
  private swaps = 0;
  private moves = 0;

  public incrementComparisons(count = 1): void {
    this.comparisons += count;
  }

  public incrementSwaps(count = 1): void {
    this.swaps += count;
  }

  public incrementMoves(count = 1): void {
    this.moves += count;
  }

  public getStats() {
    return {
      comparisons: this.comparisons,
      swaps: this.swaps,
      moves: this.moves,
    };
  }

  public addStep(params: {
    type: StepEventType;
    array: number[];
    comparingIndices?: number[];
    swappingIndices?: number[];
    pivotIndex?: number | null;
    minMaxIndex?: number | null;
    currentIndex?: number | null;
    mergeRange?: [number, number, number] | null;
    partitionRange?: [number, number] | null;
    sortedIndices?: number[];
    shellGap?: number | null;
    shellGroupIndices?: number[];
    heapSize?: number | null;
    countArray?: FrequencyBucket[] | null;
    recursionDepth?: number;
    phase: string;
    title: string;
    description: string;
    reason?: string;
  }): void {
    this.steps.push({
      stepNumber: this.steps.length,
      type: params.type,
      array: [...params.array],
      comparingIndices: params.comparingIndices ? [...params.comparingIndices] : [],
      swappingIndices: params.swappingIndices ? [...params.swappingIndices] : [],
      pivotIndex: params.pivotIndex ?? null,
      minMaxIndex: params.minMaxIndex ?? null,
      currentIndex: params.currentIndex ?? null,
      mergeRange: params.mergeRange ? [...params.mergeRange] : null,
      partitionRange: params.partitionRange ? [...params.partitionRange] : null,
      sortedIndices: params.sortedIndices ? [...params.sortedIndices] : [],
      shellGap: params.shellGap ?? null,
      shellGroupIndices: params.shellGroupIndices ? [...params.shellGroupIndices] : [],
      heapSize: params.heapSize ?? null,
      countArray: params.countArray ? params.countArray.map((b) => ({ ...b })) : null,
      recursionDepth: params.recursionDepth ?? 0,
      stats: {
        comparisons: this.comparisons,
        swaps: this.swaps,
        moves: this.moves,
      },
      phase: params.phase,
      title: params.title,
      description: params.description,
      reason: params.reason,
    });
  }

  public getSteps(): SortingStep[] {
    return this.steps;
  }
}

export function shouldSwap(a: number, b: number, order: SortOrder): boolean {
  return order === 'asc' ? a > b : a < b;
}

export function isStrictlyBetter(candidate: number, current: number, order: SortOrder): boolean {
  return order === 'asc' ? candidate < current : candidate > current;
}

