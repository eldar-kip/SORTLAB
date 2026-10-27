import React, { useState } from 'react';
import { ArrayPresetType, SortOrder } from '../types/algorithm';
import { parseCustomArrayInput } from '../utils/arrayGenerator';
import {
  Dices,
  TrendingUp,
  TrendingDown,
  Copy,
  Edit3,
  Gauge,
  Sliders,
  ArrowUpNarrowWide,
  ArrowDownWideNarrow,
  AlertCircle,
  Check,
} from 'lucide-react';

interface ArrayControlsProps {
  arraySize: number;
  onSizeChange: (size: number) => void;
  speedMs: number;
  onSpeedChange: (speedMs: number) => void;
  order: SortOrder;
  onOrderChange: (order: SortOrder) => void;
  preset: ArrayPresetType;
  onGeneratePreset: (preset: ArrayPresetType) => void;
  onApplyCustomArray: (custom: number[]) => void;
  currentArray: number[];
}

export const ArrayControls: React.FC<ArrayControlsProps> = ({
  arraySize,
  onSizeChange,
  speedMs,
  onSpeedChange,
  order,
  onOrderChange,
  preset,
  onGeneratePreset,
  onApplyCustomArray,
  currentArray,
}) => {
  const [customInput, setCustomInput] = useState<string>('42, 15, 73, 8, 29, 61, 4, 35');
  const [inputError, setInputError] = useState<string | null>(null);
  const [inputSuccess, setInputSuccess] = useState<boolean>(false);
  const [showCustomForm, setShowCustomForm] = useState<boolean>(false);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = parseCustomArrayInput(customInput);
    if (!validation.valid) {
      setInputError(validation.error || 'Ошибка ввода массива.');
      setInputSuccess(false);
      return;
    }
    setInputError(null);
    setInputSuccess(true);
    onApplyCustomArray(validation.array);
    setTimeout(() => setInputSuccess(false), 2500);
  };

  // Режимы скорости: Медленно (550 мс), Нормально (180 мс), Быстро (35 мс)
  const speedMode =
    speedMs >= 400 ? 'slow' : speedMs >= 100 ? 'normal' : 'fast';

  return (
    <div className="bg-[#171D29] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-5">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* 7.2 Генерация массива */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#F3F4F6] flex items-center gap-1.5">
              <Dices className="w-4 h-4 text-[#8B5CF6]" />
              <span>Генерация массива</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setShowCustomForm((prev) => !prev);
                setInputError(null);
              }}
              className={`text-xs font-medium inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                showCustomForm || preset === 'custom'
                  ? 'bg-[#06B6D4]/20 border-[#06B6D4] text-[#06B6D4]'
                  : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Ввести свой массив</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onGeneratePreset('random')}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                preset === 'random'
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6]'
                  : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-white/20'
              }`}
            >
              <Dices className="w-4 h-4 text-[#8B5CF6] shrink-0" />
              <span>Сгенерировать массив</span>
            </button>

            <button
              type="button"
              onClick={() => onGeneratePreset('nearly-sorted')}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                preset === 'nearly-sorted'
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6]'
                  : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-white/20'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-[#22C55E] shrink-0" />
              <span>Почти отсортированный</span>
            </button>

            <button
              type="button"
              onClick={() => onGeneratePreset('reversed')}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                preset === 'reversed'
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6]'
                  : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-white/20'
              }`}
            >
              <TrendingDown className="w-4 h-4 text-[#EF4444] shrink-0" />
              <span>Обратный порядок</span>
            </button>

            <button
              type="button"
              onClick={() => onGeneratePreset('duplicates')}
              className={`px-3 py-2 rounded-xl text-xs font-medium border flex items-center gap-2 transition-all ${
                preset === 'duplicates'
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6]'
                  : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-white/20'
              }`}
            >
              <Copy className="w-4 h-4 text-[#F59E0B] shrink-0" />
              <span>Почти одинаковые</span>
            </button>
          </div>
        </div>

        {/* 7.3 Настройка размера массива и 7.5 Порядок сортировки */}
        <div className="lg:col-span-4 space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label
                htmlFor="array-size-slider"
                className="font-bold uppercase tracking-wider text-[#F3F4F6] flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Количество элементов</span>
              </label>
              <span className="px-2 py-0.5 rounded bg-[#121620] border border-white/10 font-mono font-bold text-[#06B6D4]">
                {arraySize}
              </span>
            </div>
            <input
              id="array-size-slider"
              type="range"
              min={5}
              max={100}
              value={arraySize}
              onChange={(e) => onSizeChange(Number(e.target.value))}
              className="w-full h-2 bg-[#121620] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#9CA3AF]">
              <span>5 эл.</span>
              <span>25</span>
              <span>50</span>
              <span>75</span>
              <span>100 эл.</span>
            </div>
          </div>

          {/* 7.5 Направление сортировки */}
          <div className="pt-1 flex items-center justify-between gap-2">
            <span className="text-xs font-semibold text-[#9CA3AF]">Порядок:</span>
            <div className="grid grid-cols-2 gap-1.5 flex-1">
              <button
                type="button"
                onClick={() => onOrderChange('asc')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border inline-flex items-center justify-center gap-1.5 transition-all ${
                  order === 'asc'
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6]'
                    : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <ArrowUpNarrowWide className="w-3.5 h-3.5 text-[#22C55E]" />
                <span>По возрастанию</span>
              </button>
              <button
                type="button"
                onClick={() => onOrderChange('desc')}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border inline-flex items-center justify-center gap-1.5 transition-all ${
                  order === 'desc'
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6]'
                    : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
                }`}
              >
                <ArrowDownWideNarrow className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>По убыванию</span>
              </button>
            </div>
          </div>
        </div>

        {/* 7.4 Настройка скорости анимации */}
        <div className="lg:col-span-3 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor="speed-slider"
              className="font-bold uppercase tracking-wider text-[#F3F4F6] flex items-center gap-1.5"
            >
              <Gauge className="w-4 h-4 text-[#22C55E]" />
              <span>Скорость анимации</span>
            </label>
            <span className="px-2 py-0.5 rounded bg-[#121620] border border-white/10 font-mono text-[11px] text-[#22C55E]">
              {speedMs} мс/шаг
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => onSpeedChange(550)}
              className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                speedMode === 'slow'
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6]'
                  : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              Медленно
            </button>
            <button
              type="button"
              onClick={() => onSpeedChange(180)}
              className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                speedMode === 'normal'
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6]'
                  : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              Нормально
            </button>
            <button
              type="button"
              onClick={() => onSpeedChange(30)}
              className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                speedMode === 'fast'
                  ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6]'
                  : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              Быстро
            </button>
          </div>

          {/* Пользовательский слайдер задержки (инвертирован для интуитивности: вправо = быстрее) */}
          <div className="space-y-1">
            <input
              id="speed-slider"
              type="range"
              min={10}
              max={1000}
              step={10}
              value={1010 - Math.min(1000, speedMs)}
              onChange={(e) => onSpeedChange(1010 - Number(e.target.value))}
              className="w-full h-2 bg-[#121620] rounded-lg appearance-none cursor-pointer accent-[#06B6D4]"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF]">
              <span>1000 мс (детально)</span>
              <span>10 мс (турбо)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Раскрывающаяся панель пользовательского ввода массива */}
      {showCustomForm && (
        <form
          onSubmit={handleCustomSubmit}
          className="pt-3 border-t border-white/10 space-y-2.5"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-[#F3F4F6] font-medium">
              Введите числа через запятую или пробел (от 2 до 100 целых чисел в диапазоне [-999..999]):
            </span>
            <button
              type="button"
              onClick={() => setCustomInput(currentArray.join(', '))}
              className="text-[#06B6D4] hover:underline self-start sm:self-auto"
            >
              Заполнить текущим массивом
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                setInputError(null);
              }}
              placeholder="Например: 42, 15, 73, 8, 29, 61, 4, 35"
              className="flex-1 px-3.5 py-2 rounded-xl bg-[#121620] border border-white/15 text-sm font-mono text-[#F3F4F6] placeholder-[#9CA3AF]/50 focus:outline-none focus:border-[#8B5CF6]"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold transition-colors shrink-0 inline-flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Применить массив</span>
            </button>
          </div>

          {inputError && (
            <div className="flex items-center gap-2 text-xs text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/30 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{inputError}</span>
            </div>
          )}

          {inputSuccess && (
            <div className="flex items-center gap-2 text-xs text-[#22C55E] bg-[#22C55E]/10 border border-[#22C55E]/30 px-3 py-2 rounded-lg">
              <Check className="w-4 h-4 shrink-0" />
              <span>Пользовательский массив успешно применён к визуализации!</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

