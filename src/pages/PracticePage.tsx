import React, { useState } from 'react';
import { PRACTICE_EXERCISES, PracticeExercise } from '../data/exercises';
import { PredictNextStepWidget } from '../components/PredictNextStepWidget';
import {
  GraduationCap,
  CheckCircle2,
  XCircle,
  RotateCcw,
  HelpCircle,
  Award,
} from 'lucide-react';

export const PracticePage: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState<0 | 1 | 2 | 3>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  const [shownHints, setShownHints] = useState<Record<string, boolean>>({});

  const visibleExercises = PRACTICE_EXERCISES.filter(
    (ex) => activeLevel === 0 || ex.level === activeLevel
  );

  const handleSelectOption = (taskId: string, optionIdx: number) => {
    if (checkedTasks[taskId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [taskId]: optionIdx }));
  };

  const handleCheckTask = (taskId: string) => {
    if (selectedAnswers[taskId] === undefined) return;
    setCheckedTasks((prev) => ({ ...prev, [taskId]: true }));
  };

  const handleResetTask = (taskId: string) => {
    setSelectedAnswers((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
    setCheckedTasks((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
  };

  const totalSolvedCorrectly = PRACTICE_EXERCISES.filter(
    (ex) => checkedTasks[ex.id] && selectedAnswers[ex.id] === ex.correctIndex
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Заголовок */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-xs font-semibold text-[#8B5CF6]">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Интерактивный практикум</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F3F4F6]">
            Практические задания
          </h1>
          <p className="text-sm sm:text-base text-[#9CA3AF] max-w-2xl">
            Выполняйте задания трёх уровней сложности и тренируйтесь предсказывать поведение алгоритмов в реальном времени.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-[#171D29] border border-white/10 flex items-center gap-3 self-start md:self-auto">
          <Award className="w-5 h-5 text-[#22C55E]" />
          <div className="text-xs">
            <div className="text-[#9CA3AF]">Решено верно</div>
            <div className="font-mono font-bold text-sm text-[#F3F4F6]">
              {totalSolvedCorrectly} из {PRACTICE_EXERCISES.length} заданий
            </div>
          </div>
        </div>
      </div>

      {/* Интерактивный тренажёр «Угадай следующий шаг» (Раздел 18) */}
      <PredictNextStepWidget />

      {/* Переключатель уровней сложности */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveLevel(0)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              activeLevel === 0
                ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                : 'bg-[#171D29] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            Все уровни (9)
          </button>
          <button
            type="button"
            onClick={() => setActiveLevel(1)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              activeLevel === 1
                ? 'bg-[#22C55E] border-[#22C55E] text-black'
                : 'bg-[#171D29] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            Уровень 1 — Базовый
          </button>
          <button
            type="button"
            onClick={() => setActiveLevel(2)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              activeLevel === 2
                ? 'bg-[#06B6D4] border-[#06B6D4] text-black'
                : 'bg-[#171D29] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            Уровень 2 — Средний
          </button>
          <button
            type="button"
            onClick={() => setActiveLevel(3)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
              activeLevel === 3
                ? 'bg-[#F59E0B] border-[#F59E0B] text-black'
                : 'bg-[#171D29] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            Уровень 3 — Продвинутый
          </button>
        </div>
      </div>

      {/* Список карточек заданий */}
      <div className="space-y-6">
        {visibleExercises.map((task: PracticeExercise) => {
          const chosen = selectedAnswers[task.id];
          const isChecked = !!checkedTasks[task.id];
          const isCorrect = isChecked && chosen === task.correctIndex;
          const showHint = !!shownHints[task.id];

          return (
            <div
              key={task.id}
              className="bg-[#171D29] border border-white/10 rounded-2xl p-5 sm:p-6 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      task.level === 1
                        ? 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30'
                        : task.level === 2
                        ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30'
                        : 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
                    }`}
                  >
                    {task.levelTitle}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-[#F3F4F6]">
                    {task.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShownHints((prev) => ({ ...prev, [task.id]: !prev[task.id] }))
                  }
                  className="inline-flex items-center gap-1 text-xs text-[#06B6D4] hover:underline"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{showHint ? 'Скрыть подсказку' : 'Показать подсказку'}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-[#F3F4F6]/90 leading-relaxed">
                {task.question}
              </p>

              {/* Наглядное отображение массива задания, если оно задано */}
              {task.arrayContext && (
                <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#121620] border border-white/5">
                  <span className="text-xs text-[#9CA3AF] mr-1">Массив:</span>
                  {task.arrayContext.map((val, idx) => {
                    const isHigh = task.highlightIndices?.includes(idx);
                    const isPvt = task.pivotIndex === idx;
                    return (
                      <div
                        key={idx}
                        className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold border ${
                          isPvt
                            ? 'bg-[#F97316]/25 border-[#F97316] text-[#F97316]'
                            : isHigh
                            ? 'bg-[#F59E0B]/25 border-[#F59E0B] text-[#F59E0B]'
                            : 'bg-[#171D29] border-white/10 text-[#F3F4F6]'
                        }`}
                      >
                        <span className="text-[10px] text-[#9CA3AF] mr-1">[{idx}]</span>
                        {val}
                      </div>
                    );
                  })}
                </div>
              )}

              {showHint && (
                <div className="p-3 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-xs text-[#06B6D4]">
                  Подсказка: {task.hint}
                </div>
              )}

              {/* Варианты ответа */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {task.options.map((opt, optIdx) => {
                  const isOptSelected = chosen === optIdx;
                  const isOptRight = optIdx === task.correctIndex;

                  let styleClass =
                    'bg-[#121620] border-white/10 text-[#F3F4F6] hover:border-white/25';
                  if (isChecked) {
                    if (isOptRight) {
                      styleClass = 'bg-[#22C55E]/15 border-[#22C55E] text-[#F3F4F6]';
                    } else if (isOptSelected && !isOptRight) {
                      styleClass = 'bg-[#EF4444]/15 border-[#EF4444] text-[#F3F4F6]';
                    }
                  } else if (isOptSelected) {
                    styleClass = 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6]';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isChecked}
                      onClick={() => handleSelectOption(task.id, optIdx)}
                      className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-2.5 ${styleClass}`}
                    >
                      <span className="w-5 h-5 rounded-full bg-black/30 border border-white/20 flex items-center justify-center font-mono text-xs shrink-0 mt-0.5">
                        {optIdx + 1}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Кнопки проверки и повтора + объяснение */}
              <div className="pt-1 flex flex-wrap items-center justify-between gap-3">
                {!isChecked ? (
                  <button
                    type="button"
                    disabled={chosen === undefined}
                    onClick={() => handleCheckTask(task.id)}
                    className="px-5 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-40 disabled:pointer-events-none text-white text-xs sm:text-sm font-semibold transition-all"
                  >
                    Проверить ответ
                  </button>
                ) : (
                  <div className="w-full space-y-3">
                    <div
                      className={`p-4 rounded-xl border flex items-start gap-3 ${
                        isCorrect
                          ? 'bg-[#22C55E]/10 border-[#22C55E]/40 text-[#22C55E]'
                          : 'bg-[#EF4444]/10 border-[#EF4444]/40 text-[#EF4444]'
                      }`}
                    >
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-1 text-xs sm:text-sm">
                        <div className="font-bold">
                          {isCorrect
                            ? 'Правильно! Отличная работа.'
                            : 'Ответ неверный. Изучите объяснение:'}
                        </div>
                        <p className="text-[#F3F4F6] leading-relaxed">
                          {task.explanation}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleResetTask(task.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#121620] hover:bg-white/10 border border-white/15 text-xs font-medium text-[#F3F4F6]"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-[#06B6D4]" />
                      <span>Повторить задание</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

