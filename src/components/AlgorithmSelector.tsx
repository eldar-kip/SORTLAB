import React from 'react';
import { AlgorithmId, QuickPivotStrategy } from '../types/algorithm';
import { ALGORITHMS_DATA, getAlgorithmById } from '../data/algorithms';
import { Info, CheckCircle2, Sparkles, Crosshair } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AlgorithmSelectorProps {
  selectedId: AlgorithmId;
  onSelect: (id: AlgorithmId) => void;
  pivotStrategy?: QuickPivotStrategy;
  onPivotStrategyChange?: (strategy: QuickPivotStrategy) => void;
}

const PIVOT_OPTIONS: {
  id: QuickPivotStrategy;
  title: string;
  formula: string;
  desc: string;
}[] = [
  {
    id: 'middle',
    title: 'Средний элемент',
    formula: 'arr[⌊(low + high) / 2⌋]',
    desc: 'Защищает от деградации O(n²) на уже отсортированных массивах.',
  },
  {
    id: 'median3',
    title: 'Медиана из трёх',
    formula: 'median(arr[low], arr[mid], arr[high])',
    desc: 'Выбирает средний по значению из первого, центрального и последнего элементов.',
  },
  {
    id: 'last',
    title: 'Последний элемент',
    formula: 'arr[high]',
    desc: 'Классическая схема Ломуто. Позволяет увидеть худший случай O(n²) на упорядоченном массиве.',
  },
  {
    id: 'first',
    title: 'Первый элемент',
    formula: 'arr[low]',
    desc: 'Берёт левую границу подмассива. Также деградирует до O(n²) на отсортированных данных.',
  },
];

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({
  selectedId,
  onSelect,
  pivotStrategy = 'middle',
  onPivotStrategyChange,
}) => {
  const currentAlg = getAlgorithmById(selectedId);

  return (
    <div className="bg-[#171D29] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
            <span>Выбор алгоритма сортировки</span>
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Выберите один из 8 алгоритмов для исследования в лаборатории
          </p>
        </div>
        <Link
          to={`/algorithms/${currentAlg.id}`}
          className="text-xs font-medium text-[#06B6D4] hover:underline inline-flex items-center gap-1"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Подробный разбор {currentAlg.nameEn} →</span>
        </Link>
      </div>

      {/* Кнопки выбора алгоритма */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {ALGORITHMS_DATA.map((alg) => {
          const isSelected = alg.id === selectedId;
          return (
            <button
              key={alg.id}
              type="button"
              onClick={() => onSelect(alg.id)}
              className={`px-3 py-2.5 rounded-xl text-left transition-all duration-150 border flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6] shadow-glow-purple'
                  : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-white/25'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-[#F3F4F6] truncate">
                  {alg.nameEn}
                </span>
                {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />}
              </div>
              <span className="text-[11px] text-[#9CA3AF] leading-tight mt-1 line-clamp-1">
                {alg.nameRu}
              </span>
              <span className="mt-1.5 inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/30 text-[#06B6D4] w-fit">
                {alg.averageComplexity.split(' ')[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Краткое описание принципа работы выбранного алгоритма */}
      <div className="p-3.5 rounded-xl bg-[#121620] border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-bold text-[#F3F4F6]">
              {currentAlg.fullName}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                currentAlg.stable
                  ? 'bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30'
                  : 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
              }`}
            >
              {currentAlg.stable ? 'Устойчивый' : 'Неустойчивый'}
            </span>
            <span
              className={`text-[11px] px-2 py-0.5 rounded-md font-medium ${
                currentAlg.inPlace
                  ? 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30'
                  : 'bg-[#8B5CF6]/15 text-[#8B5CF6] border border-[#8B5CF6]/30'
              }`}
            >
              {currentAlg.inPlace ? 'На месте (In-place)' : `Память ${currentAlg.spaceComplexity}`}
            </span>
          </div>
          <p className="text-xs text-[#9CA3AF] leading-relaxed">
            {currentAlg.shortDescription}
          </p>
          {currentAlg.pivotOrGapStrategy && (
            <p className="text-[11px] text-[#06B6D4] pt-0.5">
              {currentAlg.pivotOrGapStrategy}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0 font-mono text-xs bg-[#171D29] px-3 py-2 rounded-lg border border-white/5">
          <div>
            <div className="text-[10px] text-[#9CA3AF]">Лучший</div>
            <div className="text-[#22C55E] font-bold">{currentAlg.bestComplexity}</div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <div className="text-[10px] text-[#9CA3AF]">Средний</div>
            <div className="text-[#F59E0B] font-bold">{currentAlg.averageComplexity.split(' ')[0]}</div>
          </div>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <div className="text-[10px] text-[#9CA3AF]">Худший</div>
            <div className="text-[#EF4444] font-bold">{currentAlg.worstComplexity.split(' ')[0]}</div>
          </div>
        </div>
      </div>

      {/* Интерактивный выбор стратегии опорного элемента (Pivot) для Quick Sort */}
      {selectedId === 'quick' && onPivotStrategyChange && (
        <div className="p-3.5 rounded-xl bg-[#121620] border border-[#F97316]/40 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-[#F3F4F6] flex items-center gap-1.5">
              <Crosshair className="w-4 h-4 text-[#F97316]" />
              <span>Стратегия выбора опорного элемента (Pivot) для Quick Sort:</span>
            </span>
            <span className="text-[11px] font-mono text-[#F97316]">
              Активна: {PIVOT_OPTIONS.find((o) => o.id === pivotStrategy)?.formula}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PIVOT_OPTIONS.map((opt) => {
              const isSelected = pivotStrategy === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onPivotStrategyChange(opt.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#F97316]/20 border-[#F97316] text-[#F3F4F6]'
                      : 'bg-[#171D29] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-white/25'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-[#F3F4F6]">
                      {opt.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#06B6D4]">
                      {opt.formula.split('(')[0]}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mt-1 leading-snug">
                    {opt.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
