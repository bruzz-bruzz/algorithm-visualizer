// Shared types for the visualizer

export type CellType = 'empty' | 'wall' | 'start' | 'end' | 'visited' | 'path';

export interface GridCell {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  fScore: number;
  gScore: number;
  hScore: number;
  previousNode: GridCell | null;
}

export type AlgorithmCategory =
  | 'sorting'
  | 'searching'
  | 'pathfinding'
  | 'graphs'
  | 'trees'
  | 'datastructures'
  | 'recursion'
  | 'dynamicprog'
  | 'greedy'
  | 'backtracking'
  | 'strings';

export type SortingAlgorithm =
  | 'bubble'
  | 'selection'
  | 'insertion'
  | 'merge'
  | 'quick'
  | 'heap';

export type SearchingAlgorithm = 'linear' | 'binary';

export type PathfindingAlgorithm = 'dijkstra' | 'astar' | 'bfs' | 'dfs';

export type GraphAlgorithm =
  | 'bfs'
  | 'dfs'
  | 'dijkstra'
  | 'astar'
  | 'bellmanford'
  | 'floydwarshall'
  | 'prim'
  | 'kruskal'
  | 'toposort'
  | 'kosaraju'
  | 'unionfind';

export type TreeAlgorithm =
  | 'bstInsert'
  | 'bstSearch'
  | 'bstDelete'
  | 'avl'
  | 'btree'
  | 'trie'
  | 'heapOps'
  | 'inorder'
  | 'preorder'
  | 'postorder'
  | 'levelorder';

export type DSAlgorithm =
  | 'stackPush'
  | 'stackPop'
  | 'queueEnqueue'
  | 'queueDequeue'
  | 'llInsert'
  | 'llDelete'
  | 'llReverse';

export type RecursionAlgorithm =
  | 'factorial'
  | 'fibonacci'
  | 'hanoi'
  | 'josephus'
  | 'powerset';

export type DPAlgorithm =
  | 'fib'
  | 'knapsack01'
  | 'lcs'
  | 'editDistance'
  | 'matrixChain'
  | 'coinChange'
  | 'subsetSum';

export type GreedyAlgorithm =
  | 'activity'
  | 'fracKnapsack'
  | 'huffman'
  | 'jobSeq'
  | 'coinChange';

export type BacktrackingAlgorithm =
  | 'nqueens'
  | 'ratMaze'
  | 'sudoku'
  | 'subsetSum'
  | 'permutations';

export interface AdjacencyList {
  nodes: Array<{ id: number; label: string; x?: number; y?: number }>;
  edges: Array<{ from: number; to: number; weight: number }>;
}

export type StringAlgorithm = 'naive' | 'kmp' | 'rabinkarp' | 'zalg';

export type Algorithm =
  | SortingAlgorithm
  | SearchingAlgorithm
  | PathfindingAlgorithm
  | GraphAlgorithm
  | TreeAlgorithm
  | DSAlgorithm
  | RecursionAlgorithm
  | DPAlgorithm
  | GreedyAlgorithm
  | BacktrackingAlgorithm
  | StringAlgorithm;

export interface SortStep {
  array: number[];
  comparing: number[]; // indices being compared
  swapping: number[]; // indices being swapped
  sorted: number[]; // indices that are in their final position
  pivot?: number;
}

export interface SearchStep {
  array: number[];
  current: number;
  found?: number;
  range?: [number, number];
  checked: number[];
}

export interface PathStep {
  grid: GridCell[][];
  visited: Array<{ row: number; col: number }>;
  path: Array<{ row: number; col: number }>;
}

// --- Graph types ---
export interface GraphNode {
  id: number;
  label: string;
  x: number;
  y: number;
  state:
    | 'idle'
    | 'visiting'
    | 'visited'
    | 'inQueue'
    | 'inStack'
    | 'start'
    | 'end'
    | 'mst'
    | 'active'
    | 'cycle';
  distance: number;
  parent: number | null;
  discoveryTime: number;
  finishTime: number;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight: number;
  state: string;
  highlight?: boolean;
}

export interface GraphStep {
  nodes: GraphNode[];
  edges: GraphEdge[];
  description: string;
  queue?: number[];
  stack?: number[];
  mstEdges: GraphEdge[];
  distances: number[];
  finished: boolean;
}

// --- Tree types ---
export interface TreeNode {
  id: string;
  value: number | string;
  x: number;
  y: number;
  state: 'idle' | 'visiting' | 'visited' | 'found' | 'highlight' | 'inserted' | 'deleted';
  parent: string | null;
  left: string | null;
  right: string | null;
  highlight?: boolean;
  rotationType?: 'left' | 'right' | 'left-right' | 'right-left';
}

export interface TreeStep {
  nodes: TreeNode[];
  edges: Array<{ from: string; to: string }>;
  description: string;
  traversalOrder: string[];
  highlightPath: string[];
}

// --- Data structures (stack/queue/linked list) ---
export interface DSStep {
  structure: Array<{
    id: number;
    value: number;
    state: string;
  }>;
  description: string;
}

// --- Recursion ---
export interface RecursionStep {
  callStack: Array<{ id: number; args: string; returnValue: string; state: string }>;
  description: string;
  output: string[];
  rods?: { A: number[]; B: number[]; C: number[] };
  currentMove?: { from: 'A' | 'B' | 'C'; to: 'A' | 'B' | 'C' };
  highlightRod?: 'A' | 'B' | 'C';
}

// --- Dynamic programming ---
export interface DPStep {
  dpTable: Array<Array<{ value: number | string; state: string }>>;
  rowLabels: string[];
  colLabels: string[];
  description: string;
  items?: Array<{ id: number; weight: number; value: number; state: string }>;
}

// --- Greedy ---
export interface GreedyStep {
  items: Array<{ id: number; value: number; weight: number; ratio?: number; state: string }>;
  description: string;
  result: string[];
  trees?: Array<{ root: number; nodes: number[]; merged?: boolean }>;
  rod?: Array<number>;
}

// --- Backtracking ---
export interface BacktrackingStep {
  board: Array<Array<{ value: string; state: string }>>;
  description: string;
  solutionPath: string;
  candidates?: number[];
  currentChoice?: number;
}

// --- Strings ---
export interface StringStep {
  text: string;
  pattern: string;
  textIndices: Array<{ index: number; state: string }>;
  patternIndices: Array<{ index: number; state: string }>;
  description: string;
  matches: Array<{ start: number; end: number }>;
  currentPosition: { textIndex: number; patternIndex: number };
  lpsTable?: number[];
  highlightLPS?: number;
}

export interface Stats {
  comparisons: number;
  swaps: number;
  timeMs: number;
}

export type AlgorithmCategoryExt =
  | 'sorting'
  | 'searching'
  | 'pathfinding'
  | 'graphs'
  | 'trees'
  | 'datastructures'
  | 'recursion'
  | 'dynamicprog'
  | 'greedy'
  | 'backtracking'
  | 'strings';
