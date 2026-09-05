import type { SearchStep } from '../../types';

export const binarySearch = (
  array: number[],
  target: number
): SearchStep[] => {
  const steps: SearchStep[] = [];
  const sorted = [...array].sort((a, b) => a - b);
  const checked: number[] = [];
  let left = 0;
  let right = sorted.length - 1;

  steps.push({
    array: [...sorted],
    current: -1,
    checked: [...checked],
    range: [left, right],
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    steps.push({
      array: [...sorted],
      current: mid,
      checked: [...checked],
      range: [left, right],
    });

    if (sorted[mid] === target) {
      steps.push({
        array: [...sorted],
        current: mid,
        found: mid,
        checked: [...checked, mid],
        range: [left, right],
      });
      return steps;
    } else if (sorted[mid] < target) {
      checked.push(mid);
      left = mid + 1;
    } else {
      checked.push(mid);
      right = mid - 1;
    }
    steps.push({
      array: [...sorted],
      current: -1,
      checked: [...checked],
      range: [left, right],
    });
  }

  return steps;
};

