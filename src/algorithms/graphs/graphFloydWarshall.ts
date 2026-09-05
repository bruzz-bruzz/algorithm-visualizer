import type { GraphStep, AdjacencyList } from '../../types';
import { buildAdjMatrix, initGraphEdges, initGraphNodes } from '../../utils/graphHelpers';

export function graphFloydWarshall(adj: AdjacencyList, _startId?: number): GraphStep[] {
  const baseNodes = initGraphNodes(adj);
  const baseEdges = initGraphEdges(adj);
  const steps: GraphStep[] = [];

  const n = baseNodes.length;
  const dist = buildAdjMatrix(adj);

  steps.push({
    nodes: baseNodes.map((n) => ({ ...n, distance: 0 })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: 'Initialize distance matrix D(0)',
    mstEdges: [],
    distances: dist.flat(),
    finished: false,
  });

  for (let k = 0; k < n; k++) {
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (dist[i][k] + dist[k][j] < dist[i][j]) {
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }

    steps.push({
      nodes: baseNodes.map((node, idx) => ({
        ...node,
        state: idx === k ? 'visiting' : 'idle',
      })),
      edges: baseEdges.map((e) => ({ ...e })),
      description: `After considering intermediate vertex ${baseNodes[k].label}: all-pairs shortest paths updated`,
      mstEdges: [],
      distances: dist.flat(),
      finished: false,
    });
  }

  steps.push({
    nodes: baseNodes.map((n) => ({ ...n, state: 'visited' })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: 'Floyd-Warshall complete. All-pairs shortest distances computed.',
    mstEdges: [],
    distances: dist.flat(),
    finished: true,
  });

  return steps;
}

