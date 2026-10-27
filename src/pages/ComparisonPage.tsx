import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { AlgorithmId, ArrayPresetType, SortOrder } from '../types/algorithm';
import { ALGORITHMS_DATA, getAlgorithmById } from '../data/algorithms';
import { executeSortingAlgorithm } from '../algorithms';
import { generateArrayByPreset } from '../utils/arrayGenerator';
import {
  formatComputeTime,
  formatElapsedTime,
  runPureAlgorithmBenchmark,
} from '../utils/complexity';
import { PlaybackStatus } from '../types/visualization';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import {
  GitCompare,
  Play,
  Pause,
  RotateCcw,
  Dices,
  CheckCircle2,
  BarChart2,
  TrendingUp,
  Info,
  Sparkles,
} from 'lucide-react';

const ALG_COLORS: Record<AlgorithmId, string> = {
  bubble: '#EF4444',
  selection: '#F59E0B',
  insertion: '#EAB308',
  merge: '#06B6D4',
  quick: '#8B5CF6',
  heap: '#EC4899',
  shell: '#3B82F6',
  counting: '#22C55E',
};

const SERIES_SIZES = [15, 35, 70, 120, 200, 300];

export const ComparisonPage: React.FC = () => {
  const [selectedIds, setSelectedIds] = useState<AlgorithmId[]>([
    'bubble',
    'insertion',
    'quick',
  ]);
  const [arraySize, setArraySize] = useState<number>(22);
  const [preset, setPreset] = useState<ArrayPresetType>('random');
  const [order, setOrder] = useState<SortOrder>('asc');
  const [speedMs, setSpeedMs] = useState<number>(90);

  const [sharedArray, setSharedArray] = useState<number[]>(() =>
    generateArrayByPreset('random', 22)
  );
  const [tickIndex, setTickIndex] = useState<number>(0);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [elapsedAnimMs, setElapsedAnimMs] = useState<number>(0);

  const timerRef = useRef<number | null>(null);
  const runStartPerfRef = useRef<number | null>(null);
  const accumulatedAnimMsRef = useRef<number>(0);
  const speedRef = useRef<number>(speedMs);
  const statusRef = useRef<PlaybackStatus>(status);

  speedRef.current = speedMs;
  statusRef.current = status;

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (runStartPerfRef.current !== null) {
      accumulatedAnimMsRef.current += Math.max(
        0,
        performance.now() - runStartPerfRef.current
      );
      runStartPerfRef.current = null;
    }
  }, []);

  // Переключение алгоритмов (от 2 до 4)
  const toggleAlgorithm = (id: AlgorithmId) => {
    clearTimer();
    setStatus('idle');
    setTickIndex(0);
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length <= 2) return prev; // Минимум 2 алгоритма
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 4) return [...prev.slice(1), id]; // Максимум 4 алгоритма
        return [...prev, id];
      }
    });
  };

  // Вычисляем результаты всех выбранных алгоритмов на ОДИНАКОВОМ исходном массиве
  const results = useMemo(() => {
    return selectedIds.map((algId) =>
      executeSortingAlgorithm(algId, sharedArray, order)
    );
  }, [selectedIds, sharedArray, order]);

  const maxTotalSteps = useMemo(() => {
    return Math.max(1, ...results.map((r) => r.steps.length - 1));
  }, [results]);

  // Отслеживание времени анимации при запущенном сравнении
  useEffect(() => {
    if (status !== 'running') {
      if (runStartPerfRef.current !== null) {
        accumulatedAnimMsRef.current += Math.max(
          0,
          performance.now() - runStartPerfRef.current
        );
        runStartPerfRef.current = null;
      }
      return;
    }

    runStartPerfRef.current = performance.now();

    return () => {
      if (runStartPerfRef.current !== null) {
        accumulatedAnimMsRef.current += Math.max(
          0,
          performance.now() - runStartPerfRef.current
        );
        runStartPerfRef.current = null;
      }
    };
  }, [status]);

  // Синхронное пошаговое воспроизведение строго по 1 шагу со скоростью speedMs
  useEffect(() => {
    if (status !== 'running') {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    if (tickIndex >= maxTotalSteps) {
      if (runStartPerfRef.current !== null) {
        accumulatedAnimMsRef.current += Math.max(
          0,
          performance.now() - runStartPerfRef.current
        );
        runStartPerfRef.current = null;
      }
      setElapsedAnimMs(accumulatedAnimMsRef.current);
      setStatus('completed');
      return;
    }

    const timeoutId = window.setTimeout(() => {
      if (statusRef.current !== 'running') return;
      if (runStartPerfRef.current !== null) {
        setElapsedAnimMs(
          accumulatedAnimMsRef.current +
            (performance.now() - runStartPerfRef.current)
        );
      }
      const next = tickIndex + 1;
      if (next >= maxTotalSteps) {
        if (runStartPerfRef.current !== null) {
          accumulatedAnimMsRef.current += Math.max(
            0,
            performance.now() - runStartPerfRef.current
          );
          runStartPerfRef.current = null;
        }
        setElapsedAnimMs(accumulatedAnimMsRef.current);
        setTickIndex(maxTotalSteps);
        setStatus('completed');
      } else {
        setTickIndex(next);
      }
    }, speedMs);

    timerRef.current = timeoutId;

    return () => {
      window.clearTimeout(timeoutId);
      if (timerRef.current === timeoutId) {
        timerRef.current = null;
      }
    };
  }, [status, tickIndex, speedMs, maxTotalSteps]);

  const handleGenerateNewData = (newPreset: ArrayPresetType = preset, newSize: number = arraySize) => {
    clearTimer();
    accumulatedAnimMsRef.current = 0;
    runStartPerfRef.current = null;
    setElapsedAnimMs(0);
    setStatus('idle');
    setTickIndex(0);
    setPreset(newPreset);
    setArraySize(newSize);
    setSharedArray(generateArrayByPreset(newPreset, newSize));
  };

  const handleStartAll = () => {
    if (tickIndex >= maxTotalSteps || tickIndex === 0) {
      accumulatedAnimMsRef.current = 0;
      runStartPerfRef.current = null;
      setElapsedAnimMs(0);
      setTickIndex(0);
    }
    setStatus('running');
  };

  const handlePauseAll = () => {
    clearTimer();
    setElapsedAnimMs(accumulatedAnimMsRef.current);
    setStatus('paused');
  };

  const handleResetAll = () => {
    clearTimer();
    accumulatedAnimMsRef.current = 0;
    runStartPerfRef.current = null;
    setElapsedAnimMs(0);
    setStatus('idle');
    setTickIndex(0);
  };

  // Данные для графиков сравнения текущего эксперимента
  const currentChartData = useMemo(() => {
    return results.map((res) => {
      const info = getAlgorithmById(res.algorithmId);
      return {
        name: info.nameEn,
        Сравнения: res.totalComparisons,
        Обмены: res.totalSwaps,
        Перемещения: res.totalMoves,
        ВремяМс: Number(res.computeTimeMs.toFixed(5)),
        ВремяТекст: formatComputeTime(res.computeTimeMs),
      };
    });
  }, [results]);

  // Эксперимент зависимости времени и операций от размера массива (4-й график)
  const [seriesSeed, setSeriesSeed] = useState<number>(1);
  const scalingSeriesData = useMemo(() => {
    void seriesSeed;
    return SERIES_SIZES.map((sz) => {
      const testDataset = generateArrayByPreset(preset, Math.min(100, sz));
      // Если sz > 100, расширяем тестовый набор одинаково для всех алгоритмов
      while (testDataset.length < sz) {
        testDataset.push(Math.floor(Math.random() * 95) + 5);
      }

      const row: Record<string, number | string> = { size: `n=${sz}`, n: sz };
      selectedIds.forEach((algId) => {
        const info = getAlgorithmById(algId);
        const bench = runPureAlgorithmBenchmark(algId, testDataset, order);
        row[`${info.nameEn} (мс)`] = bench.computeTimeMs;
        row[`${info.nameEn} (сравн.)`] = bench.comparisons;
      });
      return row;
    });
  }, [selectedIds, preset, order, seriesSeed]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Заголовок */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/30 text-xs font-semibold text-[#22C55E]">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Синхронный стенд</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F3F4F6]">
          Сравнение алгоритмов
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl">
          Выберите от 2 до 4 алгоритмов и запустите их одновременно на абсолютно одинаковых входных данных, чтобы наглядно сопоставить количество сравнений, перемещений и время вычисления.
        </p>
      </div>

      {/* Выбор от 2 до 4 алгоритмов */}
      <div className="bg-[#171D29] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F3F4F6]">
            Выбрано алгоритмов: {selectedIds.length} из 4 (минимум 2)
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                clearTimer();
                setStatus('idle');
                setTickIndex(0);
                setSelectedIds(['bubble', 'quick']);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#121620] hover:bg-white/10 border border-white/10 text-[#06B6D4]"
            >
              Пресет: Bubble vs Quick
            </button>
            <button
              type="button"
              onClick={() => {
                clearTimer();
                setStatus('idle');
                setTickIndex(0);
                setSelectedIds(['merge', 'quick', 'heap', 'shell']);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-[#121620] hover:bg-white/10 border border-white/10 text-[#8B5CF6]"
            >
              Пресет: Топ-4 быстрых
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {ALGORITHMS_DATA.map((alg) => {
            const active = selectedIds.includes(alg.id);
            return (
              <button
                key={alg.id}
                type="button"
                onClick={() => toggleAlgorithm(alg.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  active
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6] shadow-glow-purple'
                    : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold truncate">{alg.nameEn}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: ALG_COLORS[alg.id] }}
                  />
                </div>
                <div className="text-[10px] text-[#9CA3AF] truncate mt-0.5">
                  {alg.nameRu}
                </div>
                <span className="mt-1.5 inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-[#06B6D4]">
                  {alg.averageComplexity}
                </span>
              </button>
            );
          })}
        </div>

        {/* Панель общего управления экспериментом */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {status !== 'running' ? (
              <button
                type="button"
                onClick={handleStartAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white text-xs sm:text-sm font-bold shadow-glow-purple"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {status === 'paused' ? 'Продолжить все' : 'Запустить одновременно'}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePauseAll}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B]/20 border border-[#F59E0B] text-[#F59E0B] text-xs sm:text-sm font-bold"
              >
                <Pause className="w-4 h-4" />
                <span>Пауза</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetAll}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#121620] hover:bg-white/10 border border-white/15 text-xs sm:text-sm text-[#F3F4F6]"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Сбросить</span>
            </button>

            <button
              type="button"
              onClick={() => handleGenerateNewData(preset, arraySize)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#121620] hover:bg-white/10 border border-white/15 text-xs sm:text-sm text-[#06B6D4]"
            >
              <Dices className="w-4 h-4" />
              <span>Новый общий массив</span>
            </button>
          </div>

          {/* Общие параметры входа */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <select
              value={preset}
              onChange={(e) =>
                handleGenerateNewData(e.target.value as ArrayPresetType, arraySize)
              }
              className="px-3 py-2 rounded-xl bg-[#121620] border border-white/15 text-[#F3F4F6]"
            >
              <option value="random">Случайный массив</option>
              <option value="nearly-sorted">Почти отсортированный</option>
              <option value="reversed">Обратный порядок</option>
              <option value="duplicates">Повторяющиеся значения</option>
            </select>

            <select
              value={order}
              onChange={(e) => {
                clearTimer();
                setStatus('idle');
                setTickIndex(0);
                setOrder(e.target.value as SortOrder);
              }}
              className="px-3 py-2 rounded-xl bg-[#121620] border border-white/15 text-[#F3F4F6]"
            >
              <option value="asc">По возрастанию</option>
              <option value="desc">По убыванию</option>
            </select>

            <div className="flex items-center gap-2 bg-[#121620] px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-[#9CA3AF]">n = {arraySize}</span>
              <input
                type="range"
                min={8}
                max={60}
                value={arraySize}
                onChange={(e) =>
                  handleGenerateNewData(preset, Number(e.target.value))
                }
                className="w-20 accent-[#8B5CF6]"
              />
            </div>

            <div className="flex items-center gap-2 bg-[#121620] px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-[#9CA3AF]">Скорость:</span>
              <select
                value={speedMs}
                onChange={(e) => setSpeedMs(Number(e.target.value))}
                className="bg-transparent text-[#06B6D4] font-mono focus:outline-none"
              >
                <option value={250} className="bg-[#121620]">Медленно</option>
                <option value={90} className="bg-[#121620]">Нормально</option>
                <option value={20} className="bg-[#121620]">Быстро</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-[#121620] px-3 py-1.5 rounded-xl border border-white/10 font-mono">
              <span className="text-[#9CA3AF] font-sans">Время анимации:</span>
              <span className="text-[#06B6D4] font-bold">
                {formatElapsedTime(elapsedAnimMs)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Сетка синхронных визуализаторов (2–4 карточки) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {results.map((res) => {
          const info = getAlgorithmById(res.algorithmId);
          const totalAlgSteps = Math.max(1, res.steps.length - 1);
          const localStepIdx = Math.min(tickIndex, totalAlgSteps);
          const step = res.steps[localStepIdx];
          const isFinished = localStepIdx >= totalAlgSteps && tickIndex > 0;
          const maxVal = Math.max(...step.array, 1);
          const minVal = Math.min(...step.array, 0);
          const currentAlgComputeMs =
            isFinished || tickIndex === 0
              ? res.computeTimeMs
              : res.computeTimeMs * (localStepIdx / totalAlgSteps);

          const activeCardBanner =
            step.swappingIndices.length >= 2
              ? `Обмен: [${step.swappingIndices[0]}]=${step.array[step.swappingIndices[0]]} ⇄ [${step.swappingIndices[1]}]=${step.array[step.swappingIndices[1]]}`
              : step.comparingIndices.length >= 2
              ? `Сравнение: [${step.comparingIndices[0]}]=${step.array[step.comparingIndices[0]]} ? [${step.comparingIndices[1]}]=${step.array[step.comparingIndices[1]]}`
              : step.pivotIndex !== null
              ? `Pivot: [${step.pivotIndex}] = ${step.array[step.pivotIndex]}`
              : step.currentIndex !== null
              ? `Активный: [${step.currentIndex}] = ${step.array[step.currentIndex]}`
              : isFinished
              ? `Отсортирован (${step.array.length} эл.)`
              : `Ожидание старта ([0] = ${step.array[0]})`;

          return (
            <div
              key={res.algorithmId}
              className={`bg-[#171D29] border rounded-2xl p-4 sm:p-5 space-y-3 transition-colors ${
                isFinished ? 'border-[#22C55E]/60' : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: ALG_COLORS[res.algorithmId] }}
                    />
                    <h3 className="text-base font-bold text-[#F3F4F6]">
                      {info.nameEn}
                    </h3>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#121620] text-[#06B6D4]">
                      {info.averageComplexity}
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] mt-0.5">{info.nameRu}</p>
                </div>

                {isFinished ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#22C55E]/15 border border-[#22C55E]/40 text-xs font-bold text-[#22C55E]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Завершён ({totalAlgSteps} ш.)
                  </span>
                ) : (
                  <span className="text-xs font-mono text-[#9CA3AF]">
                    Шаг {localStepIdx} / {totalAlgSteps}
                  </span>
                )}
              </div>

              {/* Постоянная полоска выбранного элемента для алгоритма */}
              <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-[#121620] border border-white/10 text-xs font-mono min-h-[32px]">
                <span className="text-[#F3F4F6] truncate">{activeCardBanner}</span>
                <span className="text-[#9CA3AF] shrink-0 ml-2">{step.phase}</span>
              </div>

              {/* Холст столбцов */}
              <div className="h-44 bg-[#0B0D12] rounded-xl border border-white/5 p-3 flex items-end justify-center gap-1">
                {step.array.map((val, idx) => {
                  const norm =
                    maxVal === minVal ? 0.7 : (val - minVal) / (maxVal - minVal);
                  const heightPct = Math.round(14 + norm * 82);
                  const isCmp = step.comparingIndices.includes(idx);
                  const isSwp = step.swappingIndices.includes(idx);
                  const isPvt = step.pivotIndex === idx;
                  const isSrt = step.sortedIndices.includes(idx) || isFinished;

                  let bgClass = 'bg-[#8B5CF6]';
                  if (isSrt) bgClass = 'bg-[#22C55E]';
                  else if (isSwp) bgClass = 'bg-[#06B6D4]';
                  else if (isPvt) bgClass = 'bg-[#F97316]';
                  else if (isCmp) bgClass = 'bg-[#F59E0B]';

                  return (
                    <div
                      key={idx}
                      style={{ height: `${heightPct}%` }}
                      className={`flex-1 min-w-[3px] rounded-t-sm transition-[height] duration-75 ${bgClass}`}
                      title={`[${idx}] = ${val}`}
                    />
                  );
                })}
              </div>

              {/* Индивидуальные счётчики операций */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-[#121620] border border-white/5">
                  <div className="text-[10px] text-[#9CA3AF]">Сравнения</div>
                  <div className="font-mono font-bold text-[#F59E0B]">
                    {step.stats.comparisons}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-[#121620] border border-white/5">
                  <div className="text-[10px] text-[#9CA3AF]">Обмены</div>
                  <div className="font-mono font-bold text-[#06B6D4]">
                    {step.stats.swaps}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-[#121620] border border-white/5">
                  <div className="text-[10px] text-[#9CA3AF]">Перемещения</div>
                  <div className="font-mono font-bold text-[#8B5CF6]">
                    {step.stats.moves}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-[#121620] border border-white/5">
                  <div className="text-[10px] text-[#9CA3AF]">Вычисление</div>
                  <div
                    className="font-mono font-bold text-[#22C55E] truncate"
                    title={`Итоговое время: ${formatComputeTime(res.computeTimeMs)}`}
                  >
                    {formatComputeTime(currentAlgComputeMs)}
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#9CA3AF] truncate">{step.description}</p>
            </div>
          );
        })}
      </div>

      {/* Графики сравнения 1, 2 и 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1. Количество сравнений */}
        <div className="bg-[#171D29] border border-white/10 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#F3F4F6] flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#F59E0B]" />
            <span>1. Количество сравнений</span>
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121620',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="Сравнения" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Количество перемещений и обменов */}
        <div className="bg-[#171D29] border border-white/10 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#F3F4F6] flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#06B6D4]" />
            <span>2. Количество перемещений и обменов</span>
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#121620',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Перемещения" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Обмены" fill="#06B6D4" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Время вычисления */}
        <div className="bg-[#171D29] border border-white/10 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-[#F3F4F6] flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#22C55E]" />
            <span>3. Чистое время вычисления (мс)</span>
          </h3>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentChartData} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                <Tooltip
                  formatter={(value: number) => [
                    formatComputeTime(Number(value)),
                    'Время вычисления',
                  ]}
                  contentStyle={{
                    backgroundColor: '#121620',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderRadius: '10px',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="ВремяМс"
                  name="Время вычисления"
                  fill="#22C55E"
                  radius={[6, 6, 0, 0]}
                  minPointSize={8}
                >
                  <LabelList
                    dataKey="ВремяТекст"
                    position="top"
                    fill="#22C55E"
                    fontSize={10}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. График зависимости времени вычисления и числа сравнений от размера массива */}
      <div className="bg-[#171D29] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#F3F4F6] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
              <span>4. Зависимость времени вычисления и числа операций от размера массива (n = 15..300)</span>
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Реальные замеры на серии одинаковых тестовых наборов разных размеров (без задержек анимации)
            </p>
          </div>

          <button
            type="button"
            onClick={() => setSeriesSeed((s) => s + 1)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/40 text-xs font-semibold text-[#F3F4F6] self-start sm:self-auto"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Перезапустить серию измерений</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* График времени от размера массива */}
          <div className="bg-[#121620] rounded-xl border border-white/5 p-4 space-y-2">
            <div className="text-xs font-semibold text-[#F3F4F6]">
              Время вычисления (мс) в зависимости от n
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scalingSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="size" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      formatComputeTime(Number(value)),
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: '#171D29',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  {selectedIds.map((algId) => {
                    const info = getAlgorithmById(algId);
                    return (
                      <Line
                        key={algId}
                        type="monotone"
                        dataKey={`${info.nameEn} (мс)`}
                        stroke={ALG_COLORS[algId]}
                        strokeWidth={2.5}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* График числа сравнений от размера массива */}
          <div className="bg-[#121620] rounded-xl border border-white/5 p-4 space-y-2">
            <div className="text-xs font-semibold text-[#F3F4F6]">
              Количество сравнений в зависимости от n
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={scalingSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="size" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#171D29',
                      borderColor: 'rgba(255,255,255,0.15)',
                      borderRadius: '10px',
                      fontSize: '12px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  {selectedIds.map((algId) => {
                    const info = getAlgorithmById(algId);
                    return (
                      <Line
                        key={algId}
                        type="monotone"
                        dataKey={`${info.nameEn} (сравн.)`}
                        stroke={ALG_COLORS[algId]}
                        strokeWidth={2.5}
                      />
                    );
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-[#121620] border border-white/5 text-xs text-[#9CA3AF]">
          <Info className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#F3F4F6]">Методологическое примечание:</strong> фактическое время выполнения зависит от размера массива, степени его начальной упорядоченности, оптимизаций JIT-компилятора браузера и загруженности системы. В браузере точность таймера <code className="text-[#06B6D4]">performance.now()</code> ограничена долями миллисекунды, поэтому не следует делать вывод о теоретической асимптотике алгоритма только по одному запуску на малом массиве.
          </span>
        </div>
      </div>
    </div>
  );
};

