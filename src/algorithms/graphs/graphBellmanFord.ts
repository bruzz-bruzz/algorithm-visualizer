import type { GraphStep, AdjacencyList } from '../../types';
import { initGraphEdges, initGraphNodes } from '../../utils/graphHelpers';

export function graphBellmanFord(
  adj: AdjacencyList,
  startId: number
): GraphStep[] {
  const baseNodes = initGraphNodes(adj);
  const baseEdges = initGraphEdges(adj);
  const steps: GraphStep[] = [];

  const distances = baseNodes.map(() => Infinity);
  distances[startId] = 0;

  steps.push({
    nodes: baseNodes.map((n, i) => ({ ...n, distance: distances[i] })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: `Initialize: dist[${baseNodes[startId].label}] = 0, others = ∞`,
    mstEdges: [],
    distances: [...distances],
    finished: false,
  });

  const V = baseNodes.length;

  // Relax edges V-1 times
  for (let i = 0; i < V - 1; i++) {
    let updated = false;

    steps.push({
      nodes: baseNodes.map((n, idx) => ({ ...n, distance: distances[idx] })),
      edges: baseEdges.map((e) => ({ ...e })),
      description: `Iteration ${i + 1} of ${V - 1}`,
      mstEdges: [],
      distances: [...distances],
      finished: false,
    });

    for (const edge of baseEdges) {
      const u = edge.from;
      const v = edge.to;
      const w = edge.weight;
      if (distances[u] !== Infinity && distances[u] + w < distances[v]) {
        const oldDist = distances[v];
        distances[v] = distances[u] + w;

        steps.push({
          nodes: baseNodes.map((n, idx) => ({
            ...n,
            distance: distances[idx],
            state: idx === u ? 'visiting' : idx === v ? 'active' : 'idle',
          })),
          edges: baseEdges.map((e) =>
            e.from === edge.from && e.to === edge.to
              ? { ...e, state: 'accepted' }
              : { ...e }
          ),
          description: `Relax ${baseNodes[u].label} → ${baseNodes[v].label}: ${distances[u]} + ${w} = ${distances[v]} < ${oldDist}`,
          mstEdges: [],
          distances: [...distances],
          finished: false,
        });
        updated = true;
      } else {
        steps.push({
          nodes: baseNodes.map((n, idx) => ({
            ...n,
            distance: distances[idx],
            state: idx === u ? 'visiting' : idx === v ? 'idle' : 'idle',
          })),
          edges: baseEdges.map((e) =>
            e.from === edge.from && e.to === edge.to
              ? { ...e, state: 'considering' }
              : { ...e }
          ),
          description: `Skip ${baseNodes[u].label} → ${baseNodes[v].label}: ${distances[u]} + ${w} = ${distances[u] + w} ≥ ${distances[v]}`,
          mstEdges: [],
          distances: [...distances],
          finished: false,
        });
      }
    }

    if (!updated) break;
  }

  // Check for negative cycles
  let hasNegCycle = false;
  for (const edge of baseEdges) {
    if (distances[edge.from] !== Infinity && distances[edge.from] + edge.weight < distances[edge.to]) {
      hasNegCycle = true;
      break;
    }
  }

  steps.push({
    nodes: baseNodes.map((n, i) => ({ ...n, distance: distances[i], state: 'visited' })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: hasNegCycle
      ? 'Negative weight cycle detected!'
      : 'Bellman-Ford complete. No negative cycles.',
    mstEdges: [],
    distances: [...distances],
    finished: true,
  });

  return steps;
}

