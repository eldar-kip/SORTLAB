import { SortOrder } from '../types/algorithm';
import { AlgorithmExecutionResult } from '../types/visualization';
import { StepRecorder } from './stepBuilder';

export function runHeapSort(input: number[], order: SortOrder = 'asc'): AlgorithmExecutionResult {
  const startTime = performance.now();
  const arr = [...input];
  const n = arr.length;
  const recorder = new StepRecorder();
  const sortedIndices: number[] = [];
  const heapTypeRu = order === 'asc' ? 'Max-Heap (максимум в корне)' : 'Min-Heap (минимум в корне)';
  const rootGoalRu = order === 'asc' ? 'максимальный' : 'минимальный';

  recorder.addStep({
    type: 'init',
    array: arr,
    heapSize: n,
    sortedIndices,
    phase: 'Инициализация',
    title: 'Начало пирамидальной сортировки (Heap Sort)',
    description: `Строим двоичную кучу ${heapTypeRu} из массива. Для узла i левый потомок имеет индекс 2i+1, правый — 2i+2. Затем последовательно извлекаем корень кучи в конец массива.`,
  });

  function heapify(heapSize: number, rootIdx: number, phaseName: string) {
    let target = rootIdx;
    const left = 2 * rootIdx + 1;
    const right = 2 * rootIdx + 2;

    if (left < heapSize) {
      recorder.incrementComparisons();
      const leftBetter = order === 'asc' ? arr[left] > arr[target] : arr[left] < arr[target];

      recorder.addStep({
        type: 'compare',
        array: arr,
        comparingIndices: [left, target],
        minMaxIndex: target,
        heapSize,
        sortedIndices,
        phase: phaseName,
        title: `Сравнение левого потомка [${left}] = ${arr[left]} с узлом [${target}] = ${arr[target]}`,
        description: `Проверяем свойство двоичной кучи для родителя [${rootIdx}]: сравниваем левый дочерний узел [${left}] (${arr[left]}) и [${target}] (${arr[target]}).`,
        reason: leftBetter
          ? `Дочерний элемент ${arr[left]} ${order === 'asc' ? '>' : '<'} ${arr[target]} — выбираем [${left}] как кандидат на вершину поддерева.`
          : `Узел [${target}] (${arr[target]}) сохраняет приоритет.`,
      });

      if (leftBetter) {
        target = left;
      }
    }

    if (right < heapSize) {
      recorder.incrementComparisons();
      const rightBetter = order === 'asc' ? arr[right] > arr[target] : arr[right] < arr[target];

      recorder.addStep({
        type: 'compare',
        array: arr,
        comparingIndices: [right, target],
        minMaxIndex: target,
        heapSize,
        sortedIndices,
        phase: phaseName,
        title: `Сравнение правого потомка [${right}] = ${arr[right]} с [${target}] = ${arr[target]}`,
        description: `Сравниваем правый дочерний узел [${right}] (${arr[right]}) с текущим лидером поддерева [${target}] (${arr[target]}).`,
        reason: rightBetter
          ? `Правый потомок ${arr[right]} ${order === 'asc' ? '>' : '<'} ${arr[target]} — теперь [${right}] становится главным кандидатом.`
          : `Лидером поддерева остаётся [${target}] (${arr[target]}).`,
      });

      if (rightBetter) {
        target = right;
      }
    }

    if (target !== rootIdx) {
      const valRoot = arr[rootIdx];
      const valTarget = arr[target];
      arr[rootIdx] = valTarget;
      arr[target] = valRoot;
      recorder.incrementSwaps();
      recorder.incrementMoves(2);

      recorder.addStep({
        type: 'heapify',
        array: arr,
        swappingIndices: [rootIdx, target],
        minMaxIndex: rootIdx,
        heapSize,
        sortedIndices,
        phase: phaseName,
        title: `Просеивание (sift-down): обмен [${rootIdx}] ↔ [${target}]`,
        description: `Восстанавливаем свойство кучи: поднимаем ${valTarget} в родительский узел [${rootIdx}], а ${valRoot} опускаем в [${target}].`,
      });

      heapify(heapSize, target, phaseName);
    }
  }

  // Этап 1: Построение двоичной кучи
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i, 'Этап 1: Построение двоичной кучи');
  }

  if (n > 1) {
    recorder.addStep({
      type: 'heap-build',
      array: arr,
      minMaxIndex: 0,
      heapSize: n,
      sortedIndices,
      phase: 'Этап 1 завершён: куча построена',
      title: `В корне кучи [0] находится ${rootGoalRu} элемент ${arr[0]}`,
      description: `Двоичная куча полностью построена! На вершине [0] находится ${rootGoalRu} элемент (${arr[0]}). Переходим к извлечению элементов.`,
    });
  }

  // Этап 2: Извлечение элементов из кучи
  for (let end = n - 1; end > 0; end--) {
    const rootVal = arr[0];
    const lastVal = arr[end];
    arr[0] = lastVal;
    arr[end] = rootVal;
    recorder.incrementSwaps();
    recorder.incrementMoves(2);
    sortedIndices.push(end);

    recorder.addStep({
      type: 'swap',
      array: arr,
      swappingIndices: [0, end],
      minMaxIndex: end,
      heapSize: end,
      sortedIndices,
      phase: 'Этап 2: Извлечение корня кучи',
      title: `Обмен корня [0] (${rootVal}) с концом активной кучи [${end}] (${lastVal})`,
      description: `Перемещаем ${rootGoalRu} элемент ${rootVal} с вершины кучи [0] на его финальную позицию [${end}]. Размер активной кучи уменьшается до ${end}.`,
    });

    heapify(end, 0, 'Этап 2: Восстановление кучи');
  }

  if (n > 0 && !sortedIndices.includes(0)) {
    sortedIndices.push(0);
  }

  recorder.addStep({
    type: 'complete',
    array: arr,
    heapSize: 0,
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    phase: 'Завершение',
    title: 'Сортировка завершена',
    description: 'Сортировка завершена. Все элементы расположены в правильном порядке.',
  });

  const computeTimeMs = Math.max(0.01, performance.now() - startTime);
  const stats = recorder.getStats();
  return {
    algorithmId: 'heap',
    steps: recorder.getSteps(),
    sortedArray: arr,
    computeTimeMs,
    totalComparisons: stats.comparisons,
    totalSwaps: stats.swaps,
    totalMoves: stats.moves,
  };
}

