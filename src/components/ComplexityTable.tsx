import React, { useState } from 'react';
import { ALGORITHMS_DATA } from '../data/algorithms';
import { Check, X, Info, Table2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TooltipTerm } from './TooltipTerm';

export const ComplexityTable: React.FC = () => {
  const [detailedMode, setDetailedMode] = useState<boolean>(false);

  return (
    <div className="bg-[#171D29] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#F3F4F6] flex items-center gap-2">
            <Table2 className="w-5 h-5 text-[#8B5CF6]" />
            <span>Сводная таблица сложности всех 8 алгоритмов</span>
          </h3>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            Теоретические оценки времени (<TooltipTerm termKey="bigO">Big O</TooltipTerm>), памяти,{' '}
            <TooltipTerm termKey="stability">устойчивости</TooltipTerm> и работы{' '}
            <TooltipTerm termKey="inPlace">на месте (in-place)</TooltipTerm>
          </p>
        </div>

        {/* Переключатель краткого / подробного объяснения характеристик */}
        <div className="inline-flex items-center rounded-xl bg-[#121620] p-1 border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setDetailedMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !detailedMode
                ? 'bg-[#8B5CF6] text-white'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            Краткий вид
          </button>
          <button
            type="button"
            onClick={() => setDetailedMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              detailedMode
                ? 'bg-[#8B5CF6] text-white'
                : 'text-[#9CA3AF] hover:text-[#F3F4F6]'
            }`}
          >
            Подробные пояснения
          </button>
        </div>
      </div>

      {/* Адаптивная таблица */}
      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-left border-collapse min-w-[760px]">
          <thead>
            <tr className="bg-[#121620] border-b border-white/10 text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
              <th className="py-3.5 px-4">Алгоритм</th>
              <th className="py-3.5 px-4">Лучший случай</th>
              <th className="py-3.5 px-4">Средний случай</th>
              <th className="py-3.5 px-4">Худший случай</th>
              <th className="py-3.5 px-4">Доп. память</th>
              <th className="py-3.5 px-4">Устойчивость</th>
              <th className="py-3.5 px-4">На месте (In-place)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
            {ALGORITHMS_DATA.map((alg) => (
              <tr
                key={alg.id}
                className="hover:bg-white/[0.03] transition-colors align-top"
              >
                <td className="py-3.5 px-4">
                  <Link
                    to={`/algorithms/${alg.id}`}
                    className="font-bold text-[#F3F4F6] hover:text-[#8B5CF6] transition-colors block"
                  >
                    {alg.nameEn}
                  </Link>
                  <span className="text-xs text-[#9CA3AF]">{alg.nameRu}</span>
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-block font-mono font-semibold px-2 py-0.5 rounded bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
                    {alg.bestComplexity}
                  </span>
                  {detailedMode && alg.bestComplexityNote && (
                    <p className="text-[11px] text-[#9CA3AF] mt-1.5 max-w-[180px] leading-relaxed">
                      {alg.bestComplexityNote}
                    </p>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-block font-mono font-semibold px-2 py-0.5 rounded bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30">
                    {alg.averageComplexity}
                  </span>
                  {detailedMode && alg.averageComplexityNote && (
                    <p className="text-[11px] text-[#9CA3AF] mt-1.5 max-w-[190px] leading-relaxed">
                      {alg.averageComplexityNote}
                    </p>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-block font-mono font-semibold px-2 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30">
                    {alg.worstComplexity}
                  </span>
                  {detailedMode && alg.worstComplexityNote && (
                    <p className="text-[11px] text-[#9CA3AF] mt-1.5 max-w-[200px] leading-relaxed">
                      {alg.worstComplexityNote}
                    </p>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  <span className="inline-block font-mono font-semibold px-2 py-0.5 rounded bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30">
                    {alg.spaceComplexity}
                  </span>
                  {detailedMode && alg.spaceComplexityNote && (
                    <p className="text-[11px] text-[#9CA3AF] mt-1.5 max-w-[180px] leading-relaxed">
                      {alg.spaceComplexityNote}
                    </p>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  {alg.stable ? (
                    <span className="inline-flex items-center gap-1 text-[#22C55E] font-medium">
                      <Check className="w-4 h-4" /> Да
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#EF4444] font-medium">
                      <X className="w-4 h-4" /> Нет
                    </span>
                  )}
                  {detailedMode && (
                    <p className="text-[11px] text-[#9CA3AF] mt-1.5 max-w-[180px] leading-relaxed">
                      {alg.stableNote}
                    </p>
                  )}
                </td>

                <td className="py-3.5 px-4">
                  {alg.inPlace ? (
                    <span className="inline-flex items-center gap-1 text-[#22C55E] font-medium">
                      <Check className="w-4 h-4" /> Да
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[#F59E0B] font-medium">
                      <X className="w-4 h-4" /> Нет
                    </span>
                  )}
                  {detailedMode && (
                    <p className="text-[11px] text-[#9CA3AF] mt-1.5 max-w-[180px] leading-relaxed">
                      {alg.inPlaceNote}
                    </p>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Важные примечания к оценкам */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-[#9CA3AF] pt-1">
        <div className="p-3 rounded-xl bg-[#121620] border border-white/5 flex items-start gap-2">
          <Info className="w-4 h-4 text-[#8B5CF6] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#F3F4F6]">Shell Sort:</strong> временная сложность зависит от выбранной последовательности шагов gap (от O(n²) для шагов Шелла до O(n log² n) для шагов Пратта).
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#121620] border border-white/5 flex items-start gap-2">
          <Info className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#F3F4F6]">Quick Sort:</strong> память расходуется на стек рекурсии и зависит от глубины разбиений: в среднем O(log n), в худшем случае — O(n).
          </span>
        </div>
        <div className="p-3 rounded-xl bg-[#121620] border border-white/5 flex items-start gap-2">
          <Info className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#F3F4F6]">Counting Sort:</strong> сложность O(n + k) и память O(n + k) зависят от размера диапазона целых значений k = max - min + 1.
          </span>
        </div>
      </div>
    </div>
  );
};

