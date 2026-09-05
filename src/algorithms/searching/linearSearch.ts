import type { SearchStep } from '../../types';

export const linearSearch = (
  array: number[],
  target: number
): SearchStep[] => {
  const steps: SearchStep[] = [];
  const checked: number[] = [];

  steps.push({
    array: [...array],
    current: -1,
    checked: [...checked],
  });

  for (let i = 0; i < array.length; i++) {
    steps.push({
      array: [...array],
      current: i,
      checked: [...checked],
    });
    if (array[i] === target) {
      steps.push({
        array: [...array],
        current: i,
        found: i,
        checked: [...checked, i],
      });
      return steps;
    }
    checked.push(i);
  }

  return steps;
};

