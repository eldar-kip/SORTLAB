import { SortOrder } from '../types/algorithm';
import { AlgorithmExecutionResult } from '../types/visualization';
import { StepRecorder } from './stepBuilder';

export function runMergeSort(input: number[], order: SortOrder = 'asc'): AlgorithmExecutionResult {
  const startTime = performance.now();
  const arr = [...input];
  const n = arr.length;
  const recorder = new StepRecorder();

  recorder.addStep({
    type: 'init',
    array: arr,
    phase: 'Инициализация',
    title: 'Начало сортировки слиянием (Merge Sort)',
    description: 'Разделяем массив рекурсивно пополам до подмассивов длины 1, после чего сливаем упорядоченные части в единый массив.',
  });

  function merge(left: number, mid: number, right: number, depth: number) {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    const isFinalMerge = left === 0 && right === n - 1;

    recorder.addStep({
      type: 'merge-start',
      array: arr,
      mergeRange: [left, mid, right],
      recursionDepth: depth,
      phase: `Слияние [${left}..${mid}] и [${mid + 1}..${right}] (глубина ${depth})`,
      title: `Начало слияния подмассивов [${left}..${mid}] и [${mid + 1}..${right}]`,
      description: `Объединяем два отсортированных подмассива: левый [${left}..${mid}] (${leftArr.join(', ')}) и правый [${mid + 1}..${right}] (${rightArr.join(', ')}).`,
    });

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      recorder.incrementComparisons();
      const valL = leftArr[i];
      const valR = rightArr[j];
      // Для сохранения устойчивости при равенстве берём элемент из левого подмассива
      const takeLeft = order === 'asc' ? valL <= valR : valL >= valR;

      recorder.addStep({
        type: 'compare',
        array: arr,
        comparingIndices: [left + i, mid + 1 + j],
        mergeRange: [left, mid, right],
        currentIndex: k,
        recursionDepth: depth,
        phase: `Слияние [${left}..${right}]`,
        title: `Сравнение ${valL} (левый) и ${valR} (правый)`,
        description: `Сравниваем элементы двух подмассивов: ${valL} и ${valR} для записи на позицию [${k}].`,
        reason: takeLeft
          ? `Выбираем ${valL} из левого подмассива (сохраняя устойчивость сортировки).`
          : `Выбираем ${valR} из правого подмассива.`,
      });

      if (takeLeft) {
        arr[k] = valL;
        i++;
      } else {
        arr[k] = valR;
        j++;
      }
      recorder.incrementMoves();

      const sortedSoFar = isFinalMerge ? Array.from({ length: k + 1 }, (_, idx) => idx) : [];
      recorder.addStep({
        type: 'merge-write',
        array: arr,
        swappingIndices: [k],
        mergeRange: [left, mid, right],
        currentIndex: k,
        sortedIndices: sortedSoFar,
        recursionDepth: depth,
        phase: `Запись при слиянии [${left}..${right}]`,
        title: `Запись значения ${arr[k]} на позицию [${k}]`,
        description: `Записываем выбранный элемент ${arr[k]} в результирующую область массива на индекс ${k}.`,
      });
      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      recorder.incrementMoves();
      const sortedSoFar = isFinalMerge ? Array.from({ length: k + 1 }, (_, idx) => idx) : [];
      recorder.addStep({
        type: 'merge-write',
        array: arr,
        swappingIndices: [k],
        mergeRange: [left, mid, right],
        currentIndex: k,
        sortedIndices: sortedSoFar,
        recursionDepth: depth,
        phase: `Дозапись левого подмассива [${left}..${right}]`,
        title: `Перенос оставшегося элемента ${arr[k]} на [${k}]`,
        description: `Правый подмассив исчерпан. Переносим оставшийся элемент ${arr[k]} из левого подмассива на позицию ${k}.`,
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      recorder.incrementMoves();
      const sortedSoFar = isFinalMerge ? Array.from({ length: k + 1 }, (_, idx) => idx) : [];
      recorder.addStep({
        type: 'merge-write',
        array: arr,
        swappingIndices: [k],
        mergeRange: [left, mid, right],
        currentIndex: k,
        sortedIndices: sortedSoFar,
        recursionDepth: depth,
        phase: `Дозапись правого подмассива [${left}..${right}]`,
        title: `Перенос оставшегося элемента ${arr[k]} на [${k}]`,
        description: `Левый подмассив исчерпан. Переносим оставшийся элемент ${arr[k]} из правого подмассива на позицию ${k}.`,
      });
      j++;
      k++;
    }
  }

  function mergeSortRecursive(left: number, right: number, depth: number) {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSortRecursive(left, mid, depth + 1);
    mergeSortRecursive(mid + 1, right, depth + 1);
    merge(left, mid, right, depth);
  }

  if (n > 1) {
    mergeSortRecursive(0, n - 1, 1);
  }

  recorder.addStep({
    type: 'complete',
    array: arr,
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    phase: 'Завершение',
    title: 'Сортировка завершена',
    description: 'Сортировка завершена. Все элементы расположены в правильном порядке.',
  });

  const computeTimeMs = Math.max(0.01, performance.now() - startTime);
  const stats = recorder.getStats();
  return {
    algorithmId: 'merge',
    steps: recorder.getSteps(),
    sortedArray: arr,
    computeTimeMs,
    totalComparisons: stats.comparisons,
    totalSwaps: stats.swaps,
    totalMoves: stats.moves,
  };
}

