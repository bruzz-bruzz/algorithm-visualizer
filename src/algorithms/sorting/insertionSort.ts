import type { SortStep } from '../../types';

export const insertionSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = [...initialArray];
  const sorted: number[] = [0];

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
  });

  for (let i = 1; i < array.length; i++) {
    let j = i;
    while (j > 0 && array[j - 1] > array[j]) {
      steps.push({
        array: [...array],
        comparing: [j - 1, j],
        swapping: [],
        sorted: [...sorted],
      });
      [array[j - 1], array[j]] = [array[j], array[j - 1]];
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [j - 1, j],
        sorted: [...sorted],
      });
      j--;
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

