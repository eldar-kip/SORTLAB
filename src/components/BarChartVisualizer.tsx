import React, { useState, useMemo } from 'react';
import { AlgorithmId } from '../types/algorithm';
import { PlaybackStatus, SortingStep } from '../types/visualization';
import { formatComputeTime, formatElapsedTime } from '../utils/complexity';
import { GitBranch, Layers, Hash, Eye, Crosshair, Timer, Clock } from 'lucide-react';

interface BarChartVisualizerProps {
  step: SortingStep;
  algorithmId: AlgorithmId;
  status: PlaybackStatus;
  computeTimeMs?: number;
  animationElapsedMs?: number;
  compact?: boolean;
  heightClass?: string;
}

export const BarChartVisualizer: React.FC<BarChartVisualizerProps> = ({
  step,
  algorithmId,
  status,
  computeTimeMs = 0,
  animationElapsedMs = 0,
  compact = false,
  heightClass = 'h-[340px] sm:h-[390px]',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showIndices, setShowIndices] = useState<boolean>(true);
  const [showHeapTree, setShowHeapTree] = useState<boolean>(true);

  const {
    array,
    comparingIndices,
    swappingIndices,
    pivotIndex,
    minMaxIndex,
    currentIndex,
    mergeRange,
    partitionRange,
    sortedIndices,
    shellGap,
    shellGroupIndices,
    heapSize,
    countArray,
    recursionDepth,
  } = step;

  // Используем Set для O(1) проверки состояний без просадок FPS в промежуточных шагах
  const comparingSet = useMemo(() => new Set(comparingIndices), [comparingIndices]);
  const swappingSet = useMemo(() => new Set(swappingIndices), [swappingIndices]);
  const sortedSet = useMemo(() => new Set(sortedIndices), [sortedIndices]);
  const shellGroupSet = useMemo(() => new Set(shellGroupIndices), [shellGroupIndices]);

  const n = array.length;
  const minVal = n > 0 ? Math.min(...array) : 0;
  const maxVal = n > 0 ? Math.max(...array) : 100;

  // Вычисляем пропорциональную высоту каждого столбца (от 12% до 94%) с поддержкой отрицательных чисел
  const getBarHeightPercent = (val: number): number => {
    if (maxVal === minVal) return 65;
    const normalized = (val - minVal) / (maxVal - minVal);
    return Math.round(12 + normalized * 82);
  };

  // Определение цвета и текстовой метки состояния для элемента с индексом idx
  const getBarStyle = (idx: number) => {
    const isCompleted = status === 'completed' || step.type === 'complete';
    const isSwapping = swappingSet.has(idx);
    const isComparing = comparingSet.has(idx);
    const isPivot = pivotIndex === idx;
    const isMinMax = minMaxIndex === idx;
    const isCurrent = currentIndex === idx;
    const isSorted = sortedSet.has(idx);
    const isInMerge =
      mergeRange !== null && idx >= mergeRange[0] && idx <= mergeRange[2];
    const isInShellGroup = shellGroupSet.has(idx);

    if (isCompleted) {
      return {
        bg: 'bg-gradient-to-t from-[#16A34A] to-[#22C55E]',
        border: 'border-[#4ADE80]/60',
        glow: 'shadow-[0_0_10px_rgba(34,197,94,0.3)]',
        badge: '✓',
        stateLabel: 'Отсортирован',
      };
    }

    if (isSwapping) {
      return {
        bg: 'bg-gradient-to-t from-[#0891B2] to-[#06B6D4]',
        border: 'border-[#67E8F9]',
        glow: 'shadow-[0_0_12px_rgba(6,182,212,0.5)]',
        badge: '⇄',
        stateLabel: 'Обмен / Запись',
      };
    }

    if (isPivot) {
      return {
        bg: 'bg-gradient-to-t from-[#EA580C] to-[#F97316]',
        border: 'border-[#FDBA74]',
        glow: 'shadow-[0_0_12px_rgba(249,115,22,0.5)]',
        badge: 'P',
        stateLabel: 'Опорный (Pivot)',
      };
    }

    if (isComparing) {
      return {
        bg: 'bg-gradient-to-t from-[#D97706] to-[#F59E0B]',
        border: 'border-[#FDE68A]',
        glow: 'shadow-[0_0_12px_rgba(245,158,11,0.5)]',
        badge: '?',
        stateLabel: 'Сравнение',
      };
    }

    if (isMinMax) {
      return {
        bg: 'bg-gradient-to-t from-[#DB2777] to-[#EC4899]',
        border: 'border-[#F9A8D4]',
        glow: 'shadow-[0_0_12px_rgba(236,72,153,0.45)]',
        badge: '★',
        stateLabel: 'Экстремум / Корень',
      };
    }

    if (isCurrent) {
      return {
        bg: 'bg-gradient-to-t from-[#0284C7] to-[#06B6D4]',
        border: 'border-[#7DD3FC]',
        glow: 'shadow-[0_0_10px_rgba(6,182,212,0.4)]',
        badge: '•',
        stateLabel: 'Текущий элемент',
      };
    }

    if (isSorted) {
      return {
        bg: 'bg-gradient-to-t from-[#15803D] to-[#22C55E]',
        border: 'border-[#4ADE80]/50',
        glow: '',
        badge: '',
        stateLabel: 'На финальной позиции',
      };
    }

    if (isInMerge && mergeRange) {
      const isLeftHalf = idx <= mergeRange[1];
      return {
        bg: isLeftHalf
          ? 'bg-gradient-to-t from-[#2563EB] to-[#60A5FA]'
          : 'bg-gradient-to-t from-[#9333EA] to-[#C084FC]',
        border: 'border-white/30',
        glow: '',
        badge: '',
        stateLabel: isLeftHalf ? 'Левый подмассив слияния' : 'Правый подмассив слияния',
      };
    }

    if (isInShellGroup) {
      return {
        bg: 'bg-gradient-to-t from-[#6D28D9] to-[#A78BFA]',
        border: 'border-[#C4B5FD]/60',
        glow: '',
        badge: '',
        stateLabel: `Подгруппа шага gap = ${shellGap}`,
      };
    }

    return {
      bg: 'bg-gradient-to-t from-[#5B21B6] via-[#7C3AED] to-[#8B5CF6]',
      border: 'border-[#A78BFA]/25',
      glow: '',
      badge: '',
      stateLabel: 'Обычный элемент',
    };
  };

  // Информация для постоянной полоски выбранного / активного элемента алгоритма
  const activeElementBanner = useMemo(() => {
    const isCompleted = status === 'completed' || step.type === 'complete';

    if (swappingIndices.length >= 2) {
      const [i, j] = swappingIndices;
      return {
        badgeColor: 'text-[#06B6D4] border-[#06B6D4]/40 bg-[#06B6D4]/10',
        label: 'Перестановка / Обмен:',
        valueText: `[${i}] = ${array[i]}  ⇄  [${j}] = ${array[j]}`,
        extra: pivotIndex !== null ? `Опорный (Pivot): [${pivotIndex}] = ${array[pivotIndex]}` : null,
      };
    }

    if (swappingIndices.length === 1) {
      const idx = swappingIndices[0];
      return {
        badgeColor: 'text-[#06B6D4] border-[#06B6D4]/40 bg-[#06B6D4]/10',
        label: 'Запись / Сдвиг элемента:',
        valueText: `[${idx}] ← ${array[idx]}`,
        extra: currentIndex !== null && currentIndex !== idx ? `Текущий: [${currentIndex}] = ${array[currentIndex]}` : null,
      };
    }

    if (comparingIndices.length >= 2) {
      const [i, j] = comparingIndices;
      return {
        badgeColor: 'text-[#F59E0B] border-[#F59E0B]/40 bg-[#F59E0B]/10',
        label: 'Выбраны для сравнения:',
        valueText: `[${i}] = ${array[i]}  ?  [${j}] = ${array[j]}`,
        extra:
          pivotIndex !== null
            ? `Опорный (Pivot): [${pivotIndex}] = ${array[pivotIndex]}`
            : minMaxIndex !== null
            ? `Экстремум: [${minMaxIndex}] = ${array[minMaxIndex]}`
            : null,
      };
    }

    if (pivotIndex !== null && array[pivotIndex] !== undefined) {
      return {
        badgeColor: 'text-[#F97316] border-[#F97316]/40 bg-[#F97316]/10',
        label: 'Выбран опорный элемент (Pivot):',
        valueText: `[${pivotIndex}] = ${array[pivotIndex]}`,
        extra:
          partitionRange !== null
            ? `Разбиение участка [${partitionRange[0]}..${partitionRange[1]}]`
            : null,
      };
    }

    if (minMaxIndex !== null && array[minMaxIndex] !== undefined) {
      return {
        badgeColor: 'text-[#EC4899] border-[#EC4899]/40 bg-[#EC4899]/10',
        label: 'Выбран текущий экстремум:',
        valueText: `[${minMaxIndex}] = ${array[minMaxIndex]}`,
        extra: null,
      };
    }

    if (currentIndex !== null && array[currentIndex] !== undefined) {
      return {
        badgeColor: 'text-[#06B6D4] border-[#06B6D4]/40 bg-[#06B6D4]/10',
        label: 'Выбран активный элемент:',
        valueText: `[${currentIndex}] = ${array[currentIndex]}`,
        extra: null,
      };
    }

    if (isCompleted) {
      return {
        badgeColor: 'text-[#22C55E] border-[#22C55E]/40 bg-[#22C55E]/10',
        label: 'Статус массива:',
        valueText: `Отсортирован (${n} эл., от ${minVal} до ${maxVal})`,
        extra: null,
      };
    }

    if (step.stepNumber === 0) {
      return {
        badgeColor: 'text-[#8B5CF6] border-[#8B5CF6]/30 bg-[#121620]',
        label: '',
        valueText: n > 0 ? `Всего ${n} эл., диапазон ${minVal}..${maxVal}` : 'Массив пуст',
        extra: null,
      };
    }

    return {
      badgeColor: 'text-[#8B5CF6] border-[#8B5CF6]/30 bg-[#121620]',
      label: 'Выбранный элемент:',
      valueText: n > 0 ? `[0] = ${array[0]} (всего ${n} эл., диапазон ${minVal}..${maxVal})` : 'Массив пуст',
      extra: null,
    };
  }, [
    status,
    step.stepNumber,
    step.type,
    swappingIndices,
    comparingIndices,
    pivotIndex,
    minMaxIndex,
    currentIndex,
    partitionRange,
    array,
    n,
    minVal,
    maxVal,
  ]);

  const showValueLabels = !compact && n <= 36;
  const showEveryNthLabel = !compact && n > 36 && n <= 60;

  return (
    <div className="bg-[#171D29] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
      {/* Верхняя информационная строка над визуализацией (фиксированной структуры) */}
      {!compact && (
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-white/10 min-h-[38px]">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-[#121620] border border-white/10 font-mono text-[#F3F4F6]">
              Этап: <strong className="text-[#8B5CF6]">{step.phase}</strong>
            </span>

            {shellGap !== null && (
              <span className="px-2.5 py-1 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/40 font-mono text-[#F3F4F6]">
                Шаг Шелла (gap): <strong className="text-[#06B6D4]">{shellGap}</strong>
              </span>
            )}

            {mergeRange !== null && (
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-400/40 font-mono text-blue-200 inline-flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" />
                Слияние: [{mergeRange[0]}..{mergeRange[1]}] + [{mergeRange[1] + 1}..{mergeRange[2]}]
              </span>
            )}

            {partitionRange !== null && (
              <span className="px-2.5 py-1 rounded-lg bg-orange-500/15 border border-orange-400/40 font-mono text-orange-200">
                Участок: [{partitionRange[0]}..{partitionRange[1]}]
              </span>
            )}

            {recursionDepth > 0 && (
              <span className="px-2.5 py-1 rounded-lg bg-[#121620] border border-white/10 font-mono text-[#9CA3AF]">
                Глубина рекурсии: <strong className="text-[#F3F4F6]">{recursionDepth}</strong>
              </span>
            )}

            {heapSize !== null && (
              <span className="px-2.5 py-1 rounded-lg bg-pink-500/15 border border-pink-400/40 font-mono text-pink-200">
                Активная куча: {heapSize} из {n} эл.
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#22C55E]/10 border border-[#22C55E]/30 font-mono text-xs text-[#22C55E]">
              <Timer className="w-3.5 h-3.5" />
              <span>Вычисление: {formatComputeTime(computeTimeMs)}</span>
            </span>

            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/30 font-mono text-xs text-[#06B6D4]">
              <Clock className="w-3.5 h-3.5" />
              <span>Анимация: {formatElapsedTime(animationElapsedMs)}</span>
            </span>

            {algorithmId === 'heap' && n <= 31 && (
              <button
                type="button"
                onClick={() => setShowHeapTree((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                  showHeapTree
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#F3F4F6]'
                    : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5" />
                <span>Дерево кучи</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowIndices((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                showIndices
                  ? 'bg-[#121620] border-white/20 text-[#F3F4F6]'
                  : 'bg-[#121620] border-white/5 text-[#9CA3AF]'
              }`}
              title="Переключить отображение индексов массива"
            >
              <Hash className="w-3.5 h-3.5" />
              <span>Индексы</span>
            </button>
          </div>
        </div>
      )}

      {/* Постоянная полоска с выбранным / активным элементом (отображается сразу, предотвращая скачки макета и фризы) */}
      {!compact && (
        <div
          className={`flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono min-h-[38px] transition-colors ${activeElementBanner.badgeColor}`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <Crosshair className="w-3.5 h-3.5 shrink-0" />
            {activeElementBanner.label && (
              <span className="text-[#9CA3AF] font-sans font-medium">
                {activeElementBanner.label}
              </span>
            )}
            <strong className="text-[#F3F4F6]">{activeElementBanner.valueText}</strong>
            {activeElementBanner.extra && (
              <span className="px-2 py-0.5 rounded bg-black/25 text-[#F3F4F6] border border-white/10">
                {activeElementBanner.extra}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-[#9CA3AF]">
            <Eye className="w-3.5 h-3.5 text-[#06B6D4] shrink-0" />
            {hoveredIdx !== null && array[hoveredIdx] !== undefined ? (
              <span>
                Курсор: <strong className="text-[#8B5CF6]">[{hoveredIdx}]</strong> ={' '}
                <strong className="text-[#06B6D4]">{array[hoveredIdx]}</strong>{' '}
                <span className="text-[#F3F4F6]/80">({getBarStyle(hoveredIdx).stateLabel})</span>
              </span>
            ) : (
              <span className="font-sans text-[11px] text-[#9CA3AF]/80">
                Отсортировано: {sortedIndices.length} из {n} эл.
              </span>
            )}
          </div>
        </div>
      )}

      {/* Основной холст со столбцами */}
      <div
        className={`relative w-full ${heightClass} bg-[#0B0D12]/90 rounded-xl border border-white/5 px-2 sm:px-4 pt-6 pb-2 flex flex-col justify-end overflow-x-auto`}
      >
        {/* Фоновая сетка */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-6 px-4 opacity-15">
          <div className="border-b border-dashed border-white/30 w-full" />
          <div className="border-b border-dashed border-white/30 w-full" />
          <div className="border-b border-dashed border-white/30 w-full" />
          <div className="border-b border-dashed border-white/30 w-full" />
        </div>

        <div
          className="relative z-10 w-full h-full flex items-end justify-center"
          style={{
            gap: n > 65 ? '1px' : n > 35 ? '2px' : '4px',
          }}
        >
          {array.map((value, idx) => {
            const heightPct = getBarHeightPercent(value);
            const style = getBarStyle(idx);
            const isHighlighted =
              comparingSet.has(idx) ||
              swappingSet.has(idx) ||
              pivotIndex === idx ||
              minMaxIndex === idx;

            const shouldShowValue =
              showValueLabels ||
              (showEveryNthLabel && (idx % 2 === 0 || isHighlighted)) ||
              hoveredIdx === idx;

            return (
              <div
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="flex-1 min-w-[3px] h-full flex flex-col items-center justify-end group relative select-none"
              >
                {/* Постоянный слот под символ состояния сверху (без скачков высоты в промежуточных состояниях) */}
                {!compact && n <= 45 && (
                  <div className="h-4 flex items-center justify-center mb-0.5">
                    <span className="text-[10px] font-bold text-[#F3F4F6] leading-none">
                      {style.badge || '\u00A0'}
                    </span>
                  </div>
                )}

                {/* Столбец */}
                <div
                  style={{ height: `${heightPct}%` }}
                  className={`w-full rounded-t-md border-t border-x ${style.bg} ${style.border} ${style.glow} transition-[height] duration-75 ease-out group-hover:brightness-125`}
                />

                {/* Числовое значение */}
                {!compact && (
                  <div className="h-4 flex items-center justify-center mt-1">
                    {shouldShowValue ? (
                      <span
                        className={`font-mono leading-none ${
                          n > 28 ? 'text-[9px]' : 'text-[11px]'
                        } ${
                          isHighlighted
                            ? 'text-[#F3F4F6] font-bold'
                            : 'text-[#F3F4F6]/85 font-medium'
                        }`}
                      >
                        {value}
                      </span>
                    ) : (
                      <span className="text-[8px] text-transparent">.</span>
                    )}
                  </div>
                )}

                {/* Индекс элемента */}
                {!compact && showIndices && (
                  <div className="h-3.5 flex items-center justify-center">
                    {n <= 32 || idx % 5 === 0 || idx === n - 1 ? (
                      <span className="text-[9px] font-mono text-[#9CA3AF]/70 leading-none">
                        {idx}
                      </span>
                    ) : null}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Специализированная визуализация двоичной кучи для Heap Sort */}
      {!compact && algorithmId === 'heap' && showHeapTree && n <= 31 && (
        <div className="bg-[#121620] border border-white/10 rounded-xl p-3 sm:p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#F3F4F6] flex items-center gap-1.5">
              <GitBranch className="w-4 h-4 text-[#8B5CF6]" />
              Представление двоичной кучи (Binary Heap): связь индексов i → 2i+1, 2i+2
            </span>
            <span className="text-[#9CA3AF] font-mono">
              Уровней: {Math.floor(Math.log2(Math.max(1, n))) + 1}
            </span>
          </div>
          <div className="space-y-2 overflow-x-auto py-1">
            {Array.from(
              { length: Math.min(5, Math.floor(Math.log2(Math.max(1, n))) + 1) },
              (_, level) => {
                const startIdx = Math.pow(2, level) - 1;
                const count = Math.pow(2, level);
                const levelIndices: number[] = [];
                for (let k = 0; k < count && startIdx + k < n; k++) {
                  levelIndices.push(startIdx + k);
                }
                return (
                  <div key={level} className="flex items-center justify-center gap-1.5 sm:gap-3">
                    {levelIndices.map((nodeIdx) => {
                      const inActiveHeap = heapSize === null || nodeIdx < heapSize;
                      const isCmp = comparingSet.has(nodeIdx);
                      const isSwp = swappingSet.has(nodeIdx);
                      const isRoot = nodeIdx === 0;
                      return (
                        <div
                          key={nodeIdx}
                          className={`px-2 py-1 rounded-lg border text-center font-mono text-xs transition-colors ${
                            isSwp
                              ? 'bg-[#06B6D4]/25 border-[#06B6D4] text-white'
                              : isCmp
                              ? 'bg-[#F59E0B]/25 border-[#F59E0B] text-white'
                              : !inActiveHeap
                              ? 'bg-[#22C55E]/15 border-[#22C55E]/40 text-[#22C55E] opacity-60'
                              : isRoot
                              ? 'bg-pink-500/20 border-pink-400 text-pink-100'
                              : 'bg-[#171D29] border-white/15 text-[#F3F4F6]'
                          }`}
                          title={`Узел [${nodeIdx}], родитель: ${
                            nodeIdx > 0 ? Math.floor((nodeIdx - 1) / 2) : 'нет'
                          }, дети: ${2 * nodeIdx + 1 < n ? 2 * nodeIdx + 1 : '-'}, ${
                            2 * nodeIdx + 2 < n ? 2 * nodeIdx + 2 : '-'
                          }`}
                        >
                          <div className="font-bold leading-tight">{array[nodeIdx]}</div>
                          <div className="text-[9px] text-[#9CA3AF] leading-none">[{nodeIdx}]</div>
                        </div>
                      );
                    })}
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Специализированная таблица частот для Counting Sort */}
      {!compact && algorithmId === 'counting' && countArray && countArray.length > 0 && (
        <div className="bg-[#121620] border border-white/10 rounded-xl p-3 sm:p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#F3F4F6]">
              Таблица частот (массив подсчёта вхождений count)
            </span>
            <span className="text-[#9CA3AF] font-mono">
              Корзин: {countArray.length}
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {countArray.map((bucket) => (
              <div
                key={bucket.value}
                className={`min-w-[42px] px-2 py-1.5 rounded-lg border text-center font-mono transition-colors ${
                  bucket.active
                    ? 'bg-[#06B6D4]/25 border-[#06B6D4] text-white shadow-glow-cyan'
                    : bucket.count > 0
                    ? 'bg-[#8B5CF6]/15 border-[#8B5CF6]/40 text-[#F3F4F6]'
                    : 'bg-[#171D29] border-white/5 text-[#9CA3AF]/60'
                }`}
              >
                <div className="text-[10px] text-[#9CA3AF]">val:{bucket.value}</div>
                <div className="text-xs font-bold mt-0.5">×{bucket.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Легенда цветовой системы */}
      {!compact && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-xs text-[#9CA3AF]">
          <div className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#8B5CF6] inline-block" />
            <span>Обычный элемент</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#F59E0B] inline-block" />
            <span>Сравнение (?)</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#06B6D4] inline-block" />
            <span>Обмен / Перемещение (⇄)</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#F97316] inline-block" />
            <span>Опорный элемент Quick Sort (P)</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#EC4899] inline-block" />
            <span>Найденный минимум / корень (★)</span>
          </div>
          <div className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-[#22C55E] inline-block" />
            <span>Отсортированная часть (✓)</span>
          </div>
        </div>
      )}
    </div>
  );
};
