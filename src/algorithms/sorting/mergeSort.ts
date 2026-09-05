import type { SortStep } from '../../types';

export const mergeSort = (initialArray: number[]): SortStep[] => {
  const steps: SortStep[] = [];
  const array = [...initialArray];

  const merge = (left: number, mid: number, right: number) => {
    const temp: number[] = [];
    let i = left;
    let j = mid + 1;

    while (i <= mid && j <= right) {
      steps.push({
        array: [...array],
        comparing: [i, j],
        swapping: [],
        sorted: [],
      });
      if (array[i] <= array[j]) {
        temp.push(array[i++]);
      } else {
        temp.push(array[j++]);
      }
    }

    while (i <= mid) temp.push(array[i++]);
    while (j <= right) temp.push(array[j++]);

    for (let k = 0; k < temp.length; k++) {
      array[left + k] = temp[k];
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [left + k],
        sorted: [],
      });
    }
  };

  const sort = (left: number, right: number) => {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    sort(left, mid);
    sort(mid + 1, right);
    merge(left, mid, right);
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

