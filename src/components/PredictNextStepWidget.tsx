import React, { useState, useCallback, useEffect } from 'react';
import { AlgorithmId } from '../types/algorithm';
import { executeSortingAlgorithm } from '../algorithms';
import { ALGORITHMS_DATA, getAlgorithmById } from '../data/algorithms';
import { generateRandomArray } from '../utils/arrayGenerator';
import { SortingStep } from '../types/visualization';
import {
  BrainCircuit,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ArrowRight,
  Trophy,
} from 'lucide-react';

interface PredictQuestion {
  algorithmId: AlgorithmId;
  stopStep: SortingStep;
  nextActionStep: SortingStep;
  questionText: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const PredictNextStepWidget: React.FC = () => {
  const [selectedAlg, setSelectedAlg] = useState<AlgorithmId>('bubble');
  const [challenge, setChallenge] = useState<PredictQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({
    correct: 0,
    total: 0,
  });

  const generateChallenge = useCallback((algId: AlgorithmId) => {
    const arr = generateRandomArray(6, 5, 45);
    const result = executeSortingAlgorithm(algId, arr, 'asc');
    const steps = result.steps;

    // Ищем шаг типа 'compare' (или для Counting Sort — 'count-update'), после которого идёт действие
    const candidateIndices: number[] = [];
    for (let i = 1; i < steps.length - 1; i++) {
      if (steps[i].type === 'compare' || steps[i].type === 'count-update') {
        candidateIndices.push(i);
      }
    }

    const chosenIdx =
      candidateIndices.length > 0
        ? candidateIndices[Math.floor(Math.random() * candidateIndices.length)]
        : Math.min(1, steps.length - 2);

    const stopStep = steps[chosenIdx];
    const nextActionStep = steps[chosenIdx + 1];

    if (algId === 'counting') {
      const idx = stopStep.currentIndex ?? 0;
      const val = stopStep.array[idx];
      const nextStepIsWrite = nextActionStep.type === 'count-write';

      const options = [
        nextStepIsWrite
          ? `Алгоритм перейдёт к этапу записи упорядоченных чисел из таблицы частот`
          : `Алгоритм прочитает следующий элемент [${idx + 1}] = ${
              stopStep.array[idx + 1]
            } и увеличит его счётчик в таблице частот`,
        'Алгоритм выполнит попарный обмен первых двух элементов массива',
        'Алгоритм выберет опорный элемент (pivot) и разделит массив пополам',
        'Алгоритм завершится досрочно без записи результата',
      ];

      setChallenge({
        algorithmId: algId,
        stopStep,
        nextActionStep,
        questionText: `Counting Sort обработал элемент [${idx}] = ${val}. Что произойдёт на следующем шаге?`,
        options,
        correctIndex: 0,
        explanation: `${nextActionStep.title}. ${nextActionStep.description}`,
      });
    } else {
      const [idxA, idxB] = stopStep.comparingIndices;
      const valA = stopStep.array[idxA];
      const valB = stopStep.array[idxB];
      const willSwapOrMove =
        nextActionStep.type === 'swap' ||
        nextActionStep.type === 'heapify' ||
        (nextActionStep.type === 'merge-write' && nextActionStep.swappingIndices.length > 0) ||
        nextActionStep.type === 'minimum';

      let correctOptionText = '';
      if (nextActionStep.type === 'swap' || nextActionStep.type === 'heapify') {
        correctOptionText = `Элементы поменяются местами (или сдвинутся): ${nextActionStep.title}`;
      } else if (nextActionStep.type === 'minimum') {
        correctOptionText = `Обновится индекс найденного минимума на [${nextActionStep.minMaxIndex}] = ${
          stopStep.array[nextActionStep.minMaxIndex ?? 0]
        }`;
      } else if (nextActionStep.type === 'merge-write') {
        correctOptionText = `В результирующий массив слияния запишется меньший из двух сравниваемых элементов (${Math.min(
          valA,
          valB
        )})`;
      } else {
        correctOptionText =
          'Элементы останутся на своих местах (обмена не произойдёт), алгоритм перейдёт к следующей проверке';
      }

      const wrongOption1 =
        nextActionStep.type === 'swap' || nextActionStep.type === 'heapify'
          ? 'Элементы останутся на месте, так как они уже упорядочены'
          : `Элементы [${idxA}] (${valA}) и [${idxB}] (${valB}) немедленно поменяются местами`;

      const options = [
        correctOptionText,
        wrongOption1,
        'Алгоритм немедленно завершит всю сортировку на этом шаге',
        'Массив будет полностью развёрнут в обратном порядке',
      ];

      // Перемешиваем варианты с сохранением правильного индекса
      const indexedOptions = options.map((text, idx) => ({ text, isCorrect: idx === 0 }));
      for (let i = indexedOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tmp = indexedOptions[i];
        indexedOptions[i] = indexedOptions[j];
        indexedOptions[j] = tmp;
      }

      setChallenge({
        algorithmId: algId,
        stopStep,
        nextActionStep,
        questionText: `Алгоритм остановился на шаге №${stopStep.stepNumber}: сравниваются элементы [${idxA}] = ${valA} и [${idxB}] = ${valB}. Что произойдёт на следующем шаге?`,
        options: indexedOptions.map((o) => o.text),
        correctIndex: indexedOptions.findIndex((o) => o.isCorrect),
        explanation: `${ stopStep.reason ? stopStep.reason + ' ' : '' }Следующее событие: ${nextActionStep.description}`,
      });
      void willSwapOrMove;
    }

    setSelectedOption(null);
    setSubmitted(false);
  }, []);

  useEffect(() => {
    generateChallenge(selectedAlg);
  }, [selectedAlg, generateChallenge]);

  const handleConfirm = () => {
    if (selectedOption === null || submitted || !challenge) return;
    setSubmitted(true);
    const isRight = selectedOption === challenge.correctIndex;
    setScore((prev) => ({
      correct: prev.correct + (isRight ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  if (!challenge) return null;

  const algInfo = getAlgorithmById(selectedAlg);
  const displayStep = submitted ? challenge.nextActionStep : challenge.stopStep;

  return (
    <div className="bg-[#171D29] border border-[#8B5CF6]/40 rounded-2xl p-5 sm:p-6 space-y-5 shadow-glow-purple">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6] text-xs font-bold mb-1.5">
            <BrainCircuit className="w-4 h-4" />
            <span>Интерактивный тренажёр</span>
          </div>
          <h3 className="text-lg font-bold text-[#F3F4F6]">
            Режим «Угадай следующий шаг»
          </h3>
          <p className="text-xs text-[#9CA3AF]">
            Алгоритм выполнил несколько реальных шагов и остановился. Предскажите следующее действие!
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-xl bg-[#121620] border border-white/10 flex items-center gap-2 text-xs font-mono">
            <Trophy className="w-4 h-4 text-[#F59E0B]" />
            <span>
              Счёт: <strong className="text-[#22C55E]">{score.correct}</strong> / {score.total}
            </span>
          </div>

          <button
            type="button"
            onClick={() => generateChallenge(selectedAlg)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#121620] hover:bg-white/10 border border-white/15 text-xs font-medium text-[#F3F4F6] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#06B6D4]" />
            <span>Новое задание</span>
          </button>
        </div>
      </div>

      {/* Выбор алгоритма для тренировки */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-[#9CA3AF] mr-1">Алгоритм:</span>
        {ALGORITHMS_DATA.map((alg) => (
          <button
            key={alg.id}
            type="button"
            onClick={() => setSelectedAlg(alg.id)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              selectedAlg === alg.id
                ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            {alg.nameEn}
          </button>
        ))}
      </div>

      {/* Визуализация текущего состояния массива */}
      <div className="p-4 rounded-xl bg-[#121620] border border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-[#9CA3AF]">
            Алгоритм: <strong className="text-[#F3F4F6]">{algInfo.fullName}</strong> (по возрастанию)
          </span>
          <span className="font-mono text-[#06B6D4]">{displayStep.phase}</span>
        </div>

        <div className="flex items-end justify-center gap-3 h-36 pt-4 px-4 bg-[#0B0D12] rounded-xl border border-white/5">
          {displayStep.array.map((val, idx) => {
            const isComparing = displayStep.comparingIndices.includes(idx);
            const isSwapping = displayStep.swappingIndices.includes(idx);
            const isPivot = displayStep.pivotIndex === idx;
            const maxV = Math.max(...displayStep.array, 1);
            const hPct = Math.max(18, Math.round((val / maxV) * 85));

            return (
              <div key={idx} className="flex flex-col items-center justify-end h-full w-12">
                <div
                  style={{ height: `${hPct}%` }}
                  className={`w-full rounded-t-lg border flex items-end justify-center pb-1 font-mono text-xs font-bold transition-all duration-300 ${
                    isSwapping
                      ? 'bg-[#06B6D4] border-white text-black shadow-glow-cyan'
                      : isComparing
                      ? 'bg-[#F59E0B] border-white text-black'
                      : isPivot
                      ? 'bg-[#F97316] border-white text-white'
                      : 'bg-[#8B5CF6]/70 border-[#8B5CF6] text-white'
                  }`}
                >
                  {val}
                </div>
                <span className="text-[10px] font-mono text-[#9CA3AF] mt-1">[{idx}]</span>
              </div>
            );
          })}
        </div>

        <div className="text-xs sm:text-sm font-semibold text-[#F3F4F6]">
          {challenge.questionText}
        </div>
      </div>

      {/* Варианты ответа */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {challenge.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const isCorrect = idx === challenge.correctIndex;

          let cardStyle = 'bg-[#121620] border-white/10 text-[#F3F4F6] hover:border-white/25';
          if (submitted) {
            if (isCorrect) {
              cardStyle = 'bg-[#22C55E]/15 border-[#22C55E] text-[#F3F4F6]';
            } else if (isSelected && !isCorrect) {
              cardStyle = 'bg-[#EF4444]/15 border-[#EF4444] text-[#F3F4F6]';
            }
          } else if (isSelected) {
            cardStyle = 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6]';
          }

          return (
            <button
              key={idx}
              type="button"
              disabled={submitted}
              onClick={() => setSelectedOption(idx)}
              className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 ${cardStyle}`}
            >
              <span className="w-5 h-5 rounded-full bg-black/30 border border-white/20 flex items-center justify-center text-xs font-mono shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="flex-1 leading-relaxed">{opt}</span>
            </button>
          );
        })}
      </div>

      {/* Кнопка подтверждения и результат */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {!submitted ? (
          <button
            type="button"
            disabled={selectedOption === null}
            onClick={handleConfirm}
            className="px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold transition-all"
          >
            Проверить предсказание
          </button>
        ) : (
          <div className="w-full space-y-3">
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                selectedOption === challenge.correctIndex
                  ? 'bg-[#22C55E]/10 border-[#22C55E]/40 text-[#22C55E]'
                  : 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]'
              }`}
            >
              {selectedOption === challenge.correctIndex ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1 text-xs sm:text-sm">
                <div className="font-bold">
                  {selectedOption === challenge.correctIndex
                    ? 'Верно! Вы точно предсказали следующий шаг алгоритма.'
                    : 'Не совсем так. Посмотрите на реальное действие алгоритма:'}
                </div>
                <p className="text-[#F3F4F6] leading-relaxed">{challenge.explanation}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => generateChallenge(selectedAlg)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#06B6D4] hover:bg-[#0891B2] text-black font-bold text-xs sm:text-sm transition-colors"
            >
              <span>Следующее задание</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

