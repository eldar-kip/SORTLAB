import { SortOrder } from '../types/algorithm';
import { AlgorithmExecutionResult } from '../types/visualization';
import { StepRecorder, isStrictlyBetter } from './stepBuilder';

export function runSelectionSort(input: number[], order: SortOrder = 'asc'): AlgorithmExecutionResult {
  const startTime = performance.now();
  const arr = [...input];
  const n = arr.length;
  const recorder = new StepRecorder();
  const sortedIndices: number[] = [];
  const targetWord = order === 'asc' ? 'минимальный' : 'максимальный';
  const targetNoun = order === 'asc' ? 'минимум' : 'максимум';

  recorder.addStep({
    type: 'init',
    array: arr,
    sortedIndices,
    phase: 'Инициализация',
    title: 'Начало сортировки выбором',
    description: `Запускаем Selection Sort. На каждом проходе будем находить ${targetWord} элемент в неотсортированной части и помещать его в начало этой части.`,
  });

  for (let i = 0; i < n - 1; i++) {
    let extremeIdx = i;

    recorder.addStep({
      type: 'minimum',
      array: arr,
      minMaxIndex: extremeIdx,
      currentIndex: i,
      sortedIndices,
      phase: `Проход ${i + 1}: поиск ${targetNoun}а`,
      title: `Предполагаемый ${targetNoun}: [${i}] = ${arr[i]}`,
      description: `Начинаем проход с позиции ${i}. Принимаем первый элемент неотсортированной части [${i}] = ${arr[i]} за текущий ${targetNoun}.`,
    });

    for (let j = i + 1; j < n; j++) {
      recorder.incrementComparisons();
      const candidate = arr[j];
      const currentExtreme = arr[extremeIdx];
      const foundBetter = isStrictlyBetter(candidate, currentExtreme, order);

      recorder.addStep({
        type: 'compare',
        array: arr,
        comparingIndices: [j, extremeIdx],
        minMaxIndex: extremeIdx,
        currentIndex: i,
        sortedIndices,
        phase: `Проход ${i + 1}: сканирование`,
        title: `Сравнение [${j}] = ${candidate} с текущим ${targetNoun}ом [${extremeIdx}] = ${currentExtreme}`,
        description: `Просматриваем неотсортированную часть массива: сравниваем элемент [${j}] (${candidate}) с текущим ${targetNoun}ом [${extremeIdx}] (${currentExtreme}).`,
        reason: foundBetter
          ? `Значение ${candidate} ${order === 'asc' ? '<' : '>'} ${currentExtreme} — найден новый ${targetNoun} на позиции ${j}!`
          : `Значение ${candidate} не превосходит текущий ${targetNoun} ${currentExtreme}.`,
      });

      if (foundBetter) {
        extremeIdx = j;
        recorder.addStep({
          type: 'minimum',
          array: arr,
          minMaxIndex: extremeIdx,
          currentIndex: i,
          sortedIndices,
          phase: `Проход ${i + 1}: обновление ${targetNoun}а`,
          title: `Новый ${targetNoun} на индексе [${extremeIdx}] = ${arr[extremeIdx]}`,
          description: `Запоминаем индекс ${extremeIdx} со значением ${arr[extremeIdx]} как новый ${targetNoun} в неотсортированной части.`,
        });
      }
    }

    if (extremeIdx !== i) {
      const valI = arr[i];
      const valExt = arr[extremeIdx];
      arr[i] = valExt;
      arr[extremeIdx] = valI;
      recorder.incrementSwaps();
      recorder.incrementMoves(2);

      recorder.addStep({
        type: 'swap',
        array: arr,
        swappingIndices: [i, extremeIdx],
        minMaxIndex: i,
        sortedIndices,
        phase: `Проход ${i + 1}: обмен`,
        title: `Обмен границы [${i}] ↔ найденного ${targetNoun}а [${extremeIdx}]`,
        description: `Меняем местами найденный ${targetWord} элемент [${extremeIdx}] (${valExt}) с первым элементом неотсортированной части [${i}] (${valI}).`,
        reason: `Перемещаем ${targetWord} элемент ${valExt} на позицию ${i}.`,
      });
    }

    sortedIndices.push(i);
    recorder.addStep({
      type: 'mark-sorted',
      array: arr,
      sortedIndices,
      phase: `Проход ${i + 1} завершён`,
      title: `Позиция [${i}] = ${arr[i]} отсортирована`,
      description: `Элемент ${arr[i]} занял своё окончательное место на индексе ${i}. Граница отсортированной части сдвигается вправо.`,
    });
  }

  if (n > 0 && !sortedIndices.includes(n - 1)) {
    sortedIndices.push(n - 1);
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
    algorithmId: 'selection',
    steps: recorder.getSteps(),
    sortedArray: arr,
    computeTimeMs,
    totalComparisons: stats.comparisons,
    totalSwaps: stats.swaps,
    totalMoves: stats.moves,
  };
}

