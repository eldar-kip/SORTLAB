import { SortOrder } from '../types/algorithm';
import { AlgorithmExecutionResult } from '../types/visualization';
import { StepRecorder, shouldSwap } from './stepBuilder';

export function runInsertionSort(input: number[], order: SortOrder = 'asc'): AlgorithmExecutionResult {
  const startTime = performance.now();
  const arr = [...input];
  const n = arr.length;
  const recorder = new StepRecorder();
  const sortedIndices: number[] = n > 0 ? [0] : [];

  recorder.addStep({
    type: 'init',
    array: arr,
    sortedIndices,
    phase: 'Инициализация',
    title: 'Начало сортировки вставками',
    description: 'Первый элемент [0] считается уже отсортированным подмассивом из одного элемента. Последовательно вставляем каждый следующий элемент на нужную позицию слева.',
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    recorder.addStep({
      type: 'move',
      array: arr,
      currentIndex: i,
      sortedIndices,
      phase: `Вставка элемента [${i}]`,
      title: `Выбран элемент [${i}] = ${key}`,
      description: `Берём текущий элемент с индексом ${i} (значение ${key}) для вставки в отсортированную левую часть [0..${i - 1}].`,
    });

    while (j >= 0) {
      recorder.incrementComparisons();
      const leftVal = arr[j];
      const needShift = shouldSwap(leftVal, key, order);

      recorder.addStep({
        type: 'compare',
        array: arr,
        comparingIndices: [j, j + 1],
        currentIndex: j + 1,
        sortedIndices,
        phase: `Вставка элемента ${key}`,
        title: `Сравнение [${j}] = ${leftVal} и вставляемого ${key}`,
        description: `Сравниваем элемент слева [${j}] (${leftVal}) со вставляемым значением ${key}.`,
        reason: needShift
          ? `Значение ${leftVal} ${order === 'asc' ? '>' : '<'} ${key} — сдвигаем ${leftVal} на одну позицию вправо.`
          : `Значение ${leftVal} уже стоит корректно относительно ${key} — подходящее место для вставки найдено.`,
      });

      if (needShift) {
        arr[j + 1] = arr[j];
        arr[j] = key; // Для наглядной визуализации перемещения вставляемого элемента
        recorder.incrementMoves();
        recorder.incrementSwaps();

        recorder.addStep({
          type: 'swap',
          array: arr,
          swappingIndices: [j, j + 1],
          currentIndex: j,
          sortedIndices,
          phase: `Сдвиг вправо`,
          title: `Сдвиг элемента ${leftVal} вправо на [${j + 1}]`,
          description: `Сдвигаем элемент ${leftVal} с позиции ${j} на позицию ${j + 1}, продвигая вставляемый элемент ${key} влево.`,
        });
        j--;
      } else {
        break;
      }
    }

    arr[j + 1] = key;
    recorder.incrementMoves();
    if (!sortedIndices.includes(i)) {
      sortedIndices.push(i);
    }

    recorder.addStep({
      type: 'mark-sorted',
      array: arr,
      currentIndex: j + 1,
      sortedIndices,
      phase: `Завершение вставки`,
      title: `Элемент ${key} вставлен на позицию [${j + 1}]`,
      description: `Элемент ${key} занял своё место на индексе ${j + 1}. Теперь подмассив [0..${i}] полностью упорядочен.`,
    });
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
    algorithmId: 'insertion',
    steps: recorder.getSteps(),
    sortedArray: arr,
    computeTimeMs,
    totalComparisons: stats.comparisons,
    totalSwaps: stats.swaps,
    totalMoves: stats.moves,
  };
}

