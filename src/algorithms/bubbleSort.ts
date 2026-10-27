import { SortOrder } from '../types/algorithm';
import { AlgorithmExecutionResult } from '../types/visualization';
import { StepRecorder, shouldSwap } from './stepBuilder';

export function runBubbleSort(input: number[], order: SortOrder = 'asc'): AlgorithmExecutionResult {
  const startTime = performance.now();
  const arr = [...input];
  const n = arr.length;
  const recorder = new StepRecorder();
  const sortedIndices: number[] = [];
  const orderText = order === 'asc' ? 'по возрастанию' : 'по убыванию';

  recorder.addStep({
    type: 'init',
    array: arr,
    sortedIndices,
    phase: 'Инициализация',
    title: 'Начало сортировки пузырьком',
    description: `Запускаем Bubble Sort (${orderText}) для массива из ${n} элементов. Будем последовательно сравнивать соседние элементы.`,
  });

  if (n <= 1) {
    if (n === 1) sortedIndices.push(0);
    recorder.addStep({
      type: 'complete',
      array: arr,
      sortedIndices,
      phase: 'Завершение',
      title: 'Сортировка завершена',
      description: 'Сортировка завершена. Все элементы расположены в правильном порядке.',
    });
    const computeTimeMs = Math.max(0.01, performance.now() - startTime);
    const stats = recorder.getStats();
    return {
      algorithmId: 'bubble',
      steps: recorder.getSteps(),
      sortedArray: arr,
      computeTimeMs,
      totalComparisons: stats.comparisons,
      totalSwaps: stats.swaps,
      totalMoves: stats.moves,
    };
  }

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;
    const passNum = i + 1;

    for (let j = 0; j < n - 1 - i; j++) {
      const valA = arr[j];
      const valB = arr[j + 1];
      recorder.incrementComparisons();
      const needSwap = shouldSwap(valA, valB, order);
      const cmpSymbol = order === 'asc' ? '>' : '<';

      recorder.addStep({
        type: 'compare',
        array: arr,
        comparingIndices: [j, j + 1],
        sortedIndices,
        phase: `Проход ${passNum} из ${n - 1}`,
        title: `Сравнение элементов [${j}] и [${j + 1}]`,
        description: `Сравниваем соседние элементы с индексами ${j} (значение ${valA}) и ${j + 1} (значение ${valB}).`,
        reason: needSwap
          ? `Значение ${valA} ${cmpSymbol} ${valB}, порядок (${orderText}) нарушен — требуется обмен местами.`
          : `Значение ${valA} и ${valB} уже стоят в верном порядке (${orderText}) — обмен не требуется.`,
      });

      if (needSwap) {
        arr[j] = valB;
        arr[j + 1] = valA;
        swappedInPass = true;
        recorder.incrementSwaps();
        recorder.incrementMoves(2);

        recorder.addStep({
          type: 'swap',
          array: arr,
          swappingIndices: [j, j + 1],
          sortedIndices,
          phase: `Проход ${passNum} из ${n - 1}`,
          title: `Обмен элементов [${j}] ↔ [${j + 1}]`,
          description: `Меняем местами элементы с индексами ${j} и ${j + 1}: теперь на позиции ${j} находится ${valB}, а на позиции ${j + 1} — ${valA}.`,
          reason: `Выполнен обмен, так как ${valA} ${cmpSymbol} ${valB}.`,
        });
      }
    }

    const fixedIdx = n - 1 - i;
    if (!sortedIndices.includes(fixedIdx)) {
      sortedIndices.push(fixedIdx);
    }

    if (!swappedInPass) {
      // Раннее завершение: все оставшиеся элементы тоже отсортированы
      for (let k = 0; k < fixedIdx; k++) {
        if (!sortedIndices.includes(k)) sortedIndices.push(k);
      }
      recorder.addStep({
        type: 'mark-sorted',
        array: arr,
        sortedIndices,
        phase: `Проход ${passNum} (раннее завершение)`,
        title: 'Обменов на проходе не было',
        description: `За весь проход ${passNum} не произошло ни одного обмена. Это означает, что массив уже полностью упорядочен! Срабатывает оптимизация раннего выхода.`,
        reason: 'Количество обменов в текущем проходе равно 0.',
      });
      break;
    } else {
      recorder.addStep({
        type: 'mark-sorted',
        array: arr,
        sortedIndices,
        phase: `Завершение прохода ${passNum}`,
        title: `Элемент [${fixedIdx}] = ${arr[fixedIdx]} зафиксирован`,
        description: `Проход ${passNum} завершён. Элемент со значением ${arr[fixedIdx]} «всплыл» на свою финальную позицию с индексом ${fixedIdx}.`,
      });
    }
  }

  for (let k = 0; k < n; k++) {
    if (!sortedIndices.includes(k)) sortedIndices.push(k);
  }

  recorder.addStep({
    type: 'complete',
    array: arr,
    sortedIndices,
    phase: 'Завершение',
    title: 'Сортировка завершена',
    description: 'Сортировка завершена. Все элементы расположены в правильном порядке.',
  });

  const computeTimeMs = Math.max(0.01, performance.now() - startTime);
  const stats = recorder.getStats();
  return {
    algorithmId: 'bubble',
    steps: recorder.getSteps(),
    sortedArray: arr,
    computeTimeMs,
    totalComparisons: stats.comparisons,
    totalSwaps: stats.swaps,
    totalMoves: stats.moves,
  };
}

