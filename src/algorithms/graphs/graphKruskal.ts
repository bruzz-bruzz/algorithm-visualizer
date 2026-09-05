import type { GraphEdge, GraphStep, AdjacencyList } from '../../types';
import { initGraphEdges, initGraphNodes } from '../../utils/graphHelpers';

export function graphKruskal(adj: AdjacencyList, _startId?: number): GraphStep[] {
  const baseNodes = initGraphNodes(adj);
  const baseEdges = initGraphEdges(adj);
  const steps: GraphStep[] = [];

  const sortedEdges = [...baseEdges].sort((a, b) => a.weight - b.weight);
  const parent = baseNodes.map((_, i) => i);

  const find = (i: number): number => {
    if (parent[i] !== i) parent[i] = find(parent[i]);
    return parent[i];
  };

  const union = (i: number, j: number) => {
    const ri = find(i);
    const rj = find(j);
    if (ri !== rj) parent[ri] = rj;
  };

  steps.push({
    nodes: baseNodes.map((n) => ({ ...n, state: 'idle' })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: 'Sort edges by weight',
    mstEdges: [],
    distances: baseNodes.map(() => Infinity),
    finished: false,
  });

  const mstEdges: GraphEdge[] = [];

  for (const edge of sortedEdges) {
    const rootU = find(edge.from);
    const rootV = find(edge.to);

    steps.push({
      nodes: baseNodes.map((n, i) => ({
        ...n,
        state: rootU === find(i) ? 'active' : 'idle',
      })),
      edges: baseEdges.map((e) => {
        if (e.from === edge.from && e.to === edge.to) return { ...e, state: 'considering' };
        const inMst = mstEdges.some((m) => m.from === e.from && m.to === e.to);
        return { ...e, state: inMst ? 'accepted' : 'idle' };
      }),
      description: `Consider edge ${baseNodes[edge.from].label} - ${baseNodes[edge.to].label} (weight ${edge.weight}). Roots: ${baseNodes[rootU].label}, ${baseNodes[rootV].label}`,
      mstEdges: [...mstEdges],
      distances: baseNodes.map(() => Infinity),
      finished: false,
    });

    if (rootU !== rootV) {
      union(edge.from, edge.to);
      mstEdges.push({ ...edge, state: 'tree' });

      steps.push({
        nodes: baseNodes.map((n, i) => ({
          ...n,
          state: find(i) === find(edge.to) ? 'mst' : 'idle',
        })),
        edges: baseEdges.map((e) => {
          if (e.from === edge.from && e.to === edge.to) return { ...e, state: 'accepted' };
          const inMst = mstEdges.some((m) => m.from === e.from && m.to === e.to);
          return { ...e, state: inMst ? 'accepted' : 'idle' };
        }),
        description: `Add edge to MST (no cycle)`,
        mstEdges: [...mstEdges],
        distances: baseNodes.map(() => Infinity),
        finished: false,
      });
    } else {
      steps.push({
        nodes: baseNodes.map((n) => ({ ...n, state: 'idle' })),
        edges: baseEdges.map((e) => {
          if (e.from === edge.from && e.to === edge.to) return { ...e, state: 'rejected' };
          const inMst = mstEdges.some((m) => m.from === e.from && m.to === e.to);
          return { ...e, state: inMst ? 'accepted' : 'idle' };
        }),
        description: `Reject edge (would form a cycle)`,
        mstEdges: [...mstEdges],
        distances: baseNodes.map(() => Infinity),
        finished: false,
      });
    }
  }

  steps.push({
    nodes: baseNodes.map((n) => ({ ...n, state: 'mst' })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: `Kruskal's MST complete. Total weight: ${mstEdges.reduce((s, e) => s + e.weight, 0)}`,
    mstEdges: [...mstEdges],
    distances: baseNodes.map(() => Infinity),
    finished: true,
  });

  return steps;
}

