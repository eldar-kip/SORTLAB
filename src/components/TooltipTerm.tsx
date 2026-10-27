import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';
import { GLOSSARY_TERMS } from '../data/glossary';

interface TooltipTermProps {
  termKey: keyof typeof GLOSSARY_TERMS;
  children?: React.ReactNode;
}

export const TooltipTerm: React.FC<TooltipTermProps> = ({ termKey, children }) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const info = GLOSSARY_TERMS[termKey];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  if (!info) return <>{children}</>;

  return (
    <span
      ref={containerRef}
      className="relative inline-flex items-center gap-1 cursor-help border-b border-dashed border-[#8B5CF6] text-[#F3F4F6] hover:text-[#06B6D4] transition-colors"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onClick={() => setOpen((prev) => !prev)}
      tabIndex={0}
      role="button"
      aria-label={`Подсказка: ${info.term}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setOpen((prev) => !prev);
        }
      }}
    >
      <span>{children || info.term}</span>
      <HelpCircle className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />

      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 rounded-xl bg-[#171D29] border border-[#8B5CF6]/50 shadow-2xl text-left z-50 pointer-events-none"
        >
          <span className="block text-xs font-bold text-[#8B5CF6] mb-1">
            {info.term}
          </span>
          <span className="block text-xs text-[#F3F4F6] leading-relaxed">
            {info.shortDefinition}
          </span>
          {info.example && (
            <span className="block text-[11px] text-[#9CA3AF] mt-1.5 pt-1.5 border-t border-white/10 italic">
              {info.example}
            </span>
          )}
        </span>
      )}
    </span>
  );
};

