import React, { useState, useEffect } from 'react';
import {
  Info,
  Target,
  CheckSquare,
  GraduationCap,
  Code2,
  UserCheck,
  Save,
  Check,
} from 'lucide-react';

const AUTHOR_STORAGE_KEY = 'sortlab_project_card_v1';

interface ProjectCardFields {
  studentName: string;
  groupName: string;
  universityName: string;
  SupervisorName: string;
}

const DEFAULT_FIELDS: ProjectCardFields = {
  studentName: '',
  groupName: '',
  universityName: '',
  SupervisorName: '',
};

const PROJECT_TASKS = [
  'Изучить основные алгоритмы сортировки.',
  'Реализовать визуализацию их работы.',
  'Разработать средства управления выполнением.',
  'Организовать сбор статистики.',
  'Реализовать сравнительный анализ.',
  'Создать обучающие материалы и практические задания.',
];

export const AboutPage: React.FC = () => {
  const [fields, setFields] = useState<ProjectCardFields>(() => {
    try {
      const saved = localStorage.getItem(AUTHOR_STORAGE_KEY);
      return saved ? { ...DEFAULT_FIELDS, ...JSON.parse(saved) } : DEFAULT_FIELDS;
    } catch {
      return DEFAULT_FIELDS;
    }
  });
  const [savedNotice, setSavedNotice] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(AUTHOR_STORAGE_KEY, JSON.stringify(fields));
    } catch {
      // Ignore storage error
    }
  }, [fields]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

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

      {/* Поля для самостоятельного заполнения данных автора/университета */}
      <div className="bg-[#171D29] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-[#F3F4F6] flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#8B5CF6]" />
            <span>Карточка исполнителя (для заполнения перед защитой работы)</span>
          </h2>
          <p className="text-xs text-[#9CA3AF]">
            Поля ниже предназначены для самостоятельного заполнения студентом и автоматически сохраняются в браузере.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#9CA3AF]">
                ФИО студента (исполнителя):
              </label>
              <input
                type="text"
                value={fields.studentName}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, studentName: e.target.value }))
                }
                placeholder="[Введите ФИО автора проекта]"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121620] border border-white/15 text-sm text-[#F3F4F6] placeholder-[#9CA3AF]/50 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#9CA3AF]">
                Учебная группа / направление:
              </label>
              <input
                type="text"
                value={fields.groupName}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, groupName: e.target.value }))
                }
                placeholder="[Введите номер группы / курс]"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121620] border border-white/15 text-sm text-[#F3F4F6] placeholder-[#9CA3AF]/50 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#9CA3AF]">
                Учебное заведение / кафедра:
              </label>
              <input
                type="text"
                value={fields.universityName}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, universityName: e.target.value }))
                }
                placeholder="[Введите название вуза и кафедры]"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121620] border border-white/15 text-sm text-[#F3F4F6] placeholder-[#9CA3AF]/50 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#9CA3AF]">
                Научный руководитель / преподаватель:
              </label>
              <input
                type="text"
                value={fields.SupervisorName}
                onChange={(e) =>
                  setFields((prev) => ({ ...prev, SupervisorName: e.target.value }))
                }
                placeholder="[Введите ФИО преподавателя]"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121620] border border-white/15 text-sm text-[#F3F4F6] placeholder-[#9CA3AF]/50 focus:outline-none focus:border-[#8B5CF6]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Сохранить данные</span>
            </button>

            {savedNotice && (
              <span className="inline-flex items-center gap-1.5 text-xs text-[#22C55E]">
                <Check className="w-4 h-4" /> Данные сохранены в браузере
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

