import { SortOrder } from '../types/algorithm';
import { AlgorithmExecutionResult } from '../types/visualization';
import { StepRecorder, shouldSwap } from './stepBuilder';

export function runShellSort(input: number[], order: SortOrder = 'asc'): AlgorithmExecutionResult {
  const startTime = performance.now();
  const arr = [...input];
  const n = arr.length;
  const recorder = new StepRecorder();

  recorder.addStep({
    type: 'init',
    array: arr,
    phase: 'Инициализация',
    title: 'Начало сортировки Шелла (Shell Sort)',
    description: `Используем классическую последовательность шагов Шелла (деление длины пополам: gap = ⌊n/2⌋, ⌊n/4⌋, ..., 1). Элементы сравниваются на расстоянии шага gap.`,
  });

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    recorder.addStep({
      type: 'shell-gap',
      array: arr,
      shellGap: gap,
      phase: `Шаг gap = ${gap}`,
      title: gap === 1 ? 'Финальный проход с шагом gap = 1' : `Установлен шаг сравнения gap = ${gap}`,
      description:
        gap === 1
          ? 'Шаг уменьшился до 1. Выполняется завершающий проход сортировки вставками по почти упорядоченному массиву.'
          : `Сравниваем и упорядочиваем подгруппы элементов, отстоящих друг от друга на расстояние ${gap} позиций.`,
    });

    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      // Собираем индексы текущей gap-подгруппы для наглядной подсветки
      const groupIndices: number[] = [];
      for (let g = i % gap; g <= i; g += gap) {
        groupIndices.push(g);
      }

      while (j >= gap) {
        recorder.incrementComparisons();
        const leftIdx = j - gap;
        const leftVal = arr[leftIdx];
        const needMove = shouldSwap(leftVal, temp, order);

        recorder.addStep({
          type: 'compare',
          array: arr,
          comparingIndices: [leftIdx, j],
          currentIndex: j,
          shellGap: gap,
          shellGroupIndices: groupIndices,
          phase: `Шаг gap = ${gap}`,
          title: `Сравнение на расстоянии ${gap}: [${leftIdx}] = ${leftVal} и [${j}] = ${temp}`,
          description: `Сравниваем элементы с индексами ${leftIdx} (значение ${leftVal}) и ${j} (значение ${temp}), находящиеся на расстоянии gap = ${gap}.`,
          reason: needMove
            ? `Значение ${leftVal} ${order === 'asc' ? '>' : '<'} ${temp} — перемещаем ${leftVal} на позицию [${j}].`
            : `Элементы на расстоянии ${gap} уже упорядочены.`,
        });

        if (needMove) {
          arr[j] = leftVal;
          arr[leftIdx] = temp;
          recorder.incrementSwaps();
          recorder.incrementMoves(2);

          recorder.addStep({
            type: 'swap',
            array: arr,
            swappingIndices: [leftIdx, j],
            currentIndex: leftIdx,
            shellGap: gap,
            shellGroupIndices: groupIndices,
            phase: `Шаг gap = ${gap}: сдвиг`,
            title: `Обмен элементов [${leftIdx}] ↔ [${j}] (шаг ${gap})`,
            description: `Перемещаем элемент ${leftVal} на индекс ${j}, а ${temp} — на индекс ${leftIdx}.`,
          });

          j -= gap;
        } else {
          break;
        }
      }
      arr[j] = temp;
    }
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
    algorithmId: 'shell',
    steps: recorder.getSteps(),
    sortedArray: arr,
    computeTimeMs,
    totalComparisons: stats.comparisons,
    totalSwaps: stats.swaps,
    totalMoves: stats.moves,
  };
}

