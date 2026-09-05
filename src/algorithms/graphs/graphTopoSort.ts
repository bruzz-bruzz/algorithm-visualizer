import type { GraphStep, AdjacencyList } from '../../types';
import { buildAdjList, initGraphEdges, initGraphNodes } from '../../utils/graphHelpers';

export function graphTopoSort(
  adj: AdjacencyList,
  startId: number
): GraphStep[] {
  const adjList = buildAdjList(adj);
  const baseNodes = initGraphNodes(adj);
  const baseEdges = initGraphEdges(adj);
  const steps: GraphStep[] = [];

  const visited = new Set<number>();
  const order: number[] = [];

  steps.push({
    nodes: baseNodes.map((n) => ({ ...n, state: 'idle' })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: `Topological sort starting DFS from ${baseNodes[startId].label}`,
    stack: [startId],
    mstEdges: [],
    distances: baseNodes.map(() => Infinity),
    finished: false,
  });

  function dfs(u: number) {
    visited.add(u);

    steps.push({
      nodes: baseNodes.map((n, i) => ({
        ...n,
        state: visited.has(i) ? (i === u ? 'visiting' : 'visited') : 'idle',
      })),
      edges: baseEdges.map((e) => ({ ...e })),
      description: `Visit ${baseNodes[u].label}`,
      stack: [u],
      mstEdges: [],
      distances: baseNodes.map(() => Infinity),
      finished: false,
    });

    for (const { to: v } of adjList.get(u) || []) {
      if (!visited.has(v)) {
        dfs(v);
      }
    }

    order.unshift(u);

    steps.push({
      nodes: baseNodes.map((n, i) => ({
        ...n,
        state: order.includes(i) ? 'mst' : visited.has(i) ? 'visited' : 'idle',
      })),
      edges: baseEdges.map((e) => ({ ...e })),
      description: `Add ${baseNodes[u].label} to result. Current order: ${order.map((i) => baseNodes[i].label).join(' → ')}`,
      stack: [],
      mstEdges: [],
      distances: baseNodes.map(() => Infinity),
      finished: false,
    });
  }

  // Visit all nodes (so it's a complete topo sort)
  for (let i = 0; i < baseNodes.length; i++) {
    if (!visited.has(i)) dfs(i);
  }

  steps.push({
    nodes: baseNodes.map((n, i) => ({ ...n, state: order.includes(i) ? 'mst' : 'idle' })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: `Topological sort complete: ${order.map((i) => baseNodes[i].label).join(' → ')}`,
    mstEdges: [],
    distances: baseNodes.map(() => Infinity),
    finished: true,
  });

  return steps;
}

