import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Play,
  BookOpen,
  Eye,
  Footprints,
  BarChart3,
  GraduationCap,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Pause,
  CheckCircle2,
  Layers,
} from 'lucide-react';
import { ALGORITHMS_DATA, getAlgorithmById } from '../data/algorithms';
import { executeSortingAlgorithm } from '../algorithms';
import { formatComputeTime } from '../utils/complexity';
import { AlgorithmId } from '../types/algorithm';

const HERO_INITIAL_ARRAY = [68, 24, 91, 14, 52, 83, 37, 19, 76, 45, 31, 60];
const POPULAR_IDS: AlgorithmId[] = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [heroAlg, setHeroAlg] = useState<AlgorithmId>('quick');
  const [heroStepIdx, setHeroStepIdx] = useState<number>(0);
  const [heroPlaying, setHeroPlaying] = useState<boolean>(true);
  const [howItWorksSorted, setHowItWorksSorted] = useState<boolean>(false);

  const heroResult = useMemo(
    () => executeSortingAlgorithm(heroAlg, HERO_INITIAL_ARRAY, 'asc'),
    [heroAlg]
  );

  // Короткая демонстрационная анимация при первом открытии страницы (останавливается по завершении, не бесконечная)
  useEffect(() => {
    if (!heroPlaying) return;
    if (heroStepIdx >= heroResult.steps.length - 1) {
      setHeroPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setHeroStepIdx((prev) => Math.min(prev + 1, heroResult.steps.length - 1));
    }, 160);

    return () => window.clearTimeout(timer);
  }, [heroPlaying, heroStepIdx, heroResult.steps.length]);

  const currentHeroStep = heroResult.steps[heroStepIdx] || heroResult.steps[0];
  const popularAlgorithms = ALGORITHMS_DATA.filter((a) => POPULAR_IDS.includes(a.id));

  return (
    <div className="space-y-20 pb-12">
      {/* 1. Первый экран (Hero) */}
      <section className="relative overflow-hidden pt-8 sm:pt-14">
        {/* Фоновое свечение */}
        <div className="absolute -top-24 left-1/4 w-96 h-96 bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-16 right-1/4 w-80 h-80 bg-[#06B6D4]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Текстовая колонка */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#171D29] border border-[#8B5CF6]/40 text-xs font-medium text-[#F3F4F6]">
                <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>SORTLAB — лаборатория алгоритмов сортировки</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F3F4F6] leading-[1.15]">
                Увидь, как работает{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4]">
                  сортировка
                </span>
              </h1>

              <p className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed max-w-xl">
                Исследуй алгоритмы сортировки в действии. Наблюдай за каждым сравнением, каждой перестановкой и каждым шагом на пути к упорядоченному массиву.
              </p>

              <p className="text-xs font-mono uppercase tracking-wider text-[#06B6D4]">
                «Изучай алгоритмы. Наблюдай за каждым шагом. Сравнивай эффективность».
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate('/lab')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-sm sm:text-base font-bold shadow-glow-purple transition-all active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Открыть лабораторию</span>
                </button>

                <button
                  onClick={() => navigate('/algorithms')}
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#171D29] hover:bg-white/10 border border-white/15 text-[#F3F4F6] text-sm sm:text-base font-semibold transition-all"
                >
                  <BookOpen className="w-4 h-4 text-[#06B6D4]" />
                  <span>Изучить алгоритмы</span>
                </button>
              </div>
            </div>

            {/* Правая колонка: интерактивная мини-визуализация */}
            <div className="lg:col-span-6">
              <div className="bg-[#171D29] border border-white/10 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]" />
                    <span className="ml-2 text-xs font-mono text-[#9CA3AF]">
                      Демо: {heroAlg.toUpperCase()} SORT
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(['quick', 'bubble', 'merge'] as AlgorithmId[]).map((alg) => (
                      <button
                        key={alg}
                        type="button"
                        onClick={() => {
                          setHeroAlg(alg);
                          setHeroStepIdx(0);
                          setHeroPlaying(true);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                          heroAlg === alg
                            ? 'bg-[#8B5CF6] text-white'
                            : 'bg-[#121620] text-[#9CA3AF] hover:text-[#F3F4F6]'
                        }`}
                      >
                        {alg === 'quick' ? 'Quick' : alg === 'bubble' ? 'Bubble' : 'Merge'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Полоска параметров и времени работы алгоритма в демо */}
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-[#121620] border border-white/10 text-xs font-mono">
                  <span className="text-[#F3F4F6]">
                    Сложность:{' '}
                    <strong className="text-[#06B6D4]">
                      {getAlgorithmById(heroAlg).averageComplexity}
                    </strong>
                  </span>
                  <span className="text-[#9CA3AF]">
                    Сравнений:{' '}
                    <strong className="text-[#F59E0B]">
                      {currentHeroStep.stats.comparisons}
                    </strong>
                  </span>
                  <span className="text-[#9CA3AF]">
                    Время:{' '}
                    <strong className="text-[#22C55E]">
                      {formatComputeTime(heroResult.computeTimeMs)}
                    </strong>
                  </span>
                </div>

                {/* Столбцы */}
                <div className="h-56 bg-[#0B0D12] rounded-xl border border-white/5 p-4 flex items-end justify-center gap-2">
                  {currentHeroStep.array.map((val, idx) => {
                    const isCmp = currentHeroStep.comparingIndices.includes(idx);
                    const isSwp = currentHeroStep.swappingIndices.includes(idx);
                    const isPvt = currentHeroStep.pivotIndex === idx;
                    const isDone =
                      currentHeroStep.sortedIndices.includes(idx) ||
                      heroStepIdx >= heroResult.steps.length - 1;

                    let barColor = 'from-[#5B21B6] to-[#8B5CF6]';
                    if (isDone) barColor = 'from-[#15803D] to-[#22C55E]';
                    else if (isSwp) barColor = 'from-[#0891B2] to-[#06B6D4]';
                    else if (isPvt) barColor = 'from-[#EA580C] to-[#F97316]';
                    else if (isCmp) barColor = 'from-[#D97706] to-[#F59E0B]';

                    return (
                      <div
                        key={idx}
                        className="flex-1 h-full flex flex-col items-center justify-end"
                      >
                        <div
                          style={{ height: `${Math.max(14, val)}%` }}
                          className={`w-full rounded-t-md bg-gradient-to-t ${barColor} transition-all duration-150`}
                        />
                        <span className="text-[10px] font-mono text-[#9CA3AF] mt-1.5">
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Управление мини-демонстрацией */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-[#9CA3AF] italic">
                    «От хаоса к порядку — шаг за шагом»
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (heroStepIdx >= heroResult.steps.length - 1) {
                          setHeroStepIdx(0);
                          setHeroPlaying(true);
                        } else {
                          setHeroPlaying((prev) => !prev);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#121620] hover:bg-white/10 border border-white/10 text-[#F3F4F6] font-medium"
                    >
                      {heroPlaying ? (
                        <>
                          <Pause className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Пауза</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 text-[#22C55E]" />
                          <span>
                            {heroStepIdx >= heroResult.steps.length - 1
                              ? 'Повторить'
                              : 'Продолжить'}
                          </span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setHeroStepIdx(0);
                        setHeroPlaying(false);
                      }}
                      className="p-1.5 rounded-lg bg-[#121620] hover:bg-white/10 border border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]"
                      title="Сбросить демо"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Карточки преимуществ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-[#171D29] border border-white/10 hover:border-[#8B5CF6]/50 rounded-2xl p-6 transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#8B5CF6]">
              <Eye className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F3F4F6]">
              Интерактивная визуализация
            </h3>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Наблюдай за каждым сравнением и перестановкой элементов.
            </p>
          </div>

          <div className="bg-[#171D29] border border-white/10 hover:border-[#06B6D4]/50 rounded-2xl p-6 transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#06B6D4]/15 border border-[#06B6D4]/30 flex items-center justify-center text-[#06B6D4]">
              <Footprints className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F3F4F6]">
              Пошаговое обучение
            </h3>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Изучай алгоритмы в собственном темпе.
            </p>
          </div>

          <div className="bg-[#171D29] border border-white/10 hover:border-[#22C55E]/50 rounded-2xl p-6 transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E]">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F3F4F6]">
              Сравнение эффективности
            </h3>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Сравнивай количество операций и вычислительную сложность.
            </p>
          </div>

          <div className="bg-[#171D29] border border-white/10 hover:border-[#F59E0B]/50 rounded-2xl p-6 transition-all space-y-3">
            <div className="w-11 h-11 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#F59E0B]">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-[#F3F4F6]">
              Практика и тесты
            </h3>
            <p className="text-sm text-[#9CA3AF] leading-relaxed">
              Закрепляй знания с помощью интерактивных заданий.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Раздел популярных алгоритмов */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F3F4F6]">
              Популярные алгоритмы сортировки
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-1">
              От классических квадратичных методов до быстрых алгоритмов «разделяй и властвуй»
            </p>
          </div>
          <Link
            to="/algorithms"
            className="text-sm font-semibold text-[#8B5CF6] hover:text-[#06B6D4] inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Открыть весь каталог (8 алгоритмов)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularAlgorithms.map((alg, cardIdx) => {
            const sampleHeights = [35, 75, 25, 90, 50, 65, 95];
            return (
              <div
                key={alg.id}
                className="bg-[#171D29] border border-white/10 hover:border-[#8B5CF6]/40 rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all group"
              >
                <div className="space-y-3">
                  {/* Мини-иллюстрация из столбцов */}
                  <div className="h-20 rounded-xl bg-[#121620] border border-white/5 px-4 pt-3 pb-2 flex items-end justify-between gap-2">
                    {sampleHeights.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          height: `${((h + cardIdx * 11 + i * 7) % 70) + 25}%`,
                        }}
                        className={`flex-1 rounded-t-sm transition-all duration-300 ${
                          i === 2
                            ? 'bg-[#F59E0B]'
                            : i === 4
                            ? 'bg-[#06B6D4]'
                            : i >= 5
                            ? 'bg-[#22C55E]'
                            : 'bg-[#8B5CF6]/70 group-hover:bg-[#8B5CF6]'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-[#F3F4F6]">
                        {alg.nameEn}
                      </h3>
                      <p className="text-xs text-[#9CA3AF]">{alg.nameRu}</p>
                    </div>
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full border ${
                        alg.difficulty === 'Начальный'
                          ? 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30'
                          : alg.difficulty === 'Средний'
                          ? 'bg-[#06B6D4]/15 text-[#06B6D4] border-[#06B6D4]/30'
                          : 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30'
                      }`}
                    >
                      {alg.difficulty}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#9CA3AF] line-clamp-3 leading-relaxed">
                    {alg.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-[#9CA3AF]">Сложность: </span>
                    <span className="font-mono font-bold text-[#06B6D4]">
                      {alg.averageComplexity}
                    </span>
                  </div>

                  <Link
                    to={`/algorithms/${alg.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#121620] hover:bg-[#8B5CF6] text-[#F3F4F6] hover:text-white text-xs font-semibold border border-white/10 transition-colors"
                  >
                    <span>Подробнее</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Раздел «Как это работает» */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#121620] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F3F4F6]">
              Как это работает
            </h2>
            <p className="text-sm text-[#9CA3AF]">
              Три простых шага для проведения собственного алгоритмического эксперимента
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-3 relative">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#8B5CF6] text-white font-mono font-bold text-sm">
                1
              </span>
              <h3 className="text-base font-bold text-[#F3F4F6]">1. Создай массив</h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                Сгенерируй случайный, почти упорядоченный или обратный массив от 5 до 100 элементов либо введи собственную последовательность чисел.
              </p>
            </div>

            <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-3 relative">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#06B6D4] text-black font-mono font-bold text-sm">
                2
              </span>
              <h3 className="text-base font-bold text-[#F3F4F6]">2. Запусти алгоритм</h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                Выбери любой из 8 алгоритмов сортировки, настрой скорость воспроизведения или переключай события вручную вперёд и назад.
              </p>
            </div>

            <div className="bg-[#171D29] border border-white/10 rounded-2xl p-6 space-y-3 relative">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#22C55E] text-black font-mono font-bold text-sm">
                3
              </span>
              <h3 className="text-base font-bold text-[#F3F4F6]">
                3. Наблюдай за результатом
              </h3>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                Изучай подробные объяснения каждого шага, следи за счётчиками сравнений и обменов и сопоставляй графики производительности.
              </p>
            </div>
          </div>

          {/* Интерактивная иллюстрация превращения неупорядоченного массива в упорядоченный */}
          <div className="bg-[#171D29] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="text-sm font-bold text-[#F3F4F6] flex items-center justify-center md:justify-start gap-2">
                <Layers className="w-4 h-4 text-[#8B5CF6]" />
                <span>Наглядная трансформация массива</span>
              </div>
              <p className="text-xs text-[#9CA3AF]">
                Нажмите кнопку, чтобы увидеть превращение неупорядоченного набора чисел в отсортированную последовательность
              </p>
            </div>

            <div className="flex items-end gap-2 h-20 bg-[#0B0D12] px-5 py-3 rounded-xl border border-white/5">
              {(howItWorksSorted
                ? [12, 24, 38, 51, 67, 82, 95]
                : [67, 12, 95, 38, 82, 24, 51]
              ).map((v, i) => (
                <div key={i} className="flex flex-col items-center justify-end h-full w-7">
                  <div
                    style={{ height: `${v}%` }}
                    className={`w-full rounded-t transition-all duration-500 ${
                      howItWorksSorted ? 'bg-[#22C55E]' : 'bg-[#8B5CF6]'
                    }`}
                  />
                  <span className="text-[10px] font-mono text-[#F3F4F6] mt-1">{v}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setHowItWorksSorted((prev) => !prev)}
              className="px-4 py-2.5 rounded-xl bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/50 text-xs font-semibold text-[#F3F4F6] transition-colors shrink-0"
            >
              {howItWorksSorted ? 'Вернуть исходный хаос' : 'Упорядочить массив →'}
            </button>
          </div>
        </div>
      </section>

      {/* 5. Раздел сравнения (краткая сравнительная таблица) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[#F3F4F6]">
              Краткое сравнение характеристик
            </h2>
            <p className="text-sm text-[#9CA3AF] mt-1">
              Сопоставление временной и пространственной сложности основных алгоритмов
            </p>
          </div>
          <Link
            to="/comparison"
            className="text-sm font-semibold text-[#06B6D4] hover:underline inline-flex items-center gap-1.5"
          >
            <span>Перейти к синхронному сравнению</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-[#171D29] border border-white/10 rounded-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-[#121620] border-b border-white/10 text-xs font-bold uppercase text-[#9CA3AF]">
                <th className="py-3.5 px-4">Алгоритм</th>
                <th className="py-3.5 px-4">Лучшее время</th>
                <th className="py-3.5 px-4">Среднее время</th>
                <th className="py-3.5 px-4">Худшее время</th>
                <th className="py-3.5 px-4">Память</th>
                <th className="py-3.5 px-4">Устойчивость</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
              {popularAlgorithms.map((alg) => (
                <tr key={alg.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4 font-bold text-[#F3F4F6]">
                    {alg.nameEn}{' '}
                    <span className="text-xs font-normal text-[#9CA3AF]">
                      ({alg.nameRu})
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[#22C55E]">
                    {alg.bestComplexity}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#F59E0B]">
                    {alg.averageComplexity}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#EF4444]">
                    {alg.worstComplexity}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#06B6D4]">
                    {alg.spaceComplexity}
                  </td>
                  <td className="py-3 px-4">
                    {alg.stable ? (
                      <span className="inline-flex items-center gap-1 text-[#22C55E]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Да
                      </span>
                    ) : (
                      <span className="text-[#9CA3AF]">Нет</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 6. Финальный призыв */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#171D29] via-[#1E1B4B] to-[#171D29] border border-[#8B5CF6]/40 rounded-3xl p-8 sm:p-12 text-center space-y-5 shadow-glow-purple">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F3F4F6]">
            Готов исследовать алгоритмы?
          </h2>
          <p className="text-sm sm:text-base text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
            Запусти свою первую сортировку и посмотри, как алгоритм превращает набор чисел в упорядоченную последовательность.
          </p>
          <div className="pt-2">
            <button
              onClick={() => navigate('/lab')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] hover:opacity-95 text-white font-bold text-sm sm:text-base shadow-glow-purple transition-all active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Перейти в лабораторию</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

