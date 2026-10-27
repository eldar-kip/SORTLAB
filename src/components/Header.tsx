import React, { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Play, Sparkles } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Главная', end: true },
  { to: '/lab', label: 'Лаборатория' },
  { to: '/algorithms', label: 'Алгоритмы' },
  { to: '/comparison', label: 'Сравнение' },
  { to: '/theory', label: 'Теория' },
  { to: '/practice', label: 'Практика' },
  { to: '/quiz', label: 'Тестирование' },
  { to: '/about', label: 'О проекте' },
];

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0B0D12]/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Логотип */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded-lg"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#06B6D4]/20 border border-[#8B5CF6]/40 flex items-end justify-center gap-1 p-2 shadow-glow-purple group-hover:border-[#8B5CF6] transition-colors">
            <span className="w-1.5 h-3 bg-[#8B5CF6] rounded-t-sm transition-all duration-300 group-hover:h-5" />
            <span className="w-1.5 h-5 bg-[#06B6D4] rounded-t-sm transition-all duration-300 group-hover:h-3" />
            <span className="w-1.5 h-4 bg-[#8B5CF6] rounded-t-sm transition-all duration-300 group-hover:h-6" />
            <span className="w-1.5 h-6 bg-[#22C55E] rounded-t-sm transition-all duration-300 group-hover:h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-[#F3F4F6] leading-none">
              SORT<span className="text-[#8B5CF6]">LAB</span>
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#9CA3AF] mt-0.5">
              ALGORITHM VISUALIZER
            </span>
          </div>
        </Link>

        {/* Навигация для широких экранов */}
        <nav className="hidden xl:flex items-center gap-1" aria-label="Основная навигация">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#8B5CF6]/15 text-[#F3F4F6] border border-[#8B5CF6]/40 shadow-sm'
                    : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5 border border-transparent'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Кнопка Начать изучение */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => navigate('/lab')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white text-sm font-semibold shadow-glow-purple transition-all duration-200 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Начать изучение</span>
          </button>
        </div>

        {/* Кнопка мобильного меню */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="xl:hidden inline-flex items-center justify-center p-2 rounded-lg text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          aria-expanded={mobileMenuOpen}
          aria-label="Открыть меню навигации"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Мобильное меню */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#121620] border-b border-white/10 px-4 pt-3 pb-5 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#8B5CF6]/20 text-[#F3F4F6] border border-[#8B5CF6]/40'
                      : 'text-[#9CA3AF] hover:text-[#F3F4F6] hover:bg-white/5 border border-white/5'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/lab');
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#06B6D4] text-white text-sm font-semibold shadow-glow-purple"
            >
              <Sparkles className="w-4 h-4" />
              <span>Начать изучение в лаборатории</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

