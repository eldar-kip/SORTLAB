import { AlgorithmId, QuickPivotStrategy, SortOrder } from '../types/algorithm';
import { AlgorithmExecutionResult } from '../types/visualization';
import { runBubbleSort } from './bubbleSort';
import { runSelectionSort } from './selectionSort';
import { runInsertionSort } from './insertionSort';
import { runMergeSort } from './mergeSort';
import { runQuickSort } from './quickSort';
import { runHeapSort } from './heapSort';
import { runShellSort } from './shellSort';
import { runCountingSort } from './countingSort';

export function executeSortingAlgorithm(
  algorithmId: AlgorithmId,
  inputArray: number[],
  order: SortOrder = 'asc',
  pivotStrategy: QuickPivotStrategy = 'middle'
): AlgorithmExecutionResult {
  switch (algorithmId) {
    case 'bubble':
      return runBubbleSort(inputArray, order);
    case 'selection':
      return runSelectionSort(inputArray, order);
    case 'insertion':
      return runInsertionSort(inputArray, order);
    case 'merge':
      return runMergeSort(inputArray, order);
    case 'quick':
      return runQuickSort(inputArray, order, pivotStrategy);
    case 'heap':
      return runHeapSort(inputArray, order);
    case 'shell':
      return runShellSort(inputArray, order);
    case 'counting':
      return runCountingSort(inputArray, order);
    default:
      return runBubbleSort(inputArray, order);
  }
}

export {
  runBubbleSort,
  runSelectionSort,
  runInsertionSort,
  runMergeSort,
  runQuickSort,
  runHeapSort,
  runShellSort,
  runCountingSort,
};
