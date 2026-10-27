import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AlgorithmId, ArrayPresetType, QuickPivotStrategy, SortOrder } from '../types/algorithm';
import {
  ExperimentRecord,
  PlaybackStatus,
  SortingStep,
} from '../types/visualization';
import { executeSortingAlgorithm } from '../algorithms';
import { getAlgorithmById } from '../data/algorithms';
import {
  generateArrayByPreset,
  shuffleArray,
} from '../utils/arrayGenerator';
import {
  loadExperimentHistory,
  loadUserSettings,
  saveExperimentHistory,
  saveUserSettings,
} from '../utils/statistics';

const PRESET_NAMES: Record<ArrayPresetType, string> = {
  random: 'Случайный массив',
  'nearly-sorted': 'Почти отсортированный',
  reversed: 'Обратный порядок',
  duplicates: 'Почти одинаковые значения',
  custom: 'Пользовательский массив',
};

export function useSortingVisualizer(initialAlgorithmOverride?: AlgorithmId) {
  const initialSettings = useMemo(() => loadUserSettings(), []);

  const [algorithmId, setAlgorithmIdState] = useState<AlgorithmId>(
    initialAlgorithmOverride ?? initialSettings.algorithmId
  );
  const [arraySize, setArraySizeState] = useState<number>(initialSettings.arraySize);
  const [speedMs, setSpeedMsState] = useState<number>(initialSettings.speedMs);
  const [order, setOrderState] = useState<SortOrder>(initialSettings.order);
  const [pivotStrategy, setPivotStrategyState] = useState<QuickPivotStrategy>('middle');
  const [preset, setPreset] = useState<ArrayPresetType>('random');

  const [initialArray, setInitialArray] = useState<number[]>(() =>
    generateArrayByPreset('random', initialSettings.arraySize)
  );

  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [status, setStatus] = useState<PlaybackStatus>('idle');
  const [computeTimeMs, setComputeTimeMs] = useState<number>(0);
  const [animationElapsedMs, setAnimationElapsedMs] = useState<number>(0);
  const [warning, setWarning] = useState<string | undefined>(undefined);
  const [history, setHistory] = useState<ExperimentRecord[]>(() => loadExperimentHistory());

  const timerRef = useRef<number | null>(null);
  const animTimerRef = useRef<number | null>(null);
  const speedRef = useRef<number>(speedMs);
  const statusRef = useRef<PlaybackStatus>(status);
  const recordedRunRef = useRef<boolean>(false);

  // Точное отслеживание реального времени работы анимации через performance.now()
  const runStartPerfRef = useRef<number | null>(null);
  const accumulatedAnimMsRef = useRef<number>(0);

  speedRef.current = speedMs;
  statusRef.current = status;

  const clearTimers = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (animTimerRef.current !== null) {
      window.clearInterval(animTimerRef.current);
      animTimerRef.current = null;
    }
    if (runStartPerfRef.current !== null) {
      accumulatedAnimMsRef.current += Math.max(0, performance.now() - runStartPerfRef.current);
      runStartPerfRef.current = null;
    }
  }, []);

  // Сохранение пользовательских настроек в localStorage
  useEffect(() => {
    saveUserSettings({
      algorithmId,
      arraySize,
      speedMs,
      order,
    });
  }, [algorithmId, arraySize, speedMs, order]);

  // Пересчёт последовательности событий при смене исходного массива, алгоритма или направления
  const recomputeSteps = useCallback(
    (sourceArray: number[], algId: AlgorithmId, sortOrder: SortOrder, pStrategy: QuickPivotStrategy) => {
      clearTimers();
      recordedRunRef.current = false;
      accumulatedAnimMsRef.current = 0;
      runStartPerfRef.current = null;
      const result = executeSortingAlgorithm(algId, sourceArray, sortOrder, pStrategy);
      setSteps(result.steps);
      setCurrentStepIndex(0);
      setStatus('idle');
      setComputeTimeMs(result.computeTimeMs);
      setAnimationElapsedMs(0);
      setWarning(result.warning);
      return result;
    },
    [clearTimers]
  );

  useEffect(() => {
    recomputeSteps(initialArray, algorithmId, order, pivotStrategy);
  }, [initialArray, algorithmId, order, pivotStrategy, recomputeSteps]);

  // Запись завершённого эксперимента в историю
  const recordCompletedExperiment = useCallback(
    (finalStep: SortingStep, totalStepsCount: number) => {
      if (recordedRunRef.current) return;
      recordedRunRef.current = true;
      const algInfo = getAlgorithmById(algorithmId);
      const newRecord: ExperimentRecord = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        algorithmId,
        algorithmName: algInfo.nameEn,
        arraySize: initialArray.length,
        order,
        presetName: PRESET_NAMES[preset],
        comparisons: finalStep.stats.comparisons,
        swaps: finalStep.stats.swaps,
        moves: finalStep.stats.moves,
        totalSteps: totalStepsCount,
        computeTimeMs,
        initialArray: [...initialArray],
      };

      setHistory((prev) => {
        const updated = [newRecord, ...prev].slice(0, 15);
        saveExperimentHistory(updated);
        return updated;
      });
    },
    [algorithmId, initialArray, order, preset, computeTimeMs]
  );

  // Основной цикл воспроизведения шагов с динамической скоростью и точным временем без лишних ререндеров
  useEffect(() => {
    if (status !== 'running') {
      clearTimers();
      return;
    }

    runStartPerfRef.current = performance.now();

    // Плавное обновление индикатора времени для медленных режимов (раз в 150 мс вместо 50 мс)
    animTimerRef.current = window.setInterval(() => {
      if (runStartPerfRef.current !== null) {
        const elapsed =
          accumulatedAnimMsRef.current + (performance.now() - runStartPerfRef.current);
        setAnimationElapsedMs(elapsed);
      }
    }, 150);

    const scheduleNext = () => {
      timerRef.current = window.setTimeout(() => {
        if (statusRef.current !== 'running') return;

        if (runStartPerfRef.current !== null) {
          const elapsed =
            accumulatedAnimMsRef.current + (performance.now() - runStartPerfRef.current);
          setAnimationElapsedMs(elapsed);
        }

        setCurrentStepIndex((prevIdx) => {
          const nextIdx = prevIdx + 1;
          if (nextIdx >= steps.length - 1) {
            clearTimers();
            setAnimationElapsedMs(accumulatedAnimMsRef.current);
            setStatus('completed');
            if (steps[steps.length - 1]) {
              recordCompletedExperiment(steps[steps.length - 1], steps.length - 1);
            }
            return Math.max(0, steps.length - 1);
          }
          scheduleNext();
          return nextIdx;
        });
      }, speedRef.current);
    };

    scheduleNext();

    return () => {
      clearTimers();
    };
  }, [status, steps, clearTimers, recordCompletedExperiment]);

  // Действия управления
  const start = useCallback(() => {
    if (steps.length <= 1) {
      setStatus('completed');
      return;
    }
    if (currentStepIndex >= steps.length - 1 || currentStepIndex === 0) {
      recordedRunRef.current = false;
      accumulatedAnimMsRef.current = 0;
      runStartPerfRef.current = null;
      setCurrentStepIndex(0);
      setAnimationElapsedMs(0);
    }
    setStatus('running');
  }, [steps.length, currentStepIndex]);

  const pause = useCallback(() => {
    if (status === 'running') {
      clearTimers();
      setAnimationElapsedMs(accumulatedAnimMsRef.current);
      setStatus('paused');
    }
  }, [status, clearTimers]);

  const resume = useCallback(() => {
    if (status === 'paused' && currentStepIndex < steps.length - 1) {
      setStatus('running');
    }
  }, [status, currentStepIndex, steps.length]);

  const nextStep = useCallback(() => {
    clearTimers();
    if (currentStepIndex < steps.length - 1) {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      accumulatedAnimMsRef.current += speedRef.current;
      setAnimationElapsedMs(accumulatedAnimMsRef.current);
      if (nextIdx >= steps.length - 1) {
        setStatus('completed');
        if (steps[nextIdx]) {
          recordCompletedExperiment(steps[nextIdx], steps.length - 1);
        }
      } else {
        setStatus('paused');
      }
    }
  }, [clearTimers, currentStepIndex, steps, recordCompletedExperiment]);

  const prevStep = useCallback(() => {
    clearTimers();
    if (currentStepIndex > 0) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      accumulatedAnimMsRef.current = Math.max(0, accumulatedAnimMsRef.current - speedRef.current);
      setAnimationElapsedMs(prevIdx === 0 ? 0 : accumulatedAnimMsRef.current);
      setStatus(prevIdx === 0 ? 'idle' : 'paused');
    }
  }, [clearTimers, currentStepIndex]);

  const reset = useCallback(() => {
    clearTimers();
    recordedRunRef.current = false;
    accumulatedAnimMsRef.current = 0;
    runStartPerfRef.current = null;
    setCurrentStepIndex(0);
    setAnimationElapsedMs(0);
    setStatus('idle');
  }, [clearTimers]);

  const shuffle = useCallback(() => {
    clearTimers();
    const shuffled = shuffleArray(initialArray);
    setPreset('random');
    setInitialArray(shuffled);
  }, [clearTimers, initialArray]);

  const generateNewArray = useCallback(
    (targetPreset: ArrayPresetType = preset, targetSize: number = arraySize) => {
      clearTimers();
      setPreset(targetPreset);
      setArraySizeState(targetSize);
      const generated = generateArrayByPreset(targetPreset, targetSize);
      setInitialArray(generated);
    },
    [clearTimers, preset, arraySize]
  );

  const setCustomArray = useCallback(
    (customNumbers: number[], customPreset: ArrayPresetType = 'custom') => {
      clearTimers();
      setPreset(customPreset);
      setArraySizeState(customNumbers.length);
      setInitialArray([...customNumbers]);
    },
    [clearTimers]
  );

  const setAlgorithmId = useCallback(
    (newAlg: AlgorithmId) => {
      clearTimers();
      setAlgorithmIdState((prev) => (prev === newAlg ? prev : newAlg));
    },
    [clearTimers]
  );

  const setArraySize = useCallback(
    (newSize: number) => {
      const clamped = Math.max(5, Math.min(100, newSize));
      if (clamped === arraySize && initialArray.length === clamped) return;
      clearTimers();
      setArraySizeState(clamped);
      const activePreset = preset === 'custom' ? 'random' : preset;
      setPreset(activePreset);
      setInitialArray(generateArrayByPreset(activePreset, clamped));
    },
    [arraySize, initialArray.length, preset, clearTimers]
  );

  const setSpeedMs = useCallback((newSpeed: number) => {
    const clamped = Math.max(10, Math.min(1500, newSpeed));
    setSpeedMsState(clamped);
    speedRef.current = clamped;
  }, []);

  const setOrder = useCallback(
    (newOrder: SortOrder) => {
      clearTimers();
      setOrderState((prev) => (prev === newOrder ? prev : newOrder));
    },
    [clearTimers]
  );

  const setPivotStrategy = useCallback(
    (newStrategy: QuickPivotStrategy) => {
      clearTimers();
      setPivotStrategyState((prev) => (prev === newStrategy ? prev : newStrategy));
    },
    [clearTimers]
  );

  const jumpToStep = useCallback(
    (stepIdx: number) => {
      clearTimers();
      const clamped = Math.max(0, Math.min(steps.length - 1, stepIdx));
      setCurrentStepIndex(clamped);
      accumulatedAnimMsRef.current = clamped * speedRef.current;
      setAnimationElapsedMs(clamped === 0 ? 0 : accumulatedAnimMsRef.current);
      if (clamped === 0) {
        setStatus('idle');
      } else if (clamped >= steps.length - 1) {
        setStatus('completed');
      } else {
        setStatus('paused');
      }
    },
    [clearTimers, steps.length]
  );

  const restoreExperiment = useCallback(
    (record: ExperimentRecord) => {
      clearTimers();
      setAlgorithmIdState(record.algorithmId);
      setOrderState(record.order);
      setArraySizeState(record.initialArray.length);
      setPreset('custom');
      setInitialArray([...record.initialArray]);
    },
    [clearTimers]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    saveExperimentHistory([]);
  }, []);

  const currentStep: SortingStep = useMemo(() => {
    if (steps.length > 0 && steps[currentStepIndex]) {
      return steps[currentStepIndex];
    }
    return {
      stepNumber: 0,
      type: 'init',
      array: initialArray,
      comparingIndices: [],
      swappingIndices: [],
      pivotIndex: null,
      minMaxIndex: null,
      currentIndex: null,
      mergeRange: null,
      partitionRange: null,
      sortedIndices: [],
      shellGap: null,
      shellGroupIndices: [],
      heapSize: null,
      countArray: null,
      recursionDepth: 0,
      stats: { comparisons: 0, swaps: 0, moves: 0 },
      phase: 'Ожидание запуска',
      title: 'Готов к запуску',
      description: 'Нажмите «Запустить» или «Следующий шаг», чтобы начать визуализацию сортировки.',
    };
  }, [steps, currentStepIndex, initialArray]);

  return {
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
    steps,
    currentStepIndex,
    totalSteps: Math.max(0, steps.length - 1),
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
  };
}
