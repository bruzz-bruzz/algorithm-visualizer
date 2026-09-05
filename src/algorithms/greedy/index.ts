import type { GreedyAlgorithm, GreedyStep } from '../../types';
import { activitySelection, fractionalKnapsack } from './greedy1';
import { huffman, jobSequencing } from './greedy2';

export const greedyAlgorithms: Record<
  GreedyAlgorithm,
  { name: string; fn: () => GreedyStep[]; description: string; complexity: string }
> = {
  activity: {
    name: 'Activity Selection',
    fn: () => activitySelection([1, 3, 0, 5, 8, 5], [2, 4, 6, 7, 9, 9]),
    description: 'Select max non-overlapping activities by earliest finish.',
    complexity: 'O(n log n)',
  },
  fracKnapsack: {
    name: 'Fractional Knapsack',
    fn: () => fractionalKnapsack([60, 100, 120], [10, 20, 30], 50),
    description: 'Take items by max value/weight ratio (fractions allowed).',
    complexity: 'O(n log n)',
  },
  huffman: {
    name: 'Huffman Coding',
    fn: () => huffman([5, 9, 12, 13, 16, 45]),
    description: 'Build optimal prefix-free binary code tree.',
    complexity: 'O(n log n)',
  },
  jobSeq: {
    name: 'Job Sequencing with Deadlines',
    fn: () => jobSequencing([{ id: 0, deadline: 2, profit: 60 }, { id: 1, deadline: 1, profit: 100 }, { id: 2, deadline: 3, profit: 20 }, { id: 3, deadline: 3, profit: 40 }], 3),
    description: 'Maximize profit with deadline constraints.',
    complexity: 'O(n^2)',
  },
  coinChange: {
    name: 'Coin Change (Greedy)',
    fn: () => activitySelection([1, 5, 10, 25], [0, 0, 0, 0]).map(s => ({ ...s, description: 'Greedy coin change: always pick largest coin', result: ['Quarters: 1, Dimes: 0, etc.'] })),
    description: 'Use largest coins first (works for canonical systems).',
    complexity: 'O(n)',
  },
};

