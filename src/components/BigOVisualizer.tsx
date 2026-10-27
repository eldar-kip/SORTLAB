import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { generateBigOCurveData } from '../utils/complexity';
import { TrendingUp, Info } from 'lucide-react';

export const BigOVisualizer: React.FC = () => {
  const [maxN, setMaxN] = useState<number>(30);
  const [showQuadratic, setShowQuadratic] = useState<boolean>(true);

  const data = useMemo(() => generateBigOCurveData(maxN), [maxN]);
  const lastPoint = data[data.length - 1];

  return (
    <div className="bg-[#171D29] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#F3F4F6] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#8B5CF6]" />
            <span>Интерактивная визуализация роста сложности Big O</span>
          </h3>
          <p className="text-xs text-[#9CA3AF] mt-1">
            График демонстрирует математический порядок роста условного числа элементарных операций при увеличении n, а не реальные секунды выполнения конкретного алгоритма.
          </p>
        </div>

        {/* Управление n */}
        <div className="flex flex-wrap items-center gap-4 bg-[#121620] p-3 rounded-xl border border-white/10 shrink-0">
          <div className="space-y-1 min-w-[180px]">
            <div className="flex justify-between text-xs">
              <span className="text-[#9CA3AF]">Размер входа n:</span>
              <span className="font-mono font-bold text-[#06B6D4]">n = {maxN}</span>
            </div>
            <input
              type="range"
              min={5}
              max={100}
              value={maxN}
              onChange={(e) => setMaxN(Number(e.target.value))}
              className="w-full h-2 bg-[#0B0D12] rounded-lg appearance-none cursor-pointer accent-[#8B5CF6]"
            />
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-[#F3F4F6] cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showQuadratic}
              onChange={(e) => setShowQuadratic(e.target.checked)}
              className="rounded accent-[#EF4444]"
            />
            <span>Показать O(n²)</span>
          </label>
        </div>
      </div>

      {/* Значения при текущем n */}
      {lastPoint && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-xs">
          <div className="p-2.5 rounded-xl bg-[#121620] border border-[#22C55E]/30">
            <div className="text-[#9CA3AF]">O(1) — константная</div>
            <div className="text-base font-mono font-bold text-[#22C55E] mt-0.5">
              {lastPoint.O1} оп.
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#121620] border border-[#06B6D4]/30">
            <div className="text-[#9CA3AF]">O(log₂ n) — логарифм.</div>
            <div className="text-base font-mono font-bold text-[#06B6D4] mt-0.5">
              {lastPoint.OlogN} оп.
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#121620] border border-[#8B5CF6]/30">
            <div className="text-[#9CA3AF]">O(n) — линейная</div>
            <div className="text-base font-mono font-bold text-[#8B5CF6] mt-0.5">
              {lastPoint.On} оп.
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#121620] border border-[#F59E0B]/30">
            <div className="text-[#9CA3AF]">O(n log₂ n) — лин.-лог.</div>
            <div className="text-base font-mono font-bold text-[#F59E0B] mt-0.5">
              {lastPoint.OnLogN} оп.
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-[#121620] border border-[#EF4444]/30 col-span-2 sm:col-span-1">
            <div className="text-[#9CA3AF]">O(n²) — квадратичная</div>
            <div className="text-base font-mono font-bold text-[#EF4444] mt-0.5">
              {lastPoint.On2} оп.
            </div>
          </div>
        </div>
      )}

      {/* График Recharts */}
      <div className="h-[320px] w-full bg-[#121620] rounded-xl border border-white/5 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
            <XAxis
              dataKey="n"
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
              label={{ value: 'Размер массива n', position: 'insideBottomRight', offset: -5, fill: '#9CA3AF', fontSize: 11 }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: '#9CA3AF', fontSize: 11 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#171D29',
                borderColor: 'rgba(139, 92, 246, 0.4)',
                borderRadius: '12px',
                color: '#F3F4F6',
                fontSize: '12px',
              }}
              labelFormatter={(val) => `Размер массива n = ${val}`}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
            <Line
              type="monotone"
              dataKey="O1"
              name="O(1)"
              stroke="#22C55E"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="OlogN"
              name="O(log n)"
              stroke="#06B6D4"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="On"
              name="O(n)"
              stroke="#8B5CF6"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="OnLogN"
              name="O(n log n)"
              stroke="#F59E0B"
              strokeWidth={2.5}
              dot={false}
            />
            {showQuadratic && (
              <Line
                type="monotone"
                dataKey="On2"
                name="O(n²)"
                stroke="#EF4444"
                strokeWidth={2.5}
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#121620] border border-white/5 text-xs text-[#9CA3AF]">
        <Info className="w-4 h-4 text-[#06B6D4] shrink-0 mt-0.5" />
        <span>
          Совет: отключите галочку <strong>«Показать O(n²)&raquo;</strong>, чтобы детально рассмотреть соотношение между линейной <strong>O(n)</strong> и линейно-логарифмической <strong>O(n log n)</strong> кривыми при больших значениях n.
        </span>
      </div>
    </div>
  );
};

