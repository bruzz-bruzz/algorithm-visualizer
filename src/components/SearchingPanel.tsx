import { useEffect, useState } from 'react';
import ArrayVisualizer from './ArrayVisualizer';
import ControlBar from './ControlBar';
import { searchingAlgorithms } from '../algorithms/searching';
import type { SearchingAlgorithm, SearchStep } from '../types';
import { useAnimation } from '../hooks/useAnimation';
import { generateRandomArray, generateSortedArray } from '../utils/helpers';

const ALGORITHM_KEYS = Object.keys(
  searchingAlgorithms
) as SearchingAlgorithm[];

export default function SearchingPanel() {
  const [algorithm, setAlgorithm] = useState<SearchingAlgorithm>('linear');
  const [arraySize, setArraySize] = useState(20);
  const [target, setTarget] = useState(50);
  const [stats, setStats] = useState({ comparisons: 0 });
  const [foundIndex, setFoundIndex] = useState<number | undefined>(undefined);

  const animation = useAnimation<SearchStep>();
  const algoInfo = searchingAlgorithms[algorithm];

  const generateArray = () => {
    // Binary search requires a sorted array
    const arr = algoInfo.requiresSorted
      ? generateSortedArray(arraySize)
      : generateRandomArray(arraySize);

    // Pick a random value as target
    const randomTarget = arr[Math.floor(Math.random() * arr.length)];
    setTarget(randomTarget);

    const steps = algoInfo.fn(arr, randomTarget);
    animation.setStepData(steps);
    setStats({ comparisons: 0 });
    setFoundIndex(undefined);
  };

  useEffect(() => {
    generateArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm, arraySize]);

  useEffect(() => {
    const data = animation.currentData;
    if (!data) return;
    setStats({ comparisons: animation.currentStep });
    if (data.found !== undefined) {
      setFoundIndex(data.found);
    } else {
      setFoundIndex(undefined);
    }
  }, [animation.currentStep, animation.currentData]);

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-slate-400 mb-1">
              Algorithm
            </label>
            <select
              value={algorithm}
              onChange={(e) =>
                setAlgorithm(e.target.value as SearchingAlgorithm)
              }
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500"
            >
              {ALGORITHM_KEYS.map((key) => (
                <option key={key} value={key}>
                  {searchingAlgorithms[key].name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs text-slate-400 mb-1">
              Array Size: {arraySize}
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>

          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs text-slate-400 mb-1">
              Target Value
            </label>
            <div className="bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-1.5 text-sm font-semibold">
              {target}
            </div>
          </div>
        </div>
        {algoInfo.requiresSorted && (
          <div className="mt-2 text-xs text-amber-400">
            ⚠ Binary Search requires the array to be sorted. The array is
            auto-sorted for visualization.
          </div>
        )}
      </div>

      <ControlBar
        isPlaying={animation.isPlaying}
        onPlay={animation.play}
        onPause={animation.pause}
        onReset={animation.reset}
        onStepForward={animation.stepForward}
        onStepBackward={animation.stepBackward}
        onSkipToEnd={animation.skipToEnd}
        onGenerateNew={generateArray}
        speed={animation.speed}
        setSpeed={animation.setSpeed}
        progress={animation.progress}
        currentStep={animation.currentStep}
        totalSteps={animation.steps.length}
        algorithmName={algoInfo.name}
        complexity={algoInfo.complexity}
        stats={{ comparisons: stats.comparisons, swaps: 0, pathLength: foundIndex }}
        category="searching"
      />

      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg p-4 h-[400px] sm:h-[500px]">
        <ArrayVisualizer
          step={animation.currentData ?? null}
          algorithmName={algoInfo.name}
        />
      </div>
    </div>
  );
}
