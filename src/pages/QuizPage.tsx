import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import {
  ClipboardCheck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  AlertCircle,
} from 'lucide-react';

export const QuizPage: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState<boolean>(false);

  const totalQuestions = QUIZ_QUESTIONS.length;
  const currentQuestion = QUIZ_QUESTIONS[currentIdx];
  const progressPct = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  const handleConfirmAnswer = () => {
    if (selectedOption === null) return;
    const nextAnswers = [...userAnswers, selectedOption];
    setUserAnswers(nextAnswers);
    setSelectedOption(null);

    if (currentIdx + 1 >= totalQuestions) {
      setFinished(true);
    } else {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOption(null);
    setUserAnswers([]);
    setFinished(false);
  };

  const correctCount = userAnswers.reduce((acc, ans, idx) => {
    return acc + (ans === QUIZ_QUESTIONS[idx].correctIndex ? 1 : 0);
  }, 0);

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  const getKnowledgeGrade = (pct: number) => {
    if (pct >= 90) {
      return {
        title: 'Отлично (Экспертный уровень)',
        desc: 'Вы превосходно владеете теорией и практическими особенностями алгоритмов сортировки!',
        color: 'text-[#22C55E]',
      };
    }
    if (pct >= 75) {
      return {
        title: 'Хорошо (Уверенный уровень)',
        desc: 'Вы хорошо понимаете принципы работы большинства алгоритмов и оценки Big O.',
        color: 'text-[#06B6D4]',
      };
    }
    if (pct >= 50) {
      return {
        title: 'Удовлетворительно (Базовый уровень)',
        desc: 'Базовые понятия усвоены, но рекомендуется повторить раздел «Теория» и поработать в «Лаборатории».',
        color: 'text-[#F59E0B]',
      };
    }
    return {
      title: 'Требуется дополнительное изучение',
      desc: 'Рекомендуем изучить теоретический справочник и пошагово разобрать алгоритмы в лаборатории.',
      color: 'text-[#EF4444]',
    };
  };

  const grade = getKnowledgeGrade(scorePercent);
  const mistakes = QUIZ_QUESTIONS.filter(
    (q, idx) => userAnswers[idx] !== q.correctIndex
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Заголовок */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-xs font-semibold text-[#8B5CF6]">
          <ClipboardCheck className="w-3.5 h-3.5" />
          <span>Итоговый контроль</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F3F4F6]">
          Проверь свои знания
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF]">
          Тестирование из {totalQuestions} вопросов по принципам работы алгоритмов, временной и пространственной сложности, устойчивости и выбору оптимального метода.
        </p>
      </div>

      {!finished ? (
        /* Экран текущего вопроса (один вопрос на экране) */
        <div className="bg-[#171D29] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          {/* Индикатор прогресса */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[#06B6D4] font-semibold">
                Тема: {currentQuestion.topic}
              </span>
              <span className="text-[#9CA3AF]">
                Вопрос <strong className="text-[#F3F4F6]">{currentIdx + 1}</strong> из{' '}
                {totalQuestions} ({progressPct}%)
              </span>
            </div>
            <div className="w-full h-2.5 bg-[#121620] rounded-full overflow-hidden border border-white/5">
              <div
                style={{ width: `${progressPct}%` }}
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] transition-all duration-300"
              />
            </div>
          </div>

          {/* Текст вопроса */}
          <h2 className="text-lg sm:text-xl font-bold text-[#F3F4F6] leading-snug pt-2">
            {currentQuestion.question}
          </h2>

          {/* Четыре варианта ответа */}
          <div className="space-y-3">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = selectedOption === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => setSelectedOption(optIdx)}
                  className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#F3F4F6] shadow-glow-purple'
                      : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-white/25'
                  }`}
                >
                  <span
                    className={`w-6 h-6 rounded-full border flex items-center justify-center font-mono text-xs shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white font-bold'
                        : 'bg-black/30 border-white/20 text-[#9CA3AF]'
                    }`}
                  >
                    {optIdx + 1}
                  </span>
                  <span className="leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Кнопка Ответить и переход к следующему вопросу */}
          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs text-[#9CA3AF]">
              Выберите один вариант и нажмите «Ответить»
            </span>
            <button
              type="button"
              disabled={selectedOption === null}
              onClick={handleConfirmAnswer}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] disabled:opacity-40 disabled:pointer-events-none text-white text-sm font-bold shadow-glow-purple transition-all"
            >
              <span>
                {currentIdx + 1 === totalQuestions ? 'Ответить и завершить' : 'Ответить'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Экран итогового результата */
        <div className="space-y-8">
          <div className="bg-[#171D29] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#9CA3AF]">
                  <Trophy className="w-4 h-4 text-[#F59E0B]" />
                  <span>Тестирование завершено</span>
                </div>
                <h2 className={`text-2xl sm:text-3xl font-extrabold ${grade.color}`}>
                  {grade.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#9CA3AF] max-w-xl">
                  {grade.desc}
                </p>
              </div>

              <div className="flex items-center gap-4 bg-[#121620] p-4 rounded-2xl border border-white/10 shrink-0">
                <div className="text-center px-2">
                  <div className="text-xs text-[#9CA3AF]">Правильных</div>
                  <div className="text-2xl font-mono font-extrabold text-[#22C55E]">
                    {correctCount} / {totalQuestions}
                  </div>
                </div>
                <div className="h-10 w-px bg-white/10" />
                <div className="text-center px-2">
                  <div className="text-xs text-[#9CA3AF]">Результат</div>
                  <div className="text-2xl font-mono font-extrabold text-[#06B6D4]">
                    {scorePercent}%
                  </div>
                </div>
              </div>
            </div>

            {/* Сводка ошибок */}
            {mistakes.length === 0 ? (
              <div className="p-4 rounded-2xl bg-[#22C55E]/10 border border-[#22C55E]/30 flex items-center gap-3 text-sm text-[#22C55E] font-medium">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Поздравляем! Вы не допустили ни одной ошибки во всём тесте!</span>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#F59E0B]/10 border border-[#F59E0B]/30 flex items-start gap-3 text-xs sm:text-sm text-[#F59E0B]">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">
                    Количество допущенных ошибок: {mistakes.length}.
                  </span>{' '}
                  Ниже приведён подробный разбор каждого вопроса с правильными ответами и объяснениями.
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-sm font-bold shadow-glow-purple transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Пройти ещё раз</span>
            </button>
          </div>

          {/* Детальный разбор всех вопросов и ошибок */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#F3F4F6]">
              Подробный разбор ответов ({totalQuestions})
            </h3>
            {QUIZ_QUESTIONS.map((q, idx) => {
              const userAns = userAnswers[idx];
              const isCorrect = userAns === q.correctIndex;
              return (
                <div
                  key={q.id}
                  className={`bg-[#171D29] border rounded-2xl p-5 space-y-3 ${
                    isCorrect ? 'border-[#22C55E]/30' : 'border-[#EF4444]/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-bold text-[#F3F4F6]">
                      {idx + 1}. {q.question}
                    </div>
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#22C55E]/15 text-[#22C55E] text-xs font-bold shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Верно
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EF4444]/15 text-[#EF4444] text-xs font-bold shrink-0">
                        <XCircle className="w-3.5 h-3.5" /> Ошибка
                      </span>
                    )}
                  </div>

                  {!isCorrect && (
                    <div className="text-xs text-[#EF4444] bg-[#EF4444]/10 px-3 py-2 rounded-xl">
                      <strong>Ваш ответ:</strong> {q.options[userAns]}
                    </div>
                  )}

                  <div className="text-xs text-[#22C55E] bg-[#22C55E]/10 px-3 py-2 rounded-xl">
                    <strong>Правильный ответ:</strong> {q.options[q.correctIndex]}
                  </div>

                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    <strong className="text-[#F3F4F6]">Пояснение:</strong> {q.explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

