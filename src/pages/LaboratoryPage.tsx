import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSortingVisualizer } from '../hooks/useSortingVisualizer';
import { AlgorithmSelector } from '../components/AlgorithmSelector';
import { ArrayControls } from '../components/ArrayControls';
import { BarChartVisualizer } from '../components/BarChartVisualizer';
import { PlaybackControls } from '../components/PlaybackControls';
import { StepExplanation } from '../components/StepExplanation';
import { StatisticsPanel } from '../components/StatisticsPanel';
import { CodeBlock } from '../components/CodeBlock';
import { PredictNextStepWidget } from '../components/PredictNextStepWidget';
import { getAlgorithmById } from '../data/algorithms';
import { AlgorithmId } from '../types/algorithm';
import { exportExperimentsToCsv } from '../utils/statistics';
import {
  FlaskConical,
  Sparkles,
  History,
  Download,
  Trash2,
  RotateCcw,
  BrainCircuit,
  Wand2,
} from 'lucide-react';

const VALID_ALGORITHMS: AlgorithmId[] = [
  'bubble',
  'selection',
  'insertion',
  'merge',
  'quick',
  'heap',
  'shell',
  'counting',
];

export const LaboratoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [showPredictMode, setShowPredictMode] = useState<boolean>(false);

  const {
    algorithmId,
    setAlgorithmId,
    arraySize,
    setArraySize,
    speedMs,
    setSpeedMs,
    order,
    setOrder,
    pivotStrategy,
    setPivotStrategy,
    preset,
    initialArray,
    currentStep,
    currentStepIndex,
    totalSteps,
    status,
    computeTimeMs,
    animationElapsedMs,
    warning,
    history,
    start,
    pause,
    resume,
    nextStep,
    prevStep,
    reset,
    shuffle,
    generateNewArray,
    setCustomArray,
    jumpToStep,
    restoreExperiment,
    clearHistory,
  } = useSortingVisualizer();

  // Поддержка перехода из каталога с параметром ?algorithm=...
  useEffect(() => {
    const paramAlg = searchParams.get('algorithm') as AlgorithmId | null;
    if (paramAlg && VALID_ALGORITHMS.includes(paramAlg)) {
      setAlgorithmId(paramAlg);
    }
  }, [searchParams, setAlgorithmId]);

  const currentAlgInfo = getAlgorithmById(algorithmId);

  // Готовые демонстрационные сценарии (Раздел 26)
  const runDemoScenario = (scenarioId: string) => {
    if (scenarioId === 'random-quick') {
      setAlgorithmId('quick');
      setOrder('asc');
      setSpeedMs(140);
      generateNewArray('random', 25);
    } else if (scenarioId === 'nearly-insertion') {
      setAlgorithmId('insertion');
      setOrder('asc');
      setSpeedMs(160);
      generateNewArray('nearly-sorted', 24);
    } else if (scenarioId === 'reversed-bubble') {
      setAlgorithmId('bubble');
      setOrder('asc');
      setSpeedMs(80);
      generateNewArray('reversed', 16);
    } else if (scenarioId === 'duplicates-counting') {
      setAlgorithmId('counting');
      setOrder('asc');
      setSpeedMs(150);
      generateNewArray('duplicates', 25);
    } else if (scenarioId === 'compare-redirect') {
      navigate('/comparison');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Заголовок лаборатории */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-xs font-semibold text-[#8B5CF6] mb-2">
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Интерактивный стенд</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#F3F4F6]">
            Лаборатория сортировки
          </h1>
          <p className="text-sm sm:text-base text-[#9CA3AF] mt-1">
            Настраивай массив, запускай алгоритмы и наблюдай за их работой в реальном времени
          </p>
        </div>

        {/* Переключатель тренажёра «Угадай следующий шаг» */}
        <button
          type="button"
          onClick={() => setShowPredictMode((prev) => !prev)}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all self-start md:self-auto ${
            showPredictMode
              ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-glow-purple'
              : 'bg-[#171D29] hover:bg-white/10 border-[#8B5CF6]/40 text-[#F3F4F6]'
          }`}
        >
          <BrainCircuit className="w-4 h-4 text-[#06B6D4]" />
          <span>
            {showPredictMode
              ? 'Скрыть режим «Угадай следующий шаг»'
              : 'Режим «Угадай следующий шаг»'}
          </span>
        </button>
      </div>

      {/* Быстрые демонстрационные сценарии в один клик */}
      <div className="bg-[#121620] border border-white/10 rounded-2xl p-3.5 flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#9CA3AF] flex items-center gap-1.5 mr-1">
          <Wand2 className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Готовые сценарии:</span>
        </span>
        <button
          type="button"
          onClick={() => runDemoScenario('random-quick')}
          className="px-3 py-1.5 rounded-lg bg-[#171D29] hover:bg-[#8B5CF6]/20 border border-white/10 hover:border-[#8B5CF6]/40 text-xs text-[#F3F4F6] transition-colors"
        >
          Случайный массив (Quick Sort)
        </button>
        <button
          type="button"
          onClick={() => runDemoScenario('nearly-insertion')}
          className="px-3 py-1.5 rounded-lg bg-[#171D29] hover:bg-[#22C55E]/20 border border-white/10 hover:border-[#22C55E]/40 text-xs text-[#F3F4F6] transition-colors"
        >
          Почти упорядоченный (Insertion Sort за O(n))
        </button>
        <button
          type="button"
          onClick={() => runDemoScenario('reversed-bubble')}
          className="px-3 py-1.5 rounded-lg bg-[#171D29] hover:bg-[#EF4444]/20 border border-white/10 hover:border-[#EF4444]/40 text-xs text-[#F3F4F6] transition-colors"
        >
          Обратный порядок (Худший случай Bubble Sort)
        </button>
        <button
          type="button"
          onClick={() => runDemoScenario('duplicates-counting')}
          className="px-3 py-1.5 rounded-lg bg-[#171D29] hover:bg-[#06B6D4]/20 border border-white/10 hover:border-[#06B6D4]/40 text-xs text-[#F3F4F6] transition-colors"
        >
          Много дубликатов (Counting Sort)
        </button>
        <button
          type="button"
          onClick={() => runDemoScenario('compare-redirect')}
          className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/30 border border-[#8B5CF6]/40 text-xs font-medium text-[#8B5CF6] transition-colors"
        >
          Сравнить простой и эффективный алгоритм →
        </button>
      </div>

      {/* Интерактивный режим «Угадай следующий шаг» (при активации) */}
      {showPredictMode && <PredictNextStepWidget />}

      {/* 7.1 Панель выбора алгоритма */}
      <AlgorithmSelector
        selectedId={algorithmId}
        onSelect={setAlgorithmId}
        pivotStrategy={pivotStrategy}
        onPivotStrategyChange={setPivotStrategy}
      />

      {/* 7.2 – 7.5 Настройки массива, скорости и порядка */}
      <ArrayControls
        arraySize={arraySize}
        onSizeChange={setArraySize}
        speedMs={speedMs}
        onSpeedChange={setSpeedMs}
        order={order}
        onOrderChange={setOrder}
        preset={preset}
        onGeneratePreset={(newPreset) => generateNewArray(newPreset, arraySize)}
        onApplyCustomArray={(customArr) => setCustomArray(customArr, 'custom')}
        currentArray={initialArray}
      />

      {/* 7.6 Главная область визуализации массива */}
      <BarChartVisualizer
        step={currentStep}
        algorithmId={algorithmId}
        status={status}
      />

      {/* 8. Панель управления сортировкой */}
      <PlaybackControls
        status={status}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        onStart={start}
        onPause={pause}
        onResume={resume}
        onNextStep={nextStep}
        onPrevStep={prevStep}
        onReset={reset}
        onShuffle={shuffle}
        onJumpToStep={jumpToStep}
      />

      {/* 9. Пошаговое объяснение («Что происходит сейчас?») */}
      <StepExplanation
        step={currentStep}
        totalSteps={totalSteps}
        status={status}
        warning={warning}
      />

      {/* 10. Статистика в реальном времени */}
      <StatisticsPanel
        step={currentStep}
        totalSteps={totalSteps}
        arrayLength={initialArray.length}
        status={status}
        computeTimeMs={computeTimeMs}
        animationElapsedMs={animationElapsedMs}
        algorithmId={algorithmId}
      />

      {/* 19. Примеры кода выбранного алгоритма */}
      <CodeBlock algorithmName={currentAlgInfo.fullName} code={currentAlgInfo.code} />

      {/* 26. История экспериментов и экспорт в CSV */}
      <div className="bg-[#171D29] border border-white/10 rounded-2xl p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#F3F4F6] flex items-center gap-2">
              <History className="w-5 h-5 text-[#8B5CF6]" />
              <span>Журнал проведённых экспериментов</span>
            </h3>
            <p className="text-xs text-[#9CA3AF] mt-0.5">
              Автоматически сохраняет результаты завершённых запусков. Вы можете повторить любой эксперимент или выгрузить отчёт в CSV.
            </p>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => exportExperimentsToCsv(history)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#22C55E]/20 hover:bg-[#22C55E]/30 border border-[#22C55E]/40 text-xs font-semibold text-[#22C55E] transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Экспорт в CSV</span>
              </button>
              <button
                type="button"
                onClick={clearHistory}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#121620] hover:bg-[#EF4444]/20 border border-white/10 hover:border-[#EF4444]/40 text-xs text-[#9CA3AF] hover:text-[#EF4444] transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Очистить</span>
              </button>
            </div>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#121620] border border-white/5 text-center text-xs text-[#9CA3AF]">
            Пока нет завершённых экспериментов. Запустите сортировку до конца, чтобы результат появился в журнале!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left border-collapse min-w-[680px] text-xs">
              <thead>
                <tr className="bg-[#121620] border-b border-white/10 text-[#9CA3AF] uppercase">
                  <th className="py-2.5 px-3">Время</th>
                  <th className="py-2.5 px-3">Алгоритм</th>
                  <th className="py-2.5 px-3">Размер (n)</th>
                  <th className="py-2.5 px-3">Направление</th>
                  <th className="py-2.5 px-3">Сравнения</th>
                  <th className="py-2.5 px-3">Перемещения</th>
                  <th className="py-2.5 px-3">Вычисление</th>
                  <th className="py-2.5 px-3 text-right">Действие</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {history.map((rec) => (
                  <tr key={rec.id} className="hover:bg-white/[0.02]">
                    <td className="py-2.5 px-3 font-mono text-[#9CA3AF]">
                      {rec.timestamp}
                    </td>
                    <td className="py-2.5 px-3 font-bold text-[#F3F4F6]">
                      {rec.algorithmName}
                    </td>
                    <td className="py-2.5 px-3 font-mono">{rec.arraySize}</td>
                    <td className="py-2.5 px-3">
                      {rec.order === 'asc' ? 'По возрастанию' : 'По убыванию'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#F59E0B]">
                      {rec.comparisons}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#06B6D4]">
                      {rec.moves}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#22C55E]">
                      {rec.computeTimeMs.toFixed(2)} мс
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => restoreExperiment(rec)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#121620] hover:bg-[#8B5CF6] text-[#F3F4F6] hover:text-white border border-white/10 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Загрузить</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

