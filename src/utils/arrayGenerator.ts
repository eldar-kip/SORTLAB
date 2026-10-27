import { ArrayPresetType } from '../types/algorithm';

export function generateRandomArray(size: number, min = 5, max = 99): number[] {
  const clampedSize = Math.max(2, Math.min(100, size));
  const result: number[] = [];
  for (let i = 0; i < clampedSize; i++) {
    result.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }
  return result;
}

export function generateNearlySortedArray(size: number): number[] {
  const clampedSize = Math.max(2, Math.min(100, size));
  const arr: number[] = [];
  const step = Math.max(1, Math.floor(90 / clampedSize));
  let current = 6;
  for (let i = 0; i < clampedSize; i++) {
    arr.push(current);
    current += step + (i % 2 === 0 ? 1 : 0);
  }
  // Вносим несколько локальных нарушений порядка
  const swapsCount = Math.max(1, Math.floor(clampedSize / 5));
  for (let s = 0; s < swapsCount; s++) {
    const idxA = Math.floor(Math.random() * (clampedSize - 1));
    const idxB = Math.min(clampedSize - 1, idxA + 1 + Math.floor(Math.random() * 2));
    const tmp = arr[idxA];
    arr[idxA] = arr[idxB];
    arr[idxB] = tmp;
  }
  return arr;
}

export function generateReversedArray(size: number): number[] {
  const clampedSize = Math.max(2, Math.min(100, size));
  const arr: number[] = [];
  const step = Math.max(1, Math.floor(90 / clampedSize));
  let current = 95;
  for (let i = 0; i < clampedSize; i++) {
    arr.push(Math.max(2, current));
    current -= step;
  }
  return arr;
}

export function generateDuplicatesArray(size: number): number[] {
  const clampedSize = Math.max(2, Math.min(100, size));
  const palette = [12, 25, 38, 50, 64, 77, 90];
  const arr: number[] = [];
  for (let i = 0; i < clampedSize; i++) {
    const val = palette[Math.floor(Math.random() * palette.length)];
    arr.push(val);
  }
  return arr;
}

export function generateArrayByPreset(preset: ArrayPresetType, size: number): number[] {
  switch (preset) {
    case 'nearly-sorted':
      return generateNearlySortedArray(size);
    case 'reversed':
      return generateReversedArray(size);
    case 'duplicates':
      return generateDuplicatesArray(size);
    case 'random':
    default:
      return generateRandomArray(size);
  }
}

export function shuffleArray(input: number[]): number[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

export interface CustomArrayValidationResult {
  valid: boolean;
  array: number[];
  error?: string;
}

export function parseCustomArrayInput(raw: string): CustomArrayValidationResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return {
      valid: false,
      array: [],
      error: 'Поле ввода пусто. Введите целые числа через запятую или пробел (например: 42, 15, 73, 8, 29).',
    };
  }

  const tokens = trimmed.split(/[\s,;]+/).filter(Boolean);

  if (tokens.length < 2) {
    return {
      valid: false,
      array: [],
      error: 'Массив для демонстрации в лаборатории должен содержать минимум 2 элемента.',
    };
  }

  if (tokens.length > 100) {
    return {
      valid: false,
      array: [],
      error: `Вы ввели ${tokens.length} элементов. Максимально допустимый размер для плавной анимации — 100 элементов.`,
    };
  }

  const numbers: number[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (!/^-?\d+$/.test(token)) {
      return {
        valid: false,
        array: [],
        error: `Некорректное значение «${token}» (позиция ${i + 1}). Допускаются только целые числа.`,
      };
    }
    const parsed = Number(token);
    if (!Number.isSafeInteger(parsed) || parsed < -999 || parsed > 999) {
      return {
        valid: false,
        array: [],
        error: `Число ${token} выходит за допустимый диапазон [-999..999]. Используйте числа в пределах от -999 до 999 для наглядного отображения столбцов.`,
      };
    }
    numbers.push(parsed);
  }

  return {
    valid: true,
    array: numbers,
  };
}

