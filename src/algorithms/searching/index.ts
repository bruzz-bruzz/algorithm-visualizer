import type { SearchingAlgorithm, SearchStep } from '../../types';
import { linearSearch } from './linearSearch';
import { binarySearch } from './binarySearch';

export const searchingAlgorithms: Record<
  SearchingAlgorithm,
  {
    name: string;
    fn: (arr: number[], target: number) => SearchStep[];
    complexity: string;
    requiresSorted: boolean;
  }
> = {
  linear: {
    name: 'Linear Search',
    fn: linearSearch,
    complexity: 'O(n)',
    requiresSorted: false,
  },
  binary: {
    name: 'Binary Search',
    fn: binarySearch,
    complexity: 'O(log n)',
    requiresSorted: true,
  },
};

