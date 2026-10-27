import { SortOrder } from '../types/algorithm';
import { AlgorithmExecutionResult, FrequencyBucket } from '../types/visualization';
import { StepRecorder } from './stepBuilder';

export function runCountingSort(input: number[], order: SortOrder = 'asc'): AlgorithmExecutionResult {
  const startTime = performance.now();
  const arr = [...input];
  const n = arr.length;
  const recorder = new StepRecorder();
  const sortedIndices: number[] = [];

  if (n === 0) {
    recorder.addStep({
      type: 'complete',
      array: [],
      sortedIndices: [],
      phase: 'Завершение',
      title: 'Пустой массив',
      description: 'Массив пуст, сортировка не требуется.',
    });
    return {
      algorithmId: 'counting',
      steps: recorder.getSteps(),
      sortedArray: [],
      computeTimeMs: 0.01,
      totalComparisons: 0,
      totalSwaps: 0,
      totalMoves: 0,
    };
  }

  let minVal = arr[0];
  let maxVal = arr[0];
  for (let i = 1; i < n; i++) {
    if (arr[i] < minVal) minVal = arr[i];
    if (arr[i] > maxVal) maxVal = arr[i];
  }

  const rangeK = maxVal - minVal + 1;
  let warning: string | undefined;

  if (rangeK > 500) {
    warning = `Внимание: диапазон значений k = ${rangeK} (от ${minVal} до ${maxVal}) значительно превышает размер массива (n = ${n}). В реальных задачах при большом k Counting Sort неэффективен по памяти O(n + k). Для плавной визуализации отображаются только непустые корзины частот.`;
  }

  // Формируем структуру корзин частот
  // Если диапазон k <= 60, показываем весь непрерывный диапазон [minVal..maxVal];
  // если больше — показываем упорядоченные уникальные значения, чтобы не перегружать таблицу и память браузера.
  const useDenseBuckets = rangeK <= 60;
  const buckets: FrequencyBucket[] = [];
  const valueToBucketIndex = new Map<number, number>();

  if (useDenseBuckets) {
    for (let v = minVal; v <= maxVal; v++) {
      valueToBucketIndex.set(v, buckets.length);
      buckets.push({ value: v, count: 0, active: false });
    }
  } else {
    // Собираем уникальные значения без использования Array.prototype.sort:
    // используем разреженный подсчёт или вставку в упорядоченный список уникальных ключей
    const uniqueValues: number[] = [];
    for (let i = 0; i < n; i++) {
      const v = arr[i];
      if (!valueToBucketIndex.has(v)) {
        // Вставляем v в uniqueValues по возрастанию
        let pos = uniqueValues.length;
        while (pos > 0 && uniqueValues[pos - 1] > v) {
          uniqueValues[pos] = uniqueValues[pos - 1];
          pos--;
        }
        uniqueValues[pos] = v;
        valueToBucketIndex.set(v, 0);
      }
    }
    for (let idx = 0; idx < uniqueValues.length; idx++) {
      valueToBucketIndex.set(uniqueValues[idx], idx);
      buckets.push({ value: uniqueValues[idx], count: 0, active: false });
    }
  }

  recorder.addStep({
    type: 'init',
    array: arr,
    countArray: buckets,
    phase: 'Этап 1: Определение диапазона',
    title: `Диапазон значений: [${minVal}..${maxVal}] (k = ${rangeK})`,
    description: `Найдены минимальное (${minVal}) и максимальное (${maxVal}) значения массива. Размер диапазона k = ${rangeK}. Инициализируем таблицу частот.`,
    reason: warning,
  });

  // Этап 2: Подсчёт вхождений каждого элемента
  for (let i = 0; i < n; i++) {
    const val = arr[i];
    const bIdx = valueToBucketIndex.get(val)!;
    buckets.forEach((b, idx) => {
      b.active = idx === bIdx;
    });
    buckets[bIdx].count += 1;
    recorder.incrementMoves();

    recorder.addStep({
      type: 'count-update',
      array: arr,
      currentIndex: i,
      countArray: buckets,
      phase: 'Этап 2: Подсчёт частот',
      title: `Учёт элемента [${i}] = ${val} (частота: ${buckets[bIdx].count})`,
      description: `Читаем элемент [${i}] со значением ${val} и увеличиваем счётчик числа ${val} в таблице частот до ${buckets[bIdx].count}. Сравнения между элементами не выполняются!`,
    });
  }

  // Этап 3: Формирование отсортированного массива
  let writeIdx = 0;
  const bucketIterationOrder =
    order === 'asc'
      ? Array.from({ length: buckets.length }, (_, i) => i)
      : Array.from({ length: buckets.length }, (_, i) => buckets.length - 1 - i);

  for (const bIdx of bucketIterationOrder) {
    const bucket = buckets[bIdx];
    while (bucket.count > 0) {
      buckets.forEach((b, idx) => {
        b.active = idx === bIdx;
      });

      arr[writeIdx] = bucket.value;
      bucket.count -= 1;
      recorder.incrementMoves();
      sortedIndices.push(writeIdx);

      recorder.addStep({
        type: 'count-write',
        array: arr,
        swappingIndices: [writeIdx],
        currentIndex: writeIdx,
        sortedIndices,
        countArray: buckets,
        phase: 'Этап 3: Восстановление массива',
        title: `Запись значения ${bucket.value} на позицию [${writeIdx}]`,
        description: `Берём значение ${bucket.value} из таблицы частот и записываем его в результирующий массив на индекс ${writeIdx}. Остаток для числа ${bucket.value}: ${bucket.count}.`,
      });

      writeIdx++;
    }
  }

  buckets.forEach((b) => (b.active = false));

  recorder.addStep({
    type: 'complete',
    array: arr,
    sortedIndices: Array.from({ length: n }, (_, idx) => idx),
    countArray: buckets,
    phase: 'Завершение',
    title: 'Сортировка завершена',
    description: 'Сортировка завершена. Все элементы расположены в правильном порядке без единого попарного сравнения элементов!',
  });

  const computeTimeMs = Math.max(0.01, performance.now() - startTime);
  const stats = recorder.getStats();
  return {
    algorithmId: 'counting',
    steps: recorder.getSteps(),
    sortedArray: arr,
    computeTimeMs,
    totalComparisons: stats.comparisons,
    totalSwaps: stats.swaps,
    totalMoves: stats.moves,
    warning,
  };
}

