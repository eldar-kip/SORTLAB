import React from 'react';
import { PlaybackStatus, SortingStep } from '../types/visualization';
import {
  MessageSquareCode,
  CheckCircle2,
  ArrowLeftRight,
  GitCompareArrows,
  Layers,
  AlertTriangle,
} from 'lucide-react';

interface StepExplanationProps {
  step: SortingStep;
  totalSteps: number;
  status: PlaybackStatus;
  warning?: string;
}

export const StepExplanation: React.FC<StepExplanationProps> = ({
  step,
  totalSteps,
  status,
  warning,
}) => {
  const isCompleted = status === 'completed' || step.type === 'complete';
  const hasComparison = step.comparingIndices.length >= 2;
  const hasSwap = step.swappingIndices.length > 0;

  return (
    <div className="bg-[#171D29] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
        <h3 className="text-sm font-bold text-[#F3F4F6] uppercase tracking-wider flex items-center gap-2">
          <MessageSquareCode className="w-4 h-4 text-[#06B6D4]" />
          <span>Что происходит сейчас?</span>
        </h3>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded-lg bg-[#121620] border border-white/10 text-[#9CA3AF]">
            Шаг: <strong className="text-[#F3F4F6]">{step.stepNumber}</strong> / {totalSteps}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">
            {step.phase}
          </span>
        </div>
      </div>

      {warning && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/40 text-xs text-[#F59E0B]">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{warning}</span>
        </div>
      )}

      {/* Основной блок динамического объяснения (фиксированная структура без скачков высоты) */}
      <div
        className={`p-4 rounded-xl border transition-colors min-h-[112px] flex flex-col justify-between ${
          isCompleted
            ? 'bg-[#22C55E]/10 border-[#22C55E]/40'
            : hasSwap
            ? 'bg-[#06B6D4]/10 border-[#06B6D4]/40'
            : hasComparison
            ? 'bg-[#F59E0B]/10 border-[#F59E0B]/40'
            : 'bg-[#121620] border-white/10'
        }`}
      >
        <div className="flex items-start gap-3">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-[#22C55E] shrink-0 mt-0.5" />
          ) : hasSwap ? (
            <ArrowLeftRight className="w-5 h-5 text-[#06B6D4] shrink-0 mt-0.5" />
          ) : hasComparison ? (
            <GitCompareArrows className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
          ) : (
            <Layers className="w-5 h-5 text-[#8B5CF6] shrink-0 mt-0.5" />
          )}

          <div className="space-y-1.5 flex-1">
            <div className="text-sm font-bold text-[#F3F4F6]">
              {isCompleted
                ? 'Сортировка завершена. Все элементы расположены в правильном порядке.'
                : step.title}
            </div>
            <p className="text-xs sm:text-sm text-[#F3F4F6]/90 leading-relaxed">
              {step.description}
            </p>
            <div className="pt-1.5 mt-1.5 border-t border-white/10 text-xs text-[#06B6D4] font-medium">
              {step.reason ? (
                <>Причина решения: {step.reason}</>
              ) : isCompleted ? (
                <>Итог: все элементы массива стоят в заданном порядке.</>
              ) : step.stepNumber === 0 ? (
                <>Ожидание: выберите скорость и нажмите «Запустить» или «Следующий шаг».</>
              ) : (
                <>Действие: плановый переход к следующему шагу этапа «{step.phase}».</>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Детализация текущего события: индексы, значения, выполненные операции */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-2.5 rounded-xl bg-[#121620] border border-white/5">
          <div className="text-[11px] text-[#9CA3AF]">Сравниваемые индексы</div>
          <div className="font-mono font-bold text-[#F59E0B] mt-0.5 truncate">
            {step.comparingIndices.length > 0
              ? step.comparingIndices.map((idx) => `[${idx}]`).join(' и ')
              : '—'}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#121620] border border-white/5">
          <div className="text-[11px] text-[#9CA3AF]">Сравниваемые значения</div>
          <div className="font-mono font-bold text-[#F3F4F6] mt-0.5 truncate">
            {step.comparingIndices.length > 0
              ? step.comparingIndices.map((idx) => step.array[idx]).join(' vs ')
              : step.swappingIndices.length > 0
              ? step.swappingIndices.map((idx) => step.array[idx]).join(' ↔ ')
              : '—'}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#121620] border border-white/5">
          <div className="text-[11px] text-[#9CA3AF]">Активный / Опорный</div>
          <div className="font-mono font-bold text-[#06B6D4] mt-0.5 truncate">
            {step.pivotIndex !== null
              ? `Pivot [${step.pivotIndex}] = ${step.array[step.pivotIndex]}`
              : step.minMaxIndex !== null
              ? `Экстремум [${step.minMaxIndex}] = ${step.array[step.minMaxIndex]}`
              : step.currentIndex !== null
              ? `[${step.currentIndex}] = ${step.array[step.currentIndex]}`
              : '—'}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-[#121620] border border-white/5">
          <div className="text-[11px] text-[#9CA3AF]">Выполнено операций</div>
          <div className="font-mono font-bold text-[#22C55E] mt-0.5 truncate">
            {step.stats.comparisons} ср. / {step.stats.swaps} обм. / {step.stats.moves} зап.
          </div>
        </div>
      </div>
    </div>
  );
};
