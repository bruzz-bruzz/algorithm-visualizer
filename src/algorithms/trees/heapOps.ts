import type { SortStep } from '../../types';
import { generateRandomArray } from '../../utils/helpers';

// Heap operations (min-heap) visualized as array bars
export function heapInsert(initial: number[], values: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const array = [...initial];

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
  });

  for (const val of values) {
    array.push(val);
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [array.length - 1],
      sorted: [],
    });

    let i = array.length - 1;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      steps.push({
        array: [...array],
        comparing: [i, parent],
        swapping: [],
        sorted: [],
      });
      if (array[i] < array[parent]) {
        [array[i], array[parent]] = [array[parent], array[i]];
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [i, parent],
          sorted: [],
        });
        i = parent;
      } else break;
    }
  }

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
  });

  return steps;
}

export function heapExtract(initial: number[]): SortStep[] {
  const steps: SortStep[] = [];
  const array = [...initial];
  const sorted: number[] = [];
  const n = array.length;

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [...sorted],
  });

  for (let end = n - 1; end > 0; end--) {
    [array[0], array[end]] = [array[end], array[0]];
    steps.push({
      array: [...array],
      comparing: [],
      swapping: [0, end],
      sorted: [...sorted],
    });
    sorted.push(end);

    // Sift down
    let i = 0;
    const size = end;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < size) {
        steps.push({
          array: [...array],
          comparing: [smallest, left],
          swapping: [],
          sorted: [...sorted],
        });
        if (array[left] < array[smallest]) smallest = left;
      }
      if (right < size) {
        steps.push({
          array: [...array],
          comparing: [smallest, right],
          swapping: [],
          sorted: [...sorted],
        });
        if (array[right] < array[smallest]) smallest = right;
      }
      if (smallest !== i) {
        [array[i], array[smallest]] = [array[smallest], array[i]];
        steps.push({
          array: [...array],
          comparing: [],
          swapping: [i, smallest],
          sorted: [...sorted],
        });
        i = smallest;
      } else break;
    }
  }

  sorted.push(0);
  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: array.map((_, i) => i),
  });

  return steps;
}

