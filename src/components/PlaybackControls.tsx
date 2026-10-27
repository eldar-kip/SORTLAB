import React from 'react';
import { PlaybackStatus } from '../types/visualization';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Shuffle,
  PlayCircle,
} from 'lucide-react';

interface PlaybackControlsProps {
  status: PlaybackStatus;
  currentStepIndex: number;
  totalSteps: number;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onReset: () => void;
  onShuffle: () => void;
  onJumpToStep: (idx: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  status,
  currentStepIndex,
  totalSteps,
  onStart,
  onPause,
  onResume,
  onNextStep,
  onPrevStep,
  onReset,
  onShuffle,
  onJumpToStep,
}) => {
  const canStepBack = currentStepIndex > 0;
  const canStepForward = currentStepIndex < totalSteps;

  return (
    <div className="bg-[#171D29] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Полоса прогресса шагов */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#9CA3AF] font-medium">
            Шкала выполнения алгоритма
          </span>
          <span className="font-mono text-[#F3F4F6]">
            Шаг <strong className="text-[#8B5CF6]">{currentStepIndex}</strong> из{' '}
            <strong>{totalSteps}</strong>
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={Math.max(1, totalSteps)}
          value={currentStepIndex}
          onChange={(e) => onJumpToStep(Number(e.target.value))}
          className="w-full h-2 bg-[#121620] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
          aria-label="Перемотка шагов алгоритма"
        />
      </div>

      {/* Все 7 обязательных кнопок управления сортировкой */}
      <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Запустить */}
          <button
            type="button"
            onClick={onStart}
            disabled={status === 'running'}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] disabled:opacity-40 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold shadow-glow-purple transition-all active:scale-95"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Запустить</span>
          </button>

          {/* Пауза */}
          <button
            type="button"
            onClick={onPause}
            disabled={status !== 'running'}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 border border-[#F59E0B]/40 disabled:opacity-40 disabled:pointer-events-none text-[#F59E0B] text-xs sm:text-sm font-semibold transition-all"
          >
            <Pause className="w-4 h-4" />
            <span>Пауза</span>
          </button>

          {/* Продолжить */}
          <button
            type="button"
            onClick={onResume}
            disabled={status !== 'paused' || !canStepForward}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#22C55E]/20 hover:bg-[#22C55E]/30 border border-[#22C55E]/40 disabled:opacity-40 disabled:pointer-events-none text-[#22C55E] text-xs sm:text-sm font-semibold transition-all"
          >
            <PlayCircle className="w-4 h-4" />
            <span>Продолжить</span>
          </button>
        </div>

        {/* Пошаговые кнопки */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onPrevStep}
            disabled={!canStepBack}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#121620] hover:bg-white/10 border border-white/15 disabled:opacity-40 disabled:pointer-events-none text-[#F3F4F6] text-xs sm:text-sm font-medium transition-all"
            title="Вернуться к предыдущему событию"
          >
            <SkipBack className="w-4 h-4 text-[#06B6D4]" />
            <span>Предыдущий шаг</span>
          </button>

          <button
            type="button"
            onClick={onNextStep}
            disabled={!canStepForward}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#121620] hover:bg-white/10 border border-white/15 disabled:opacity-40 disabled:pointer-events-none text-[#F3F4F6] text-xs sm:text-sm font-medium transition-all"
            title="Выполнить ровно одно событие алгоритма"
          >
            <span>Следующий шаг</span>
            <SkipForward className="w-4 h-4 text-[#06B6D4]" />
          </button>
        </div>

        {/* Сбросить и Перемешать */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#121620] hover:bg-white/10 border border-white/15 text-[#9CA3AF] hover:text-[#F3F4F6] text-xs sm:text-sm font-medium transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Сбросить</span>
          </button>

          <button
            type="button"
            onClick={onShuffle}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#121620] hover:bg-white/10 border border-white/15 text-[#9CA3AF] hover:text-[#F3F4F6] text-xs sm:text-sm font-medium transition-all"
          >
            <Shuffle className="w-4 h-4 text-[#8B5CF6]" />
            <span>Перемешать</span>
          </button>
        </div>
      </div>
    </div>
  );
};

