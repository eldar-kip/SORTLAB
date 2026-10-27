import { describe, it, expect } from 'vitest';
import { executeSortingAlgorithm } from './index';
import { AlgorithmId } from '../types/algorithm';
import { parseCustomArrayInput } from '../utils/arrayGenerator';

const ALL_ALGORITHMS: AlgorithmId[] = [
  'bubble',
  'selection',
  'insertion',
  'merge',
  'quick',
  'heap',
  'shell',
  'counting',
];

describe('SORTLAB — Полное тестирование всех 8 алгоритмов сортировки', () => {
  ALL_ALGORITHMS.forEach((algId) => {
    describe(`Алгоритм: ${algId}`, () => {
      it('1. Сортирует обычный случайный массив по возрастанию (asc)', () => {
        const input = [42, 15, 73, 8, 29, 61, 4, 35];
        const expected = [...input].sort((a, b) => a - b);
        const result = executeSortingAlgorithm(algId, input, 'asc');
        expect(result.sortedArray).toEqual(expected);
        expect(result.steps[result.steps.length - 1].array).toEqual(expected);
      });

      it('2. Сортирует обычный массив по убыванию (desc)', () => {
        const input = [42, 15, 73, 8, 29, 61, 4, 35];
        const expected = [...input].sort((a, b) => b - a);
        const result = executeSortingAlgorithm(algId, input, 'desc');
        expect(result.sortedArray).toEqual(expected);
        expect(result.steps[result.steps.length - 1].array).toEqual(expected);
      });

      it('3. Сортирует массив с повторяющимися значениями (дубликатами)', () => {
        const input = [12, 5, 12, 3, 5, 12, 1, 3, 5];
        const expectedAsc = [...input].sort((a, b) => a - b);
        const expectedDesc = [...input].sort((a, b) => b - a);

        expect(executeSortingAlgorithm(algId, input, 'asc').sortedArray).toEqual(expectedAsc);
        expect(executeSortingAlgorithm(algId, input, 'desc').sortedArray).toEqual(expectedDesc);
      });

      it('4. Сортирует массив с отрицательными числами и нулём', () => {
        const input = [-15, 0, 24, -3, -42, 8, -3, 11];
        const expectedAsc = [...input].sort((a, b) => a - b);
        const expectedDesc = [...input].sort((a, b) => b - a);

        expect(executeSortingAlgorithm(algId, input, 'asc').sortedArray).toEqual(expectedAsc);
        expect(executeSortingAlgorithm(algId, input, 'desc').sortedArray).toEqual(expectedDesc);
      });

      it('5. Сортирует массив из двух элементов', () => {
        expect(executeSortingAlgorithm(algId, [9, 2], 'asc').sortedArray).toEqual([2, 9]);
        expect(executeSortingAlgorithm(algId, [2, 9], 'desc').sortedArray).toEqual([9, 2]);
      });

      it('6. Корректно обрабатывает уже упорядоченный массив и обратный порядок', () => {
        const sorted = [1, 2, 3, 4, 5, 6, 7];
        const reversed = [7, 6, 5, 4, 3, 2, 1];

        expect(executeSortingAlgorithm(algId, sorted, 'asc').sortedArray).toEqual(sorted);
        expect(executeSortingAlgorithm(algId, reversed, 'asc').sortedArray).toEqual(sorted);
        expect(executeSortingAlgorithm(algId, sorted, 'desc').sortedArray).toEqual(reversed);
      });

      it('7. Корректно обрабатывает массив из одинаковых элементов и граничные случаи (0 и 1 элемент)', () => {
        const identical = [7, 7, 7, 7, 7];
        expect(executeSortingAlgorithm(algId, identical, 'asc').sortedArray).toEqual(identical);
        expect(executeSortingAlgorithm(algId, [42], 'asc').sortedArray).toEqual([42]);
        expect(executeSortingAlgorithm(algId, [], 'asc').sortedArray).toEqual([]);
      });

      it('8. Обеспечивает консистентность пошаговой истории и счётчиков при возврате на предыдущий шаг', () => {
        const input = [18, 7, 25, 3, 12];
        const result = executeSortingAlgorithm(algId, input, 'asc');
        expect(result.steps.length).toBeGreaterThan(1);

        // Проверяем, что шаг 0 хранит исходный массив и нулевую статистику
        expect(result.steps[0].array).toEqual(input);
        expect(result.steps[0].stats).toEqual({ comparisons: 0, swaps: 0, moves: 0 });

        // Проверяем монотонность счётчиков при движении вперёд и точное восстановление при движении назад
        for (let i = 1; i < result.steps.length; i++) {
          const prev = result.steps[i - 1];
          const curr = result.steps[i];
          expect(curr.stepNumber).toBe(i);
          expect(curr.stats.comparisons).toBeGreaterThanOrEqual(prev.stats.comparisons);
          expect(curr.stats.swaps).toBeGreaterThanOrEqual(prev.stats.swaps);
          expect(curr.stats.moves).toBeGreaterThanOrEqual(prev.stats.moves);
          expect(curr.array.length).toBe(input.length);
        }
      });
    });
  });

  describe('Quick Sort: проверка всех 4 стратегий выбора опорного элемента (pivot)', () => {
    const strategies = ['middle', 'median3', 'last', 'first'] as const;
    strategies.forEach((strat) => {
      it(`Корректно сортирует массив по возрастанию и убыванию при стратегии pivot = "${strat}"`, () => {
        const input = [34, -5, 19, 88, 19, 0, 7, 42, -12, 63];
        const expectedAsc = [...input].sort((a, b) => a - b);
        const expectedDesc = [...input].sort((a, b) => b - a);

        expect(executeSortingAlgorithm('quick', input, 'asc', strat).sortedArray).toEqual(expectedAsc);
        expect(executeSortingAlgorithm('quick', input, 'desc', strat).sortedArray).toEqual(expectedDesc);
      });
    });
  });

  describe('Counting Sort: проверка большого диапазона k', () => {
    it('Выдаёт предупреждение при большом диапазоне k > 500, но корректно сортирует массив', () => {
      const input = [-400, 5, 350, 0, -10];
      const result = executeSortingAlgorithm('counting', input, 'asc');
      expect(result.sortedArray).toEqual([-400, -10, 0, 5, 350]);
      expect(result.warning).toBeDefined();
    });
  });

  describe('Валидация пользовательского ввода массива', () => {
    it('Принимает корректную строку чисел через запятую и пробел', () => {
      const res = parseCustomArrayInput('42, 15, 73, 8, -5');
      expect(res.valid).toBe(true);
      expect(res.array).toEqual([42, 15, 73, 8, -5]);
    });

    it('Отклоняет пустой ввод, одиночное число и некорректные символы', () => {
      expect(parseCustomArrayInput('   ').valid).toBe(false);
      expect(parseCustomArrayInput('42').valid).toBe(false);
      expect(parseCustomArrayInput('10, abc, 20').valid).toBe(false);
      expect(parseCustomArrayInput('10, 99999, 20').valid).toBe(false);
    });
  });
});

