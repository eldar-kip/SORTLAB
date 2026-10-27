import { ExperimentRecord } from '../types/visualization';
import { AlgorithmId, SortOrder } from '../types/algorithm';

const SETTINGS_KEY = 'sortlab_settings_v1';
const HISTORY_KEY = 'sortlab_history_v1';

export interface UserLabSettings {
  algorithmId: AlgorithmId;
  arraySize: number;
  speedMs: number;
  order: SortOrder;
}

const DEFAULT_SETTINGS: UserLabSettings = {
  algorithmId: 'bubble',
  arraySize: 20,
  speedMs: 180,
  order: 'asc',
};

export function loadUserSettings(): UserLabSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      algorithmId: parsed.algorithmId || DEFAULT_SETTINGS.algorithmId,
      arraySize:
        typeof parsed.arraySize === 'number'
          ? Math.max(5, Math.min(100, parsed.arraySize))
          : DEFAULT_SETTINGS.arraySize,
      speedMs:
        typeof parsed.speedMs === 'number'
          ? Math.max(10, Math.min(1500, parsed.speedMs))
          : DEFAULT_SETTINGS.speedMs,
      order: parsed.order === 'desc' ? 'desc' : 'asc',
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserLabSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export function loadExperimentHistory(): ExperimentRecord[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.slice(0, 15) : [];
  } catch {
    return [];
  }
}

export function saveExperimentHistory(records: ExperimentRecord[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(records.slice(0, 15)));
  } catch {
    // Ignore storage errors
  }
}

export function exportExperimentsToCsv(records: ExperimentRecord[]): void {
  if (records.length === 0) return;

  const headers = [
    'ID',
    'Дата и время',
    'Алгоритм',
    'Размер массива',
    'Направление',
    'Тип данных',
    'Сравнения',
    'Обмены',
    'Перемещения',
    'Всего шагов',
    'Время вычисления (мс)',
  ];

  const escapeCsvField = (value: string | number): string => {
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = records.map((rec) => [
    escapeCsvField(rec.id),
    escapeCsvField(rec.timestamp),
    escapeCsvField(rec.algorithmName),
    escapeCsvField(rec.arraySize),
    escapeCsvField(rec.order === 'asc' ? 'По возрастанию' : 'По убыванию'),
    escapeCsvField(rec.presetName),
    escapeCsvField(rec.comparisons),
    escapeCsvField(rec.swaps),
    escapeCsvField(rec.moves),
    escapeCsvField(rec.totalSteps),
    escapeCsvField(rec.computeTimeMs.toFixed(3)),
  ]);

  const csvContent = '\uFEFF' + [headers.map(escapeCsvField).join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `sortlab-experiments-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

