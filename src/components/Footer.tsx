import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Cpu, FlaskConical, GitCompare, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#121620] border-t border-white/10 text-[#9CA3AF] mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О проекте и логотип */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#171D29] border border-[#8B5CF6]/40 flex items-end justify-center gap-1 p-1.5">
                <span className="w-1.5 h-2.5 bg-[#8B5CF6] rounded-t-sm" />
                <span className="w-1.5 h-4 bg-[#06B6D4] rounded-t-sm" />
                <span className="w-1.5 h-3 bg-[#8B5CF6] rounded-t-sm" />
                <span className="w-1.5 h-5 bg-[#22C55E] rounded-t-sm" />
              </div>
              <div>
                <div className="text-base font-extrabold text-[#F3F4F6] leading-none">
                  SORT<span className="text-[#8B5CF6]">LAB</span>
                </div>
                <div className="text-[10px] font-mono tracking-widest text-[#9CA3AF]">
                  ALGORITHM VISUALIZER
                </div>
              </div>
            </Link>
            <p className="text-sm text-[#9CA3AF] max-w-md leading-relaxed">
              Виртуальная образовательная лаборатория для наглядного изучения, пошаговой трассировки и экспериментального сравнения алгоритмов сортировки массивов.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-[#171D29] border border-white/10 text-[#F3F4F6]">
                Дисциплина: «Алгоритмы и структуры данных»
              </span>
              <span className="px-2.5 py-1 rounded-md bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6]">
                Учебный проект
              </span>
            </div>
          </div>

          {/* Навигация: Лаборатория и Алгоритмы */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#F3F4F6] uppercase tracking-wider">
              Инструменты
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/lab" className="hover:text-[#F3F4F6] inline-flex items-center gap-2 transition-colors">
                  <FlaskConical className="w-4 h-4 text-[#8B5CF6]" />
                  Лаборатория сортировки
                </Link>
              </li>
              <li>
                <Link to="/algorithms" className="hover:text-[#F3F4F6] inline-flex items-center gap-2 transition-colors">
                  <Cpu className="w-4 h-4 text-[#06B6D4]" />
                  Каталог алгоритмов (8)
                </Link>
              </li>
              <li>
                <Link to="/comparison" className="hover:text-[#F3F4F6] inline-flex items-center gap-2 transition-colors">
                  <GitCompare className="w-4 h-4 text-[#22C55E]" />
                  Сравнение алгоритмов
                </Link>
              </li>
            </ul>
          </div>

          {/* Навигация: Обучение */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-[#F3F4F6] uppercase tracking-wider">
              Обучение и проверка
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/theory" className="hover:text-[#F3F4F6] inline-flex items-center gap-2 transition-colors">
                  <BookOpen className="w-4 h-4 text-[#F59E0B]" />
                  Теоретический раздел
                </Link>
              </li>
              <li>
                <Link to="/practice" className="hover:text-[#F3F4F6] inline-flex items-center gap-2 transition-colors">
                  <GraduationCap className="w-4 h-4 text-[#8B5CF6]" />
                  Практические задания
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-[#F3F4F6] transition-colors block">
                  Тестирование знаний
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#F3F4F6] transition-colors block">
                  О проекте SORTLAB
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9CA3AF]">
          <div>
            © {currentYear} SORTLAB — Лаборатория алгоритмов сортировки. Учебный проект.
          </div>
          <div>
            Дисциплина: «Алгоритмы и структуры данных»
          </div>
        </div>
      </div>
    </footer>
  );
};

