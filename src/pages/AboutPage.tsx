import React from 'react';
import {
  Info,
  Target,
  CheckSquare,
  GraduationCap,
  Code2,
} from 'lucide-react';

const PROJECT_TASKS = [
  'Изучить основные алгоритмы сортировки.',
  'Реализовать визуализацию их работы.',
  'Разработать средства управления выполнением.',
  'Организовать сбор статистики.',
  'Реализовать сравнительный анализ.',
  'Создать обучающие материалы и практические задания.',
];

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Заголовок и основное описание из спецификации */}
      <div className="bg-[#171D29] border border-white/10 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-xs font-semibold text-[#8B5CF6]">
          <Info className="w-3.5 h-3.5" />
          <span>Паспорт учебного проекта</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F3F4F6]">
          О проекте SORTLAB
        </h1>

        <p className="text-sm sm:text-base text-[#F3F4F6]/90 leading-relaxed">
          SORTLAB — учебный веб-проект, посвящённый визуализации и изучению алгоритмов сортировки. Проект помогает понять принципы работы алгоритмов, сравнить их вычислительную сложность и исследовать влияние входных данных на производительность.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-5 rounded-2xl bg-[#121620] border border-white/10 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#06B6D4] flex items-center gap-2">
              <GraduationCap className="w-4 h-4" />
              <span>Учебная дисциплина</span>
            </div>
            <div className="text-base sm:text-lg font-bold text-[#F3F4F6]">
              «Алгоритмы и структуры данных»
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121620] border border-white/10 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#8B5CF6] flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span>Цель проекта</span>
            </div>
            <p className="text-xs sm:text-sm text-[#F3F4F6] leading-relaxed">
              Разработка интерактивного инструмента для изучения алгоритмов сортировки посредством визуализации, пошагового выполнения и экспериментального сравнения.
            </p>
          </div>
        </div>

        {/* Задачи проекта */}
        <div className="space-y-3 pt-2">
          <h2 className="text-base sm:text-lg font-bold text-[#F3F4F6] flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#22C55E]" />
            <span>Задачи проекта</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROJECT_TASKS.map((task, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#121620] border border-white/5 flex items-center gap-3 text-xs sm:text-sm text-[#F3F4F6]"
              >
                <span className="w-6 h-6 rounded-lg bg-[#22C55E]/15 border border-[#22C55E]/40 text-[#22C55E] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <span>{task}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Технологический стек */}
      <div className="bg-[#171D29] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4">
        <h2 className="text-lg font-bold text-[#F3F4F6] flex items-center gap-2">
          <Code2 className="w-5 h-5 text-[#06B6D4]" />
          <span>Используемые технологии и архитектура</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-[#121620] border border-white/5">
            <div className="font-bold text-[#F3F4F6]">React 18 + TypeScript</div>
            <div className="text-[#9CA3AF] mt-1">Строгая типизация событий и компонентов</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#121620] border border-white/5">
            <div className="font-bold text-[#F3F4F6]">Vite + Docker</div>
            <div className="text-[#9CA3AF] mt-1">Быстрая сборка и контейнеризация</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#121620] border border-white/5">
            <div className="font-bold text-[#F3F4F6]">Tailwind CSS</div>
            <div className="text-[#9CA3AF] mt-1">Адаптивная дизайн-система</div>
          </div>
          <div className="p-3.5 rounded-xl bg-[#121620] border border-white/5">
            <div className="font-bold text-[#F3F4F6]">Recharts + Lucide</div>
            <div className="text-[#9CA3AF] mt-1">Экспериментальные графики и иконки</div>
          </div>
        </div>
      </div>
    </div>
  );
};

