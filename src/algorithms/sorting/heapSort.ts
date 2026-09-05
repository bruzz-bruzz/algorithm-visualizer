import type { SortStep } from '../../types';

export const heapSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = [...initialArray];
  const sorted: number[] = [];
  const n = array.length;

  const heapify = (n: number, i: number) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n) {
      steps.push({
        array: [...array],
        comparing: [largest, left],
        swapping: [],
        sorted: [...sorted],
      });
      if (array[left] > array[largest]) largest = left;
    }

    if (right < n) {
      steps.push({
        array: [...array],
        comparing: [largest, right],
        swapping: [],
        sorted: [...sorted],
      });
      if (array[right] > array[largest]) largest = right;
    }

    if (largest !== i) {
      [array[i], array[largest]] = [array[largest], array[i]];
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [i, largest],
        sorted: [...sorted],
      });
      heapify(n, largest);
    }
  };

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
  });

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [array[0], array[i]] = [array[i], array[0]];
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [0, i],
      sorted: [...sorted],
    });
    sorted.push(i);
    heapify(i, 0);
  }

  sorted.push(0);
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: array.map((_, idx) => idx),
  });

  return steps;
};

