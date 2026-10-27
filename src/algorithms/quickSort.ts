import { QuickPivotStrategy, SortOrder } from '../types/algorithm';
import { AlgorithmExecutionResult } from '../types/visualization';
import { StepRecorder } from './stepBuilder';

const STRATEGY_LABELS: Record<QuickPivotStrategy, string> = {
  middle: 'Средний по индексу элемент ⌊(low + high) / 2⌋',
  median3: 'Медиана из трёх элементов (первого, среднего и последнего)',
  last: 'Последний элемент участка (arr[high])',
  first: 'Первый элемент участка (arr[low])',
};

export function runQuickSort(
  input: number[],
  order: SortOrder = 'asc',
  pivotStrategy: QuickPivotStrategy = 'middle'
): AlgorithmExecutionResult {
  const startTime = performance.now();
  const arr = [...input];
  const n = arr.length;
  const recorder = new StepRecorder();
  const sortedIndices: number[] = [];

  recorder.addStep({
    type: 'init',
    array: arr,
    sortedIndices,
    phase: 'Инициализация',
    title: 'Начало быстрой сортировки (Quick Sort)',
    description: `Выбрана стратегия опорного элемента (pivot): «${STRATEGY_LABELS[pivotStrategy]}».`,
  });

  function selectPivotIndex(low: number, high: number, depth: number): number {
    if (pivotStrategy === 'first') {
      return low;
    }
    if (pivotStrategy === 'last') {
      return high;
    }
    const mid = Math.floor((low + high) / 2);
    if (pivotStrategy === 'middle' || high - low < 2) {
      return mid;
    }

    // Стратегия 'median3': выбираем медиану из arr[low], arr[mid], arr[high]
    const a = arr[low];
    const b = arr[mid];
    const c = arr[high];
    recorder.incrementComparisons(3);

    let medianIdx = mid;
    if ((a <= b && b <= c) || (c <= b && b <= a)) {
      medianIdx = mid;
    } else if ((b <= a && a <= c) || (c <= a && a <= b)) {
      medianIdx = low;
    } else {
      medianIdx = high;
    }

    recorder.addStep({
      type: 'compare',
      array: arr,
      comparingIndices: [low, mid, high],
      pivotIndex: medianIdx,
      partitionRange: [low, high],
      sortedIndices,
      recursionDepth: depth,
      phase: `Поиск медианы из трёх [${low}, ${mid}, ${high}]`,
      title: `Медиана из трёх: [${low}]=${a}, [${mid}]=${b}, [${high}]=${c} → выбрано [${medianIdx}]=${arr[medianIdx]}`,
      description: `Сравниваем три кандидата на роль опорного элемента: первый [${low}] (${a}), средний [${mid}] (${b}) и последний [${high}] (${c}). Медианным значением является ${arr[medianIdx]} на позиции [${medianIdx}].`,
    });

    return medianIdx;
  }

  function partition(low: number, high: number, depth: number): number {
    const chosenIdx = selectPivotIndex(low, high, depth);
    const pivotValue = arr[chosenIdx];

    recorder.addStep({
      type: 'pivot',
      array: arr,
      pivotIndex: chosenIdx,
      partitionRange: [low, high],
      sortedIndices,
      recursionDepth: depth,
      phase: `Разделение [${low}..${high}] (глубина ${depth})`,
      title: `Выбран опорный элемент [${chosenIdx}] = ${pivotValue}`,
      description: `На участке [${low}..${high}] по стратегии «${STRATEGY_LABELS[pivotStrategy]}» выбран опорный элемент [${chosenIdx}] = ${pivotValue}.`,
    });

    // Перемещаем опорный элемент в конец участка [high] для удобного прохода
    if (chosenIdx !== high) {
      const temp = arr[chosenIdx];
      arr[chosenIdx] = arr[high];
      arr[high] = temp;
      recorder.incrementSwaps();
      recorder.incrementMoves(2);

      recorder.addStep({
        type: 'swap',
        array: arr,
        swappingIndices: [chosenIdx, high],
        pivotIndex: high,
        partitionRange: [low, high],
        sortedIndices,
        recursionDepth: depth,
        phase: `Подготовка разделения [${low}..${high}]`,
        title: `Перенос опорного элемента на правую границу [${high}]`,
        description: `Временно перемещаем опорный элемент ${pivotValue} с позиции [${chosenIdx}] в правый конец участка [${high}], чтобы последовательно распределить остальные элементы.`,
      });
    }

    let storeIdx = low;

    for (let j = low; j < high; j++) {
      recorder.incrementComparisons();
      const currentVal = arr[j];
      const belongsLeft = order === 'asc' ? currentVal < pivotValue : currentVal > pivotValue;
      const cmpSign = order === 'asc' ? '<' : '>';

      recorder.addStep({
        type: 'compare',
        array: arr,
        comparingIndices: [j, high],
        pivotIndex: high,
        currentIndex: storeIdx,
        partitionRange: [low, high],
        sortedIndices,
        recursionDepth: depth,
        phase: `Разделение [${low}..${high}]`,
        title: `Сравнение [${j}] = ${currentVal} с опорным ${pivotValue}`,
        description: `Сравниваем элемент [${j}] (${currentVal}) с опорным значением ${pivotValue}. Граница элементов для левой части: [${storeIdx}].`,
        reason: belongsLeft
          ? `Значение ${currentVal} ${cmpSign} ${pivotValue} — элемент должен находиться левее опорного.`
          : `Значение ${currentVal} остаётся в правой части относительно опорного.`,
      });

      if (belongsLeft) {
        if (j !== storeIdx) {
          const tmp = arr[storeIdx];
          arr[storeIdx] = arr[j];
          arr[j] = tmp;
          recorder.incrementSwaps();
          recorder.incrementMoves(2);

          recorder.addStep({
            type: 'swap',
            array: arr,
            swappingIndices: [storeIdx, j],
            pivotIndex: high,
            partitionRange: [low, high],
            sortedIndices,
            recursionDepth: depth,
            phase: `Разделение [${low}..${high}]`,
            title: `Перемещение ${currentVal} в левую часть [${storeIdx}]`,
            description: `Меняем местами элементы [${storeIdx}] (${tmp}) и [${j}] (${currentVal}), расширяя левую область.`,
          });
        }
        storeIdx++;
      }
    }

    // Возвращаем опорный элемент на его финальную позицию storeIdx
    if (storeIdx !== high) {
      const tmp = arr[storeIdx];
      arr[storeIdx] = arr[high];
      arr[high] = tmp;
      recorder.incrementSwaps();
      recorder.incrementMoves(2);

      recorder.addStep({
        type: 'swap',
        array: arr,
        swappingIndices: [storeIdx, high],
        pivotIndex: storeIdx,
        partitionRange: [low, high],
        sortedIndices,
        recursionDepth: depth,
        phase: `Фиксация опорного элемента`,
        title: `Установка опорного элемента ${pivotValue} на позицию [${storeIdx}]`,
        description: `Помещаем опорный элемент ${pivotValue} между левой и правой частями на индекс ${storeIdx}.`,
      });
    }

    if (!sortedIndices.includes(storeIdx)) {
      sortedIndices.push(storeIdx);
    }

    recorder.addStep({
      type: 'mark-sorted',
      array: arr,
      pivotIndex: storeIdx,
      partitionRange: [low, high],
      sortedIndices,
      recursionDepth: depth,
      phase: `Разделение [${low}..${high}] завершено`,
      title: `Опорный элемент [${storeIdx}] = ${pivotValue} на финальном месте`,
      description: `Опорный элемент ${pivotValue} зафиксирован на позиции ${storeIdx}. Слева от него элементы ${order === 'asc' ? 'меньше' : 'больше'}, справа — остальные.`,
    });

    return storeIdx;
  }

  function quickSortRecursive(low: number, high: number, depth: number) {
    if (low > high) return;
    if (low === high) {
      if (!sortedIndices.includes(low)) {
        sortedIndices.push(low);
        recorder.addStep({
          type: 'mark-sorted',
          array: arr,
          sortedIndices,
          recursionDepth: depth,
          phase: `Базовый случай рекурсии`,
          title: `Подмассив из одного элемента [${low}] = ${arr[low]}`,
          description: `Участок [${low}..${low}] состоит из одного элемента (${arr[low]}) и уже находится на своей итоговой позиции.`,
        });
      }
      return;
    }

    const pivotIdx = partition(low, high, depth);
    quickSortRecursive(low, pivotIdx - 1, depth + 1);
    quickSortRecursive(pivotIdx + 1, high, depth + 1);
  }

  if (n > 0) {
    quickSortRecursive(0, n - 1, 1);
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
    algorithmId: 'quick',
    steps: recorder.getSteps(),
    sortedArray: arr,
    computeTimeMs,
    totalComparisons: stats.comparisons,
    totalSwaps: stats.swaps,
    totalMoves: stats.moves,
  };
}
