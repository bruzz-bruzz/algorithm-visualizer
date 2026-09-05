import type { GraphAlgorithm, GraphStep, AdjacencyList } from '../../types';
import { graphBFS } from './graphBFS';
import { graphDFS } from './graphDFS';
import { graphDijkstra } from './graphDijkstra';
import { graphBellmanFord } from './graphBellmanFord';
import { graphFloydWarshall } from './graphFloydWarshall';
import { graphPrim } from './graphPrim';
import { graphKruskal } from './graphKruskal';
import { graphTopoSort } from './graphTopoSort';
import { graphKosaraju } from './graphKosaraju';
import { graphUnionFind } from './graphUnionFind';

export const graphAlgorithms: Record<
  GraphAlgorithm,
  {
    name: string;
    description: string;
    complexity: string;
    fn: (adj: AdjacencyList, startId: number) => GraphStep[];
    weighted: boolean;
    directed: boolean;
  }
> = {
  bfs: {
    name: 'Breadth-First Search',
    description: 'Explores nodes level by level. Finds shortest path in unweighted graphs.',
    complexity: 'O(V + E)',
    fn: graphBFS,
    weighted: false,
    directed: false,
  },
  dfs: {
    name: 'Depth-First Search',
    description: 'Explores as deep as possible before backtracking.',
    complexity: 'O(V + E)',
    fn: graphDFS,
    weighted: false,
    directed: false,
  },
  dijkstra: {
    name: "Dijkstra's Algorithm",
    description: 'Single-source shortest path with non-negative weights.',
    complexity: 'O((V+E) log V)',
    fn: graphDijkstra,
    weighted: true,
    directed: false,
  },
  astar: {
    name: 'A* Search',
    description: 'Heuristic-guided shortest path (uses Dijkstra fallback here).',
    complexity: 'O(E log V)',
    fn: graphDijkstra, // simplified - uses Dijkstra
    weighted: true,
    directed: false,
  },
  bellmanford: {
    name: 'Bellman-Ford',
    description: 'Single-source shortest path, handles negative weights and detects negative cycles.',
    complexity: 'O(V × E)',
    fn: graphBellmanFord,
    weighted: true,
    directed: true,
  },
  floydwarshall: {
    name: 'Floyd-Warshall',
    description: 'All-pairs shortest path algorithm using dynamic programming.',
    complexity: 'O(V³)',
    fn: graphFloydWarshall,
    weighted: true,
    directed: true,
  },
  prim: {
    name: "Prim's MST",
    description: 'Builds minimum spanning tree by growing from a starting vertex.',
    complexity: 'O(E log V)',
    fn: graphPrim,
    weighted: true,
    directed: false,
  },
  kruskal: {
    name: "Kruskal's MST",
    description: 'Builds MST by adding edges in order of weight, skipping those that form cycles.',
    complexity: 'O(E log E)',
    fn: graphKruskal,
    weighted: true,
    directed: false,
  },
  toposort: {
    name: 'Topological Sort',
    description: 'Linear ordering of vertices in a DAG using DFS.',
    complexity: 'O(V + E)',
    fn: graphTopoSort,
    weighted: false,
    directed: true,
  },
  kosaraju: {
    name: "Kosaraju's SCC",
    description: 'Finds strongly connected components using two DFS passes.',
    complexity: 'O(V + E)',
    fn: graphKosaraju,
    weighted: false,
    directed: true,
  },
  unionfind: {
    name: 'Union-Find (DSU)',
    description: 'Disjoint set operations with path compression and union by rank.',
    complexity: 'O(α(n)) per op',
    fn: graphUnionFind,
    weighted: false,
    directed: false,
  },
};

