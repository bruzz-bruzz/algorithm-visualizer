import type { RecursionAlgorithm, RecursionStep } from '../../types';
import { factorial, fibonacci } from './recursion1';
import { towerOfHanoi, josephus } from './recursion2';
import { powerSet } from './recursion3';

export const recursionAlgorithms: Record<
  RecursionAlgorithm,
  { name: string; fn: (input: number | number[]) => RecursionStep[]; description: string; complexity: string }
> = {
  factorial: {
    name: 'Factorial',
    fn: (n) => factorial(typeof n === 'number' ? n : 5),
    description: 'n! = n * (n-1)!. Classic recursion example.',
    complexity: 'O(n)',
  },
  fibonacci: {
    name: 'Fibonacci',
    fn: (n) => fibonacci(typeof n === 'number' ? n : 5),
    description: 'fib(n) = fib(n-1) + fib(n-2). Tree recursion.',
    complexity: 'O(2^n)',
  },
  hanoi: {
    name: 'Tower of Hanoi',
    fn: (n) => towerOfHanoi(typeof n === 'number' ? n : 3),
    description: 'Move n disks from source to target using auxiliary.',
    complexity: 'O(2^n)',
  },
  josephus: {
    name: 'Josephus Problem',
    fn: (n) => {
      const params = Array.isArray(n) ? n : [7, 3];
      return josephus(params[0] ?? 7, params[1] ?? 3);
    },
    description: 'Eliminate every k-th person until one remains.',
    complexity: 'O(n)',
  },
  powerset: {
    name: 'Power Set',
    fn: (n) => powerSet(Array.isArray(n) ? n : [1, 2, 3]),
    description: 'Generate all subsets of a set.',
    complexity: 'O(2^n)',
  },
};




