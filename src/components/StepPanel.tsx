import { useState, useEffect } from 'react';
import { useAnimation } from '../hooks/useAnimation';

interface StepPanelProps<T> {
  title: string;
  algorithms: Record<string, { name: string; description: string; complexity: string; fn: () => T[] }>;
  defaultAlgorithm?: string;
  renderVisualizer: (steps: T[], currentStep: number) => React.ReactNode;
  onAlgorithmChange?: (key: string) => void;
}

export default function StepPanel<T>({ title, algorithms, defaultAlgorithm, renderVisualizer }: StepPanelProps<T>) {
  const algoKeys = Object.keys(algorithms);
  const [algorithm, setAlgorithm] = useState(defaultAlgorithm ?? algoKeys[0]);

  const { isPlaying, currentStep, steps, progress, play, pause, reset, stepForward, stepBackward, skipToEnd, speed, setSpeed, setStepData } = useAnimation<T>();

  const runAlgorithm = () => {
    if (!algorithm) return;
    const fn = algorithms[algorithm].fn;
    const newSteps = fn();
    setStepData(newSteps);
  };

  useEffect(() => {
    runAlgorithm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  const totalSteps = steps.length;
  const algo = algorithms[algorithm];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <label className="block text-xs text-slate-400 mb-1">{title} algorithm</label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="w-full bg-slate-800 text-white px-3 py-2 rounded-md border border-slate-700 focus:border-primary-500 focus:outline-none"
          >
            {algoKeys.map(k => (
              <option key={k} value={k}>{algorithms[k].name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={runAlgorithm}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-md transition-colors self-end"
        >
          Run
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
        <div className="text-sm font-semibold text-white">{algo?.name}</div>
        <div className="text-xs text-slate-400 mt-0.5">{algo?.description}</div>
        <div className="text-xs text-slate-500 mt-1">Complexity: {algo?.complexity}</div>
      </div>

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        {renderVisualizer(steps, currentStep)}
      </div>

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={reset}
            disabled={totalSteps === 0}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm rounded-md"
            title="Reset"
          >⏮</button>
          <button
            onClick={stepBackward}
            disabled={currentStep === 0}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm rounded-md"
            title="Previous"
          >◀</button>
          {isPlaying ? (
            <button
              onClick={pause}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-md font-semibold"
            >⏸ Pause</button>
          ) : (
            <button
              onClick={play}
              disabled={totalSteps === 0}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm rounded-md font-semibold"
            >▶ Play</button>
          )}
          <button
            onClick={stepForward}
            disabled={currentStep >= totalSteps - 1}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm rounded-md"
            title="Next"
          >▶</button>
          <button
            onClick={skipToEnd}
            disabled={currentStep >= totalSteps - 1}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm rounded-md"
            title="Skip to end"
          >⏭</button>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 w-16">Speed:</span>
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="flex-1 accent-primary-500"
          />
          <span className="text-xs text-slate-400 w-12 text-right">{speed}%</span>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Step {totalSteps === 0 ? 0 : currentStep + 1} / {totalSteps}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
