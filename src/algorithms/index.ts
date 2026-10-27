import { AlgorithmId, QuickPivotStrategy, SortOrder } from '../types/algorithm';
import { AlgorithmExecutionResult } from '../types/visualization';
import { runPureAlgorithmBenchmark } from '../utils/complexity';
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
  let result: AlgorithmExecutionResult;

  switch (algorithmId) {
    case 'bubble':
      result = runBubbleSort(inputArray, order);
      break;
    case 'selection':
      result = runSelectionSort(inputArray, order);
      break;
    case 'insertion':
      result = runInsertionSort(inputArray, order);
      break;
    case 'merge':
      result = runMergeSort(inputArray, order);
      break;
    case 'quick':
      result = runQuickSort(inputArray, order, pivotStrategy);
      break;
    case 'heap':
      result = runHeapSort(inputArray, order);
      break;
    case 'shell':
      result = runShellSort(inputArray, order);
      break;
    case 'counting':
      result = runCountingSort(inputArray, order);
      break;
    default:
      result = runBubbleSort(inputArray, order);
      break;
  }

  // Измеряем чистое процессорное время алгоритма (без накладных расходов на генерацию кадров визуализации)
  const pureBench = runPureAlgorithmBenchmark(algorithmId, inputArray, order, pivotStrategy);
  result.computeTimeMs = pureBench.computeTimeMs;

  return result;
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
