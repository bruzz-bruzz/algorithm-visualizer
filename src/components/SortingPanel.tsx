import { useEffect, useState } from 'react';
import ArrayVisualizer from './ArrayVisualizer';
import ControlBar from './ControlBar';
import { sortingAlgorithms } from '../algorithms/sorting';
import type { SortingAlgorithm, SortStep } from '../types';
import { useAnimation } from '../hooks/useAnimation';
import {
  generateRandomArray,
  generateReversedArray,
  generateSortedArray,
} from '../utils/helpers';

const ALGORITHM_KEYS = Object.keys(sortingAlgorithms) as SortingAlgorithm[];

type ArrayType = 'random' | 'sorted' | 'reversed';

const DESCRIPTIONS: Record<SortingAlgorithm, string> = {
  bubble:
    'Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order. Simple but inefficient for large datasets.',
  selection:
    'Selection Sort finds the minimum element from the unsorted portion and places it at the beginning. Makes O(n) swaps regardless of input.',
  insertion:
    'Insertion Sort builds the sorted array one element at a time by inserting each new element into its correct position. Efficient for small or nearly sorted data.',
  merge:
    'Merge Sort divides the array in half, recursively sorts each half, and merges them back together. Guaranteed O(n log n) but uses O(n) extra space.',
  quick:
    'Quick Sort picks a pivot element and partitions the array around it, recursively sorting the sub-arrays. Very fast on average but can degrade to O(n²).',
  heap:
    'Heap Sort builds a max-heap from the array and repeatedly extracts the maximum. Guaranteed O(n log n) with O(1) extra space.',
};

export default function SortingPanel() {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>('bubble');
  const [arraySize, setArraySize] = useState(30);
  const [arrayType, setArrayType] = useState<ArrayType>('random');
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });

  const animation = useAnimation<SortStep>();
  const algoInfo = sortingAlgorithms[algorithm];

  const generateArray = () => {
    let arr: number[];
    if (arrayType === 'sorted') {
      arr = generateSortedArray(arraySize);
    } else if (arrayType === 'reversed') {
      arr = generateReversedArray(arraySize);
    } else {
      arr = generateRandomArray(arraySize);
    }
    const steps = algoInfo.fn(arr);
    animation.setStepData(steps);
    setStats({ comparisons: 0, swaps: 0 });
  };

  useEffect(() => {
    generateArray();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm, arraySize, arrayType]);

  useEffect(() => {
    const data = animation.currentData;
    if (!data) return;
    setStats({
      comparisons: animation.currentStep,
      swaps: animation.currentStep,
    });
  }, [animation.currentStep, animation.currentData]);
  useEffect(() => {
    const data = animation.currentData;
    if (!data) return;
    setStats({
      comparisons: animation.currentStep,
      swaps: animation.currentStep,
    });
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
                setAlgorithm(e.target.value as SortingAlgorithm)
              }
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500"
            >
              {ALGORITHM_KEYS.map((key) => (
                <option key={key} value={key}>
                  {sortingAlgorithms[key].name}
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
              max="100"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className="w-full accent-primary-500"
            />
          </div>

          <div className="flex-1 min-w-[150px]">
            <label className="block text-xs text-slate-400 mb-1">
              Initial State
            </label>
            <select
              value={arrayType}
              onChange={(e) => setArrayType(e.target.value as ArrayType)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500"
            >
              <option value="random">Random</option>
              <option value="sorted">Sorted (best case)</option>
              <option value="reversed">Reversed (worst case)</option>
            </select>
          </div>
        </div>
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
        stats={stats}
        category="sorting"
      />

      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg p-4 h-[400px] sm:h-[500px]">
        <ArrayVisualizer
          step={animation.currentData ?? null}
          algorithmName={algoInfo.name}
        />
      </div>

      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 text-sm text-slate-300">
        <span className="font-semibold text-primary-300">How it works: </span>
        {DESCRIPTIONS[algorithm]}
      </div>
    </div>
  );
}


