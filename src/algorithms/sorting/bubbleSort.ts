import type { SortStep } from '../../types';

export const bubbleSort = (initialArray: number[]): SortStep[] => {
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
    for (let j = 0; j < array.length - i - 1; j++) {
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
      });

      if (array[j] > array[j + 1]) {
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
        });
      }
    }
    sorted.push(array.length - i - 1);
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
    });
  }

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: array.map((_, idx) => idx),
  });

  return steps;
};

