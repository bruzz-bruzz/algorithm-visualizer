import type { PathfindingAlgorithm, PathStep } from '../../types';
import { dijkstra } from './dijkstra';
import { aStar } from './astar';
import { bfs } from './bfs';
import { dfs } from './dfs';

export const pathfindingAlgorithms: Record<
  PathfindingAlgorithm,
  {
    name: string;
    fn: (
      grid: import('../../types').GridCell[][],
      start: import('../../types').GridCell,
      end: import('../../types').GridCell
    ) => PathStep[];
    complexity: string;
    weighted: boolean;
  }
> = {
  dijkstra: {
    name: "Dijkstra's",
    fn: dijkstra,
    complexity: 'O((V+E) log V)',
    weighted: true,
  },
  astar: {
    name: 'A* Search',
    fn: aStar,
    complexity: 'O(E log V)',
    weighted: true,
  },
  bfs: {
    name: 'BFS',
    fn: bfs,
    complexity: 'O(V+E)',
    weighted: false,
  },
  dfs: {
    name: 'DFS',
    fn: dfs,
    complexity: 'O(V+E)',
    weighted: false,
  },
};

