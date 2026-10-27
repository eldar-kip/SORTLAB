import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ALGORITHMS_DATA } from '../data/algorithms';
import { AlgorithmCategory } from '../types/algorithm';
import { ComplexityTable } from '../components/ComplexityTable';
import {
  Search,
  Filter,
  Cpu,
  ArrowRight,
  Play,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

type FilterOption = 'all' | AlgorithmCategory;

const FILTER_BUTTONS: { id: FilterOption; label: string }[] = [
  { id: 'all', label: 'Все алгоритмы (8)' },
  { id: 'simple', label: 'Простые алгоритмы' },
  { id: 'efficient', label: 'Эффективные алгоритмы' },
  { id: 'in-place', label: 'Сортировка на месте' },
  { id: 'stable', label: 'Устойчивые алгоритмы' },
  { id: 'linear', label: 'Линейные для спец. условий' },
];

export const AlgorithmsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const navigate = useNavigate();

  const filteredAlgorithms = useMemo(() => {
    return ALGORITHMS_DATA.filter((alg) => {
      const matchesFilter =
        activeFilter === 'all' || alg.categories.includes(activeFilter);
      const q = searchQuery.trim().toLowerCase();
      if (!q) return matchesFilter;
      const matchesSearch =
        alg.nameEn.toLowerCase().includes(q) ||
        alg.nameRu.toLowerCase().includes(q) ||
        alg.shortDescription.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [searchQuery, activeFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Заголовок */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06B6D4]/15 border border-[#06B6D4]/30 text-xs font-semibold text-[#06B6D4]">
          <Cpu className="w-3.5 h-3.5" />
          <span>Энциклопедия алгоритмов</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F3F4F6]">
          Каталог алгоритмов сортировки
        </h1>
        <p className="text-sm sm:text-base text-[#9CA3AF] max-w-3xl">
          Подробный справочник по всем 8 реализованным алгоритмам сортировки: принцип работы, оценки временной и пространственной сложности, свойства устойчивости, достоинства, недостатки и исходный код.
        </p>
      </div>

      {/* Поиск и фильтры */}
      <div className="bg-[#171D29] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по русскому или английскому названию (например: Quick, Быстрая, Шелла)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#121620] border border-white/15 text-sm text-[#F3F4F6] placeholder-[#9CA3AF]/60 focus:outline-none focus:border-[#8B5CF6]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#9CA3AF] inline-flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#8B5CF6]" />
            <span>Фильтр:</span>
          </span>
          {FILTER_BUTTONS.map((btn) => (
            <button
              key={btn.id}
              type="button"
              onClick={() => setActiveFilter(btn.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                activeFilter === btn.id
                  ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-glow-purple'
                  : 'bg-[#121620] border-white/10 text-[#9CA3AF] hover:text-[#F3F4F6] hover:border-white/25'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Сетка карточек алгоритмов */}
      {filteredAlgorithms.length === 0 ? (
        <div className="bg-[#171D29] border border-white/10 rounded-2xl p-10 text-center space-y-3">
          <p className="text-base font-bold text-[#F3F4F6]">
            По вашему запросу ничего не найдено
          </p>
          <p className="text-xs text-[#9CA3AF]">
            Попробуйте сбросить фильтры или изменить поисковый запрос
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-[#8B5CF6] text-white text-xs font-semibold"
          >
            Показать все алгоритмы
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAlgorithms.map((alg) => (
            <div
              key={alg.id}
              className="bg-[#171D29] border border-white/10 hover:border-[#8B5CF6]/50 rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xl font-extrabold text-[#F3F4F6]">
                        {alg.nameEn}
                      </h2>
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
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
                    <p className="text-sm font-medium text-[#8B5CF6] mt-0.5">
                      {alg.nameRu}
                    </p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                  {alg.shortDescription}
                </p>

                {/* Сетка сложностей и свойств */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#121620] border border-white/5">
                    <div className="text-[10px] text-[#9CA3AF]">Лучший</div>
                    <div className="font-mono font-bold text-[#22C55E] mt-0.5">
                      {alg.bestComplexity}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#121620] border border-white/5">
                    <div className="text-[10px] text-[#9CA3AF]">Средний</div>
                    <div className="font-mono font-bold text-[#F59E0B] mt-0.5">
                      {alg.averageComplexity.split(' ')[0]}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#121620] border border-white/5">
                    <div className="text-[10px] text-[#9CA3AF]">Худший</div>
                    <div className="font-mono font-bold text-[#EF4444] mt-0.5">
                      {alg.worstComplexity.split(' ')[0]}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#121620] border border-white/5">
                    <div className="text-[10px] text-[#9CA3AF]">Доп. память</div>
                    <div className="font-mono font-bold text-[#06B6D4] mt-0.5">
                      {alg.spaceComplexity}
                    </div>
                  </div>
                </div>

                {/* Теги устойчивости и in-place */}
                <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                  <span className="inline-flex items-center gap-1.5 text-[#F3F4F6]">
                    {alg.stable ? (
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#EF4444]" />
                    )}
                    <span>{alg.stable ? 'Устойчивый' : 'Неустойчивый'}</span>
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-[#F3F4F6]">
                    {alg.inPlace ? (
                      <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                    ) : (
                      <XCircle className="w-4 h-4 text-[#F59E0B]" />
                    )}
                    <span>
                      {alg.inPlace ? 'Сортировка на месте (In-place)' : 'Требует доп. память'}
                    </span>
                  </span>
                </div>
              </div>

              {/* Кнопки действий */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => navigate(`/lab?algorithm=${alg.id}`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-semibold transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Попробовать в лаборатории</span>
                </button>

                <Link
                  to={`/algorithms/${alg.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#121620] hover:bg-white/10 border border-white/15 text-[#F3F4F6] text-xs font-semibold transition-colors"
                >
                  <span>Полный разбор и код</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#06B6D4]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Сводная таблица сложности всех 8 алгоритмов */}
      <ComplexityTable />
    </div>
  );
};

