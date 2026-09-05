import type { SortingAlgorithm, SortStep } from '../../types';
import { bubbleSort } from './bubbleSort';
import { selectionSort } from './selectionSort';
import { insertionSort } from './insertionSort';
import { mergeSort } from './mergeSort';
import { quickSort } from './quickSort';
import { heapSort } from './heapSort';

export const sortingAlgorithms: Record<
  SortingAlgorithm,
  { name: string; fn: (arr: number[]) => SortStep[]; complexity: string }
> = {
  bubble: {
    name: 'Bubble Sort',
    fn: bubbleSort,
    complexity: 'O(n²)',
  },
  selection: {
    name: 'Selection Sort',
    fn: selectionSort,
    complexity: 'O(n²)',
  },
  insertion: {
    name: 'Insertion Sort',
    fn: insertionSort,
    complexity: 'O(n²)',
  },
  merge: {
    name: 'Merge Sort',
    fn: mergeSort,
    complexity: 'O(n log n)',
  },
  quick: {
    name: 'Quick Sort',
    fn: quickSort,
    complexity: 'O(n log n) avg',
  },
  heap: {
    name: 'Heap Sort',
    fn: heapSort,
    complexity: 'O(n log n)',
  },
};

