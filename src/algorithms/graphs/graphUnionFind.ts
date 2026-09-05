import type { GraphStep, AdjacencyList } from '../../types';
import { initGraphEdges, initGraphNodes } from '../../utils/graphHelpers';

export function graphUnionFind(adj: AdjacencyList, _startId?: number): GraphStep[] {
  const baseNodes = initGraphNodes(adj);
  const baseEdges = initGraphEdges(adj);
  const steps: GraphStep[] = [];

  const parent = baseNodes.map((_, i) => i);
  const rank = baseNodes.map(() => 0);

  const find = (i: number): number => {
    while (parent[i] !== i) {
      parent[i] = parent[parent[i]]; // path compression
      i = parent[i];
    }
    return i;
  };

  const union = (i: number, j: number): boolean => {
    const ri = find(i);
    const rj = find(j);
    if (ri === rj) return false;
    if (rank[ri] < rank[rj]) parent[ri] = rj;
    else if (rank[ri] > rank[rj]) parent[rj] = ri;
    else {
      parent[rj] = ri;
      rank[ri]++;
    }
    return true;
  };

  steps.push({
    nodes: baseNodes.map((n) => ({ ...n, state: 'idle' })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: `Initialize: each node is its own set. parent = [${parent.join(', ')}]`,
    mstEdges: [],
    distances: [...parent],
    finished: false,
  });

  let componentCount = baseNodes.length;
  for (const edge of baseEdges) {
    const u = edge.from;
    const v = edge.to;

    steps.push({
      nodes: baseNodes.map((n, i) => ({
        ...n,
        state: find(i) === find(u) || find(i) === find(v) ? 'active' : 'idle',
      })),
      edges: baseEdges.map((e) =>
        e.from === edge.from && e.to === edge.to ? { ...e, state: 'considering' } : { ...e }
      ),
      description: `Process edge ${baseNodes[u].label} - ${baseNodes[v].label}: find(${baseNodes[u].label}) = ${baseNodes[find(u)].label}, find(${baseNodes[v].label}) = ${baseNodes[find(v)].label}`,
      mstEdges: [],
      distances: [...parent],
      finished: false,
    });

    if (union(u, v)) {
      componentCount--;
      steps.push({
        nodes: baseNodes.map((n, i) => ({
          ...n,
          state: find(i) === find(u) ? 'mst' : 'idle',
        })),
        edges: baseEdges.map((e) =>
          e.from === edge.from && e.to === edge.to ? { ...e, state: 'accepted' } : { ...e }
        ),
        description: `Union: ${baseNodes[u].label} and ${baseNodes[v].label} now in same set. Components: ${componentCount}`,
        mstEdges: [],
        distances: [...parent],
        finished: false,
      });
    } else {
      steps.push({
        nodes: baseNodes.map((n, i) => ({
          ...n,
          state: find(i) === find(u) ? 'cycle' : 'idle',
        })),
        edges: baseEdges.map((e) =>
          e.from === edge.from && e.to === edge.to ? { ...e, state: 'rejected' } : { ...e }
        ),
        description: `Already in same set — would form cycle. Components: ${componentCount}`,
        mstEdges: [],
        distances: [...parent],
        finished: false,
      });
    }
  }

  steps.push({
    nodes: baseNodes.map((n) => ({ ...n, state: 'mst' })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: `Union-Find complete. Final components: ${componentCount}. parent = [${parent.join(', ')}]`,
    mstEdges: [],
    distances: [...parent],
    finished: true,
  });

  return steps;
}

