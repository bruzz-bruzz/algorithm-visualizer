import type { BacktrackingAlgorithm, BacktrackingStep } from '../../types';
import { nQueens, ratInMaze } from './backtracking1';
import { sudokuSolver, subsetSumBT, permutationsBT } from './backtracking2';

const sampleSudoku = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

const sampleMaze = [
  [1, 0, 0, 0],
  [1, 1, 0, 1],
  [0, 1, 0, 0],
  [1, 1, 1, 1],
];

export const backtrackingAlgorithms: Record<
  BacktrackingAlgorithm,
  { name: string; fn: () => BacktrackingStep[]; description: string; complexity: string }
> = {
  nqueens: {
    name: 'N-Queens',
    fn: () => nQueens(4),
    description: 'Place N queens on NxN board so none attack each other.',
    complexity: 'O(N!)',
  },
  ratMaze: {
    name: 'Rat in a Maze',
    fn: () => ratInMaze(sampleMaze),
    description: 'Find a path from top-left to bottom-right in a maze.',
    complexity: 'O(2^(n^2))',
  },
  sudoku: {
    name: 'Sudoku Solver',
    fn: () => sudokuSolver(sampleSudoku),
    description: 'Fill 9x9 grid so each row/col/3x3 has digits 1-9.',
    complexity: 'O(9^(n*n))',
  },
  subsetSum: {
    name: 'Subset Sum',
    fn: () => subsetSumBT([3, 34, 4, 12, 5, 2], 9),
    description: 'Find all subsets that sum to a target value.',
    complexity: 'O(2^n)',
  },
  permutations: {
    name: 'Permutations',
    fn: () => permutationsBT([1, 2, 3]),
    description: 'Generate all permutations of an array.',
    complexity: 'O(n!)',
  },
};

