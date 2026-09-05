import type { SortStep } from '../../types';

export const quickSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = [...initialArray];

  const partition = (low: number, high: number): number => {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...array],
        comparing: [j, high],
        swapping: [],
        sorted: [],
        pivot: high,
      });
      if (array[j] < pivot) {
        i++;
        if (i !== j) {
          [array[i], array[j]] = [array[j], array[i]];
          steps.push({
            array: [...array],
            comparing: [],
            swapping: [i, j],
            sorted: [],
            pivot: high,
          });
        }
      }
    }
    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [i + 1, high],
      sorted: [],
      pivot: high,
    });
    return i + 1;
  };

  const sort = (low: number, high: number) => {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    }
  };

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
  });

  sort(0, array.length - 1);

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: array.map((_, idx) => idx),
  });

  return steps;
};

