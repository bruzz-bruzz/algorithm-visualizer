import type { GraphStep, AdjacencyList } from '../../types';
import { buildAdjList, initGraphEdges, initGraphNodes } from '../../utils/graphHelpers';

export function graphKosaraju(adj: AdjacencyList, _startId?: number): GraphStep[] {
  const adjList = buildAdjList(adj);
  const baseNodes = initGraphNodes(adj);
  const baseEdges = initGraphEdges(adj);
  const steps: GraphStep[] = [];

  // Build reverse graph
  const revAdj = new Map<number, Array<{ to: number; weight: number }>>();
  for (const n of baseNodes) revAdj.set(n.id, []);
  for (const e of baseEdges) {
    revAdj.get(e.from)!.push({ to: e.to, weight: e.weight });
    revAdj.get(e.to)!.push({ to: e.from, weight: e.weight }); // reverse
  }

  // Pass 1: DFS on original, record finish order
  const visited = new Set<number>();
  const finishOrder: number[] = [];

  function dfs1(u: number) {
    visited.add(u);
    steps.push({
      nodes: baseNodes.map((n, i) => ({ ...n, state: visited.has(i) ? (i === u ? 'visiting' : 'visited') : 'idle' })),
      edges: baseEdges.map((e) => ({ ...e })),
      description: `Pass 1: DFS visit ${baseNodes[u].label}`,
      mstEdges: [],
      distances: baseNodes.map(() => Infinity),
      finished: false,
    });
    for (const { to: v } of adjList.get(u) || []) {
      if (!visited.has(v)) dfs1(v);
    }
    finishOrder.push(u);
    steps.push({
      nodes: baseNodes.map((n, i) => ({ ...n, state: visited.has(i) ? 'visited' : 'idle' })),
      edges: baseEdges.map((e) => ({ ...e })),
      description: `Finish ${baseNodes[u].label}, order: [${finishOrder.map((i) => baseNodes[i].label).join(', ')}]`,
      mstEdges: [],
      distances: baseNodes.map(() => Infinity),
      finished: false,
    });
  }

  steps.push({
    nodes: baseNodes.map((n) => ({ ...n, state: 'idle' })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: 'Pass 1: DFS to compute finish order',
    mstEdges: [],
    distances: baseNodes.map(() => Infinity),
    finished: false,
  });

  for (let i = 0; i < baseNodes.length; i++) {
    if (!visited.has(i)) dfs1(i);
  }

  // Pass 2: DFS on transpose in reverse finish order
  visited.clear();
  const sccs: number[][] = [];

  function dfs2(u: number, comp: number[]) {
    visited.add(u);
    comp.push(u);
    steps.push({
      nodes: baseNodes.map((n, i) => ({
        ...n,
        state: comp.includes(i) ? 'active' : visited.has(i) ? 'visited' : 'idle',
      })),
      edges: baseEdges.map((e) => ({ ...e })),
      description: `Pass 2: DFS on transpose at ${baseNodes[u].label}, SCC ${sccs.length + 1}: [${comp.map((i) => baseNodes[i].label).join(', ')}]`,
      mstEdges: [],
      distances: baseNodes.map(() => Infinity),
      finished: false,
    });
    for (const { to: v } of revAdj.get(u) || []) {
      if (!visited.has(v)) dfs2(v, comp);
    }
  }

  steps.push({
    nodes: baseNodes.map((n) => ({ ...n, state: 'idle' })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: `Pass 2: DFS on transpose in reverse finish order [${finishOrder.slice().reverse().map((i) => baseNodes[i].label).join(', ')}]`,
    mstEdges: [],
    distances: baseNodes.map(() => Infinity),
    finished: false,
  });

  for (let i = finishOrder.length - 1; i >= 0; i--) {
    const u = finishOrder[i];
    if (!visited.has(u)) {
      const comp: number[] = [];
      dfs2(u, comp);
      sccs.push(comp);
    }
  }

  steps.push({
    nodes: baseNodes.map((n, i) => ({
      ...n,
      state: sccs.some((c) => c.includes(i)) ? 'mst' : 'idle',
    })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: `Kosaraju complete. Found ${sccs.length} SCCs: ${sccs.map((c) => c.map((i) => baseNodes[i].label).join(',')).join(' | ')}`,
    mstEdges: [],
    distances: baseNodes.map(() => Infinity),
    finished: true,
  });

  return steps;
}

