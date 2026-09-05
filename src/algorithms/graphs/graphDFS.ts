import type { GraphNode, GraphEdge, GraphStep, AdjacencyList } from '../../types';
import { buildAdjList, initGraphEdges, initGraphNodes } from '../../utils/graphHelpers';

export function graphDFS(
  adj: AdjacencyList,
  startId: number
): GraphStep[] {
  const adjList = buildAdjList(adj);
  const baseNodes = initGraphNodes(adj);
  const baseEdges = initGraphEdges(adj);
  const steps: GraphStep[] = [];

  const cloneNodes = (overrides: Map<number, Partial<GraphNode>> = new Map()): GraphNode[] =>
    baseNodes.map((n) => ({ ...n, ...(overrides.get(n.id) || {}) }));

  const cloneEdges = (overrides: Map<string, GraphEdge['state']> = new Map()): GraphEdge[] =>
    baseEdges.map((e) => {
      const key = `${e.from}-${e.to}`;
      const revKey = `${e.to}-${e.from}`;
      const state = overrides.get(key) ?? overrides.get(revKey);
      return state ? { ...e, state } : { ...e };
    });

  const visited = new Set<number>();
  const parent = new Map<number, number | null>();
  parent.set(startId, null);
  const traversalOrder: number[] = [];
  const edgeOverrides = new Map<string, GraphEdge['state']>();
  const nodeOverrides = new Map<number, Partial<GraphNode>>();

  steps.push({
    nodes: cloneNodes(nodeOverrides),
    edges: cloneEdges(edgeOverrides),
    description: `Starting DFS from ${baseNodes[startId].label}`,
    stack: [startId],
    mstEdges: [],
    distances: baseNodes.map(() => Infinity),
    finished: false,
  });

  function dfs(u: number) {
    visited.add(u);
    traversalOrder.push(u);
    nodeOverrides.set(u, { state: 'visiting' });

    steps.push({
      nodes: cloneNodes(nodeOverrides),
      edges: cloneEdges(edgeOverrides),
      description: `Visit ${baseNodes[u].label}`,
      stack: [],
      mstEdges: [],
      distances: baseNodes.map(() => Infinity),
      finished: false,
    });

    const neighbors = adjList.get(u) || [];
    for (const { to: v } of neighbors) {
      if (!visited.has(v)) {
        edgeOverrides.set(`${u}-${v}`, 'tree');
        parent.set(v, u);
        nodeOverrides.set(v, { state: 'inStack' });

        steps.push({
          nodes: cloneNodes(nodeOverrides),
          edges: cloneEdges(edgeOverrides),
          description: `Explore edge ${baseNodes[u].label} → ${baseNodes[v].label}`,
          stack: [v],
          mstEdges: [],
          distances: baseNodes.map(() => Infinity),
          finished: false,
        });

        dfs(v);
      }
    }

    nodeOverrides.set(u, { state: 'visited' });
    steps.push({
      nodes: cloneNodes(nodeOverrides),
      edges: cloneEdges(edgeOverrides),
      description: `Backtrack from ${baseNodes[u].label}`,
      stack: [],
      mstEdges: [],
      distances: baseNodes.map(() => Infinity),
      finished: false,
    });
  }

  dfs(startId);

  steps.push({
    nodes: cloneNodes(new Map(baseNodes.map((n) => [n.id, { state: visited.has(n.id) ? 'visited' : 'idle' }]))),
    edges: cloneEdges(),
    description: `DFS traversal complete. Order: ${traversalOrder.map((i) => baseNodes[i].label).join(' → ')}`,
    stack: [],
    mstEdges: [],
    distances: baseNodes.map(() => Infinity),
    finished: true,
  });

  return steps;
}

