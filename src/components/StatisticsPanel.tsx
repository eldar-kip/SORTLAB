import React from 'react';
import { AlgorithmId } from '../types/algorithm';
import { PlaybackStatus, SortingStep } from '../types/visualization';
import {
  GitCompareArrows,
  ArrowLeftRight,
  MoveRight,
  Timer,
  Footprints,
  Ruler,
  Activity,
  Clock,
} from 'lucide-react';

interface StatisticsPanelProps {
  step: SortingStep;
  totalSteps: number;
  arrayLength: number;
  status: PlaybackStatus;
  computeTimeMs: number;
  animationElapsedMs: number;
  algorithmId: AlgorithmId;
}

const STATUS_CONFIG: Record<
  PlaybackStatus,
  { label: string; colorClass: string; dotClass: string }
> = {
  idle: {
    label: 'Ожидание',
    colorClass: 'text-[#9CA3AF] bg-white/5 border-white/10',
    dotClass: 'bg-[#9CA3AF]',
  },
  running: {
    label: 'Выполнение',
    colorClass: 'text-[#06B6D4] bg-[#06B6D4]/15 border-[#06B6D4]/40',
    dotClass: 'bg-[#06B6D4] animate-ping',
  },
  paused: {
    label: 'Пауза',
    colorClass: 'text-[#F59E0B] bg-[#F59E0B]/15 border-[#F59E0B]/40',
    dotClass: 'bg-[#F59E0B]',
  },
  completed: {
    label: 'Завершение',
    colorClass: 'text-[#22C55E] bg-[#22C55E]/15 border-[#22C55E]/40',
    dotClass: 'bg-[#22C55E]',
  },
};

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  step,
  totalSteps,
  arrayLength,
  status,
  computeTimeMs,
  animationElapsedMs,
  algorithmId,
}) => {
  const statusInfo = STATUS_CONFIG[status];

  const getMetricNote = () => {
    if (algorithmId === 'counting') {
      return 'Примечание: Counting Sort — несравнительный алгоритм (0 попарных сравнений и 0 прямых обменов); операции учитываются в показателе «Перемещения / Записи» (инкремент частот и запись в массив).';
    }
    if (algorithmId === 'merge') {
      return 'Примечание: В Merge Sort элементы не меняются местами напрямую (обмены = 0), а последовательно записываются из сливаемых половин («Перемещения / Записи»).';
    }
    return 'Примечание: «Время вычисления» показывает чистое процессорное время работы алгоритма в мс, а «Длительность анимации» — время визуального воспроизведения.';
  };

  return (
    <div className="bg-[#171D29] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-[#8B5CF6]" />
          <span>Статистика в реальном времени</span>
        </h3>

        <div
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.colorClass}`}
        >
          <span className={`w-2 h-2 rounded-full ${statusInfo.dotClass}`} />
          <span>Состояние: {statusInfo.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {/* Сравнения */}
        <div className="p-3 rounded-xl bg-[#121620] border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
            <GitCompareArrows className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Сравнения</span>
          </div>
          <div className="text-lg font-mono font-bold text-[#F3F4F6] mt-1">
            {step.stats.comparisons}
          </div>
        </div>

        {/* Обмены */}
        <div className="p-3 rounded-xl bg-[#121620] border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Обмены</span>
          </div>
          <div className="text-lg font-mono font-bold text-[#F3F4F6] mt-1">
            {step.stats.swaps}
          </div>
        </div>

        {/* Перемещения / Записи */}
        <div className="p-3 rounded-xl bg-[#121620] border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
            <MoveRight className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Перемещения</span>
          </div>
          <div className="text-lg font-mono font-bold text-[#F3F4F6] mt-1">
            {step.stats.moves}
          </div>
        </div>

        {/* Чистое время вычисления */}
        <div className="p-3 rounded-xl bg-[#121620] border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
            <Timer className="w-3.5 h-3.5 text-[#22C55E]" />
            <span>Вычисление</span>
          </div>
          <div className="text-lg font-mono font-bold text-[#22C55E] mt-1">
            {computeTimeMs.toFixed(2)} <span className="text-xs font-normal">мс</span>
          </div>
        </div>

        {/* Длительность анимации */}
        <div className="p-3 rounded-xl bg-[#121620] border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
            <Clock className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Анимация</span>
          </div>
          <div className="text-lg font-mono font-bold text-[#F3F4F6] mt-1">
            {(animationElapsedMs / 1000).toFixed(1)}{' '}
            <span className="text-xs font-normal text-[#9CA3AF]">с</span>
          </div>
        </div>

        {/* Шаги */}
        <div className="p-3 rounded-xl bg-[#121620] border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
            <Footprints className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Шаги</span>
          </div>
          <div className="text-lg font-mono font-bold text-[#F3F4F6] mt-1">
            {step.stepNumber}{' '}
            <span className="text-xs font-normal text-[#9CA3AF]">/ {totalSteps}</span>
          </div>
        </div>

        {/* Длина массива */}
        <div className="p-3 rounded-xl bg-[#121620] border border-white/10">
          <div className="flex items-center gap-1.5 text-xs text-[#9CA3AF]">
            <Ruler className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Длина (n)</span>
          </div>
          <div className="text-lg font-mono font-bold text-[#F3F4F6] mt-1">
            {arrayLength}
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#9CA3AF] leading-relaxed">{getMetricNote()}</p>
    </div>
  );
};

