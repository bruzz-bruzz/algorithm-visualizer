import type { GraphNode, GraphEdge } from '../types';

// Sample graphs as adjacency lists
export interface AdjacencyList {
  nodes: Array<{ id: number; label: string; x?: number; y?: number }>;
  edges: Array<{ from: number; to: number; weight: number }>;
}

export const sampleGraphs: Record<string, AdjacencyList> = {
  small: {
    nodes: [
      { id: 0, label: 'A', x: 100, y: 100 },
      { id: 1, label: 'B', x: 250, y: 50 },
      { id: 2, label: 'C', x: 250, y: 200 },
      { id: 3, label: 'D', x: 400, y: 100 },
      { id: 4, label: 'E', x: 400, y: 250 },
      { id: 5, label: 'F', x: 550, y: 150 },
    ],
    edges: [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 2 },
      { from: 1, to: 3, weight: 5 },
      { from: 2, to: 3, weight: 1 },
      { from: 2, to: 4, weight: 8 },
      { from: 3, to: 5, weight: 3 },
      { from: 4, to: 5, weight: 2 },
    ],
  },
  directed: {
    nodes: [
      { id: 0, label: 'A', x: 150, y: 80 },
      { id: 1, label: 'B', x: 350, y: 80 },
      { id: 2, label: 'C', x: 550, y: 80 },
      { id: 3, label: 'D', x: 150, y: 220 },
      { id: 4, label: 'E', x: 350, y: 220 },
      { id: 5, label: 'F', x: 550, y: 220 },
      { id: 6, label: 'G', x: 150, y: 360 },
      { id: 7, label: 'H', x: 350, y: 360 },
      { id: 8, label: 'I', x: 550, y: 360 },
    ],
    edges: [
      { from: 0, to: 1, weight: 1 },
      { from: 0, to: 3, weight: 1 },
      { from: 1, to: 2, weight: 1 },
      { from: 1, to: 4, weight: 1 },
      { from: 2, to: 5, weight: 1 },
      { from: 3, to: 6, weight: 1 },
      { from: 4, to: 7, weight: 1 },
      { from: 5, to: 8, weight: 1 },
      { from: 6, to: 7, weight: 1 },
      { from: 7, to: 8, weight: 1 },
    ],
  },
  weighted: {
    nodes: [
      { id: 0, label: 'S', x: 100, y: 150 },
      { id: 1, label: 'A', x: 250, y: 80 },
      { id: 2, label: 'B', x: 250, y: 220 },
      { id: 3, label: 'C', x: 400, y: 150 },
      { id: 4, label: 'D', x: 550, y: 80 },
      { id: 5, label: 'E', x: 550, y: 220 },
      { id: 6, label: 'T', x: 700, y: 150 },
    ],
    edges: [
      { from: 0, to: 1, weight: 7 },
      { from: 0, to: 2, weight: 2 },
      { from: 1, to: 3, weight: 3 },
      { from: 2, to: 3, weight: 4 },
      { from: 1, to: 4, weight: 5 },
      { from: 2, to: 5, weight: 6 },
      { from: 3, to: 4, weight: 1 },
      { from: 3, to: 5, weight: 8 },
      { from: 4, to: 6, weight: 2 },
      { from: 5, to: 6, weight: 4 },
    ],
  },
  negedge: {
    nodes: [
      { id: 0, label: 'S', x: 100, y: 150 },
      { id: 1, label: 'A', x: 300, y: 80 },
      { id: 2, label: 'B', x: 300, y: 220 },
      { id: 3, label: 'C', x: 500, y: 150 },
      { id: 4, label: 'T', x: 700, y: 150 },
    ],
    edges: [
      { from: 0, to: 1, weight: 4 },
      { from: 0, to: 2, weight: 5 },
      { from: 1, to: 2, weight: -3 },
      { from: 1, to: 3, weight: 5 },
      { from: 2, to: 3, weight: 1 },
      { from: 3, to: 4, weight: 3 },
    ],
  },
};

export function buildAdjList(adj: AdjacencyList): Map<number, Array<{ to: number; weight: number }>> {
  const map = new Map<number, Array<{ to: number; weight: number }>>();
  for (const n of adj.nodes) {
    map.set(n.id, []);
  }
  for (const e of adj.edges) {
    map.get(e.from)!.push({ to: e.to, weight: e.weight });
    // For undirected, also add reverse. But we keep directed for simplicity.
  }
  return map;
}

export function buildAdjMatrix(adj: AdjacencyList): number[][] {
  const n = adj.nodes.length;
  const matrix: number[][] = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Infinity)
  );
  for (let i = 0; i < n; i++) matrix[i][i] = 0;
  for (const e of adj.edges) {
    matrix[e.from][e.to] = e.weight;
    matrix[e.to][e.from] = e.weight; // treat as undirected for matrix
  }
  return matrix;
}

export function initGraphNodes(adj: AdjacencyList): GraphNode[] {
  return adj.nodes.map((n) => ({
    id: n.id,
    label: n.label,
    x: n.x ?? 100,
    y: n.y ?? 100,
    state: 'idle',
    distance: Infinity,
    parent: null,
    discoveryTime: 0,
    finishTime: 0,
  }));
}

export function initGraphEdges(adj: AdjacencyList): GraphEdge[] {
  return adj.edges.map((e) => ({
    from: e.from,
    to: e.to,
    weight: e.weight,
    state: 'idle',
  }));
}
