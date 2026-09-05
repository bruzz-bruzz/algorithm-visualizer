import type { DPAlgorithm, DPStep } from '../../types';
import { knapsack01, lcs, editDistance } from './dp1';
import { fibDP, coinChange, subsetSum } from './dp2';
import { matrixChain } from './dp3';

export const dpAlgorithms: Record<
  DPAlgorithm,
  { name: string; fn: () => DPStep[]; description: string; complexity: string }
> = {
  fib: {
    name: 'Fibonacci DP',
    fn: () => fibDP(10),
    description: 'Bottom-up DP for Fibonacci numbers.',
    complexity: 'O(n)',
  },
  knapsack01: {
    name: '0/1 Knapsack',
    fn: () => knapsack01([2, 3, 4, 5], [3, 4, 5, 6], 5),
    description: 'Maximize value with weight constraint.',
    complexity: 'O(nW)',
  },
  lcs: {
    name: 'Longest Common Subsequence',
    fn: () => lcs('ABCBDAB', 'BDCAB'),
    description: 'Longest subsequence common to two strings.',
    complexity: 'O(mn)',
  },
  editDistance: {
    name: 'Edit Distance',
    fn: () => editDistance('kitten', 'sitting'),
    description: 'Min operations to transform one string to another.',
    complexity: 'O(mn)',
  },
  matrixChain: {
    name: 'Matrix Chain Multiplication',
    fn: () => matrixChain([1, 2, 3, 4]),
    description: 'Optimal parenthesization for matrix products.',
    complexity: 'O(n^3)',
  },
  coinChange: {
    name: 'Coin Change',
    fn: () => coinChange([1, 5, 10, 25], 30),
    description: 'Min number of coins to make amount.',
    complexity: 'O(n*amount)',
  },
  subsetSum: {
    name: 'Subset Sum',
    fn: () => subsetSum([3, 34, 4, 12, 5, 2], 9),
    description: 'Check if any subset sums to target.',
    complexity: 'O(n*target)',
  },
};

