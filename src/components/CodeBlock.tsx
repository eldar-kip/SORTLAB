import React, { useState } from 'react';
import { CodeSnippets } from '../types/algorithm';
import { Code2, Copy, Check, BookOpen } from 'lucide-react';

interface CodeBlockProps {
  algorithmName: string;
  code: CodeSnippets;
}

type CodeLang = 'typescript' | 'javascript' | 'pseudocode';

export const CodeBlock: React.FC<CodeBlockProps> = ({ algorithmName, code }) => {
  const [activeLang, setActiveLang] = useState<CodeLang>('typescript');
  const [copied, setCopied] = useState<boolean>(false);

  const currentSource =
    activeLang === 'typescript'
      ? code.typescript
      : activeLang === 'javascript'
      ? code.javascript
      : code.pseudocode;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentSource);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback copy
      const textarea = document.createElement('textarea');
      textarea.value = currentSource;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = currentSource.split('\n');

  return (
    <div className="bg-[#171D29] border border-white/10 rounded-2xl overflow-hidden">
      {/* Шапка блока кода */}
      <div className="px-4 sm:px-5 py-3 bg-[#121620] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-sm font-bold text-[#F3F4F6]">
            Реализация алгоритма: {algorithmName}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Переключатель форматов: Псевдокод / JavaScript / TypeScript */}
          <div className="inline-flex rounded-lg bg-[#0B0D12] p-0.5 border border-white/10">
            <button
              type="button"
              onClick={() => setActiveLang('pseudocode')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeLang === 'pseudocode'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              Псевдокод
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('javascript')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeLang === 'javascript'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              JavaScript
            </button>
            <button
              type="button"
              onClick={() => setActiveLang('typescript')}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                activeLang === 'typescript'
                  ? 'bg-[#8B5CF6] text-white'
                  : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
              }`}
            >
              TypeScript
            </button>
          </div>

          {/* Кнопка Скопировать код */}
          <button
            type="button"
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              copied
                ? 'bg-[#22C55E]/20 border-[#22C55E] text-[#22C55E]'
                : 'bg-[#171D29] hover:bg-white/10 border-white/15 text-[#F3F4F6]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Код скопирован!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#06B6D4]" />
                <span>Скопировать код</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Тело кода с номерами строк */}
      <div className="p-4 bg-[#0B0D12] overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed">
        <table className="w-full border-collapse">
          <tbody>
            {lines.map((line, idx) => (
              <tr key={idx} className="hover:bg-white/[0.03]">
                <td className="select-none pr-4 text-right text-[#9CA3AF]/50 w-8 align-top">
                  {idx + 1}
                </td>
                <td className="text-[#F3F4F6] whitespace-pre">{line || ' '}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Краткое объяснение основных строк */}
      <div className="p-4 sm:p-5 bg-[#121620] border-t border-white/10 space-y-2.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#06B6D4]" />
          <span>Пояснение ключевых блоков кода</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {code.lineExplanations.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-[#171D29] border border-white/5 space-y-1"
            >
              <div className="text-xs font-mono font-bold text-[#8B5CF6]">
                {item.lines}
              </div>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                {item.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

