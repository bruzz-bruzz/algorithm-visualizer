import type { SortStep } from '../../types';

export const selectionSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = [...initialArray];
  const sorted: number[] = [];

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
  });

  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      steps.push({
        array: [...array],
        comparing: [minIdx, j],
        swapping: [],
        sorted: [...sorted],
      });
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) {
      [array[i], array[minIdx]] = [array[minIdx], array[i]];
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted],
      });
    }
    sorted.push(i);
  }

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: array.map((_, idx) => idx),
  });

  return steps;
};

