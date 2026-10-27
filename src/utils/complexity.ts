import { AlgorithmId, SortOrder } from '../types/algorithm';

export interface BigOPoint {
  n: number;
  O1: number;
  OlogN: number;
  On: number;
  OnLogN: number;
  On2: number;
}

export function generateBigOCurveData(maxN: number): BigOPoint[] {
  const points: BigOPoint[] = [];
  const step = Math.max(1, Math.floor(maxN / 25));

  for (let n = 1; n <= maxN; n += step) {
    points.push({
      n,
      O1: 1,
      OlogN: Number(Math.max(1, Math.log2(n)).toFixed(2)),
      On: n,
      OnLogN: Number((n * Math.max(1, Math.log2(n))).toFixed(1)),
      On2: n * n,
    });
  }

  if (points[points.length - 1]?.n !== maxN) {
    points.push({
      n: maxN,
      O1: 1,
      OlogN: Number(Math.max(1, Math.log2(maxN)).toFixed(2)),
      On: maxN,
      OnLogN: Number((maxN * Math.max(1, Math.log2(maxN))).toFixed(1)),
      On2: maxN * maxN,
    });
  }

  return points;
}

export interface PureBenchmarkMetrics {
  algorithmId: AlgorithmId;
  size: number;
  comparisons: number;
  moves: number;
  computeTimeMs: number;
}

/**
 * Выполняет чистое алгоритмическое измерение без накладных расходов на копирование кадров анимации,
 * чтобы честно измерять время вычисления и количество операций на разных размерах массива.
 */
export function runPureAlgorithmBenchmark(
  algorithmId: AlgorithmId,
  input: number[],
  order: SortOrder = 'asc'
): PureBenchmarkMetrics {
  let comparisons = 0;
  let moves = 0;
  const cmp = (a: number, b: number) => {
    comparisons++;
    return order === 'asc' ? a > b : a < b;
  };

  // Для более точного измерения коротких запусков усредняем по нескольким повторам на одинаковом входе
  const iterations = input.length <= 100 ? 15 : 5;
  const t0 = performance.now();

  for (let iter = 0; iter < iterations; iter++) {
    const arr = [...input];
    const n = arr.length;
    if (iter > 0) {
      comparisons = 0;
      moves = 0;
    }

    if (algorithmId === 'bubble') {
      for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
          if (cmp(arr[j], arr[j + 1])) {
            const t = arr[j];
            arr[j] = arr[j + 1];
            arr[j + 1] = t;
            moves += 2;
            swapped = true;
          }
        }
        if (!swapped) break;
      }
    } else if (algorithmId === 'selection') {
      for (let i = 0; i < n - 1; i++) {
        let ext = i;
        for (let j = i + 1; j < n; j++) {
          comparisons++;
          if (order === 'asc' ? arr[j] < arr[ext] : arr[j] > arr[ext]) {
            ext = j;
          }
        }
        if (ext !== i) {
          const t = arr[i];
          arr[i] = arr[ext];
          arr[ext] = t;
          moves += 2;
        }
      }
    } else if (algorithmId === 'insertion') {
      for (let i = 1; i < n; i++) {
        const key = arr[i];
        let j = i - 1;
        while (j >= 0 && cmp(arr[j], key)) {
          arr[j + 1] = arr[j];
          moves++;
          j--;
        }
        arr[j + 1] = key;
        moves++;
      }
    } else if (algorithmId === 'merge') {
      const mergeSort = (l: number, r: number) => {
        if (l >= r) return;
        const m = Math.floor((l + r) / 2);
        mergeSort(l, m);
        mergeSort(m + 1, r);
        const left = arr.slice(l, m + 1);
        const right = arr.slice(m + 1, r + 1);
        let i = 0,
          j = 0,
          k = l;
        while (i < left.length && j < right.length) {
          comparisons++;
          if (order === 'asc' ? left[i] <= right[j] : left[i] >= right[j]) {
            arr[k++] = left[i++];
          } else {
            arr[k++] = right[j++];
          }
          moves++;
        }
        while (i < left.length) {
          arr[k++] = left[i++];
          moves++;
        }
        while (j < right.length) {
          arr[k++] = right[j++];
          moves++;
        }
      };
      mergeSort(0, n - 1);
    } else if (algorithmId === 'quick') {
      const qSort = (low: number, high: number) => {
        if (low >= high) return;
        const mid = Math.floor((low + high) / 2);
        const pivot = arr[mid];
        const tmp0 = arr[mid];
        arr[mid] = arr[high];
        arr[high] = tmp0;
        moves += 2;
        let store = low;
        for (let j = low; j < high; j++) {
          comparisons++;
          if (order === 'asc' ? arr[j] < pivot : arr[j] > pivot) {
            const t = arr[store];
            arr[store] = arr[j];
            arr[j] = t;
            moves += 2;
            store++;
          }
        }
        const t = arr[store];
        arr[store] = arr[high];
        arr[high] = t;
        moves += 2;
        qSort(low, store - 1);
        qSort(store + 1, high);
      };
      qSort(0, n - 1);
    } else if (algorithmId === 'heap') {
      const heapify = (size: number, root: number) => {
        let target = root;
        const l = 2 * root + 1;
        const r = 2 * root + 2;
        if (l < size) {
          comparisons++;
          if (order === 'asc' ? arr[l] > arr[target] : arr[l] < arr[target]) target = l;
        }
        if (r < size) {
          comparisons++;
          if (order === 'asc' ? arr[r] > arr[target] : arr[r] < arr[target]) target = r;
        }
        if (target !== root) {
          const t = arr[root];
          arr[root] = arr[target];
          arr[target] = t;
          moves += 2;
          heapify(size, target);
        }
      };
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);
      for (let i = n - 1; i > 0; i--) {
        const t = arr[0];
        arr[0] = arr[i];
        arr[i] = t;
        moves += 2;
        heapify(i, 0);
      }
    } else if (algorithmId === 'shell') {
      for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
          const temp = arr[i];
          let j = i;
          while (j >= gap && cmp(arr[j - gap], temp)) {
            arr[j] = arr[j - gap];
            moves++;
            j -= gap;
          }
          arr[j] = temp;
          moves++;
        }
      }
    } else if (algorithmId === 'counting') {
      if (n > 0) {
        let minV = arr[0],
          maxV = arr[0];
        for (let i = 1; i < n; i++) {
          if (arr[i] < minV) minV = arr[i];
          if (arr[i] > maxV) maxV = arr[i];
        }
        const k = maxV - minV + 1;
        const counts = new Array(k).fill(0);
        for (let i = 0; i < n; i++) {
          counts[arr[i] - minV]++;
          moves++;
        }
        let idx = 0;
        if (order === 'asc') {
          for (let v = 0; v < k; v++) {
            while (counts[v]-- > 0) {
              arr[idx++] = v + minV;
              moves++;
            }
          }
        } else {
          for (let v = k - 1; v >= 0; v--) {
            while (counts[v]-- > 0) {
              arr[idx++] = v + minV;
              moves++;
            }
          }
        }
      }
    }
  }

  const totalTime = performance.now() - t0;
  return {
    algorithmId,
    size: input.length,
    comparisons,
    moves,
    computeTimeMs: Number(Math.max(0.005, totalTime / iterations).toFixed(4)),
  };
}

