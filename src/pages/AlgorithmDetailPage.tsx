import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ALGORITHMS_DATA, getAlgorithmById } from '../data/algorithms';
import { AlgorithmId } from '../types/algorithm';
import { CodeBlock } from '../components/CodeBlock';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  XCircle,
  ThumbsUp,
  AlertTriangle,
  Briefcase,
  ListChecks,
  Cpu,
} from 'lucide-react';

export const AlgorithmDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const algorithm = getAlgorithmById((id as AlgorithmId) || 'bubble');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Навигационная цепочка и переключение между алгоритмами */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/algorithms"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#9CA3AF] hover:text-[#F3F4F6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Назад в каталог алгоритмов</span>
        </Link>

        <div className="flex flex-wrap items-center gap-1.5">
          {ALGORITHMS_DATA.map((a) => (
            <Link
              key={a.id}
              to={`/algorithms/${a.id}`}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                a.id === algorithm.id
                  ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white'
                  : 'bg-[#171D29] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              {a.nameEn}
            </Link>
          ))}
        </div>
      </div>

      {/* Главная карточка алгоритма */}
      <div className="bg-[#171D29] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-xs font-semibold text-[#8B5CF6]">
                Уровень изучения: {algorithm.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-xs font-semibold text-[#06B6D4]">
                Память: {algorithm.spaceComplexity}
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F3F4F6]">
              {algorithm.nameEn} — {algorithm.nameRu}
            </h1>
            <p className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl leading-relaxed">
              {algorithm.shortDescription}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/lab?algorithm=${algorithm.id}`)}
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-sm font-bold shadow-glow-purple transition-all shrink-0 self-start lg:self-center"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Попробовать в лаборатории</span>
          </button>
        </div>

        {/* Оценки сложности и свойства */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-[#121620] border border-white/5 space-y-1">
            <div className="text-xs text-[#9CA3AF]">Лучший случай</div>
            <div className="text-lg font-mono font-bold text-[#22C55E]">
              {algorithm.bestComplexity}
            </div>
            {algorithm.bestComplexityNote && (
              <p className="text-[11px] text-[#9CA3AF] leading-snug pt-1">
                {algorithm.bestComplexityNote}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#121620] border border-white/5 space-y-1">
            <div className="text-xs text-[#9CA3AF]">Средний случай</div>
            <div className="text-lg font-mono font-bold text-[#F59E0B]">
              {algorithm.averageComplexity}
            </div>
            {algorithm.averageComplexityNote && (
              <p className="text-[11px] text-[#9CA3AF] leading-snug pt-1">
                {algorithm.averageComplexityNote}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#121620] border border-white/5 space-y-1">
            <div className="text-xs text-[#9CA3AF]">Худший случай</div>
            <div className="text-lg font-mono font-bold text-[#EF4444]">
              {algorithm.worstComplexity}
            </div>
            {algorithm.worstComplexityNote && (
              <p className="text-[11px] text-[#9CA3AF] leading-snug pt-1">
                {algorithm.worstComplexityNote}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#121620] border border-white/5 space-y-1">
            <div className="text-xs text-[#9CA3AF]">Доп. память</div>
            <div className="text-lg font-mono font-bold text-[#06B6D4]">
              {algorithm.spaceComplexity}
            </div>
            {algorithm.spaceComplexityNote && (
              <p className="text-[11px] text-[#9CA3AF] leading-snug pt-1">
                {algorithm.spaceComplexityNote}
              </p>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-[#121620] border border-white/5 space-y-1">
            <div className="text-xs text-[#9CA3AF]">Устойчивость</div>
            <div className="text-base font-bold flex items-center gap-1.5 mt-0.5">
              {algorithm.stable ? (
                <span className="text-[#22C55E] inline-flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Устойчивый
                </span>
              ) : (
                <span className="text-[#EF4444] inline-flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Неустойчивый
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#9CA3AF] leading-snug pt-1">
              {algorithm.stableNote}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#121620] border border-white/5 space-y-1">
            <div className="text-xs text-[#9CA3AF]">Сортировка на месте</div>
            <div className="text-base font-bold flex items-center gap-1.5 mt-0.5">
              {algorithm.inPlace ? (
                <span className="text-[#22C55E] inline-flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Да (In-place)
                </span>
              ) : (
                <span className="text-[#F59E0B] inline-flex items-center gap-1">
                  <XCircle className="w-4 h-4" /> Нет
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#9CA3AF] leading-snug pt-1">
              {algorithm.inPlaceNote}
            </p>
          </div>
        </div>

        {/* Подробный принцип работы и пошаговый план */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
          <div className="lg:col-span-7 bg-[#121620] border border-white/10 rounded-2xl p-5 space-y-3">
            <h2 className="text-base font-bold text-[#F3F4F6] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#8B5CF6]" />
              <span>Принцип работы алгоритма</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#F3F4F6]/90 leading-relaxed">
              {algorithm.detailedPrinciple}
            </p>
            {algorithm.pivotOrGapStrategy && (
              <div className="p-3 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-xs text-[#06B6D4]">
                {algorithm.pivotOrGapStrategy}
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-[#121620] border border-white/10 rounded-2xl p-5 space-y-3">
            <h2 className="text-base font-bold text-[#F3F4F6] flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-[#06B6D4]" />
              <span>Пошаговая схема выполнения</span>
            </h2>
            <ol className="space-y-2 text-xs sm:text-sm text-[#9CA3AF]">
              {algorithm.stepByStepSummary.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/40 text-[#8B5CF6] font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-[#F3F4F6]/90 leading-relaxed">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Преимущества, недостатки и области применения */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-[#121620] border border-[#22C55E]/25 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#22C55E] flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              <span>Основные преимущества</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F3F4F6]/90">
              {algorithm.advantages.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#22C55E] font-bold">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#121620] border border-[#EF4444]/25 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#EF4444] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Основные недостатки</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F3F4F6]/90">
              {algorithm.disadvantages.map((dis, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#EF4444] font-bold">•</span>
                  <span>{dis}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#121620] border border-[#06B6D4]/25 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-[#06B6D4] flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              <span>Практическое применение</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#F3F4F6]/90">
              {algorithm.useCases.map((uc, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#06B6D4] font-bold">•</span>
                  <span>{uc}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Псевдокод, JavaScript и TypeScript реализация */}
      <CodeBlock algorithmName={algorithm.fullName} code={algorithm.code} />
    </div>
  );
};

