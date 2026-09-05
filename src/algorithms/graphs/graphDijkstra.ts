import type { GraphNode, GraphEdge, GraphStep, AdjacencyList } from '../../types';
import { buildAdjList, initGraphEdges, initGraphNodes } from '../../utils/graphHelpers';

export function graphDijkstra(
  adj: AdjacencyList,
  startId: number
): GraphStep[] {
  const adjList = buildAdjList(adj);
  const baseNodes = initGraphNodes(adj);
  const baseEdges = initGraphEdges(adj);
  const steps: GraphStep[] = [];

  const distances = baseNodes.map(() => Infinity);
  const visited = new Set<number>();
  const parent = new Map<number, number | null>();
  distances[startId] = 0;
  parent.set(startId, null);

  steps.push({
    nodes: baseNodes.map((n, i) => ({ ...n, distance: distances[i] })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: `Initialize: dist[${baseNodes[startId].label}] = 0, others = ∞`,
    queue: [startId],
    mstEdges: [],
    distances: [...distances],
    finished: false,
  });

  while (visited.size < baseNodes.length) {
    // Find unvisited node with minimum distance
    let u = -1;
    let minDist = Infinity;
    for (let i = 0; i < distances.length; i++) {
      if (!visited.has(i) && distances[i] < minDist) {
        minDist = distances[i];
        u = i;
      }
    }

    if (u === -1 || distances[u] === Infinity) break;
    visited.add(u);

    steps.push({
      nodes: baseNodes.map((n, i) => ({
        ...n,
        distance: distances[i],
        state: visited.has(i) ? 'visited' : i === u ? 'visiting' : 'idle',
      })),
      edges: baseEdges.map((e) => ({ ...e })),
      description: `Pick min-distance unvisited node: ${baseNodes[u].label} (dist = ${distances[u]})`,
      mstEdges: [],
      distances: [...distances],
      finished: false,
    });

    const neighbors = adjList.get(u) || [];
    for (const { to: v, weight } of neighbors) {
      if (visited.has(v)) continue;
      const newDist = distances[u] + weight;

      const updatedEdges = baseEdges.map((e) => {
        if ((e.from === u && e.to === v) || (e.from === v && e.to === u)) {
          return { ...e, state: 'considering' as string };
        }
        return { ...e };
      });

      steps.push({
        nodes: baseNodes.map((n, i) => ({
          ...n,
          distance: distances[i],
          state: visited.has(i) ? 'visited' : i === u ? 'visiting' : i === v ? 'active' : 'idle',
        })),
        edges: updatedEdges,
        description: `Relax edge ${baseNodes[u].label} → ${baseNodes[v].label}: ${distances[u]} + ${weight} = ${newDist}${newDist < distances[v] ? ` < ${distances[v]} ✓` : ` ≥ ${distances[v]} ✗`}`,
        mstEdges: [],
        distances: [...distances],
        finished: false,
      });

      if (newDist < distances[v]) {
        distances[v] = newDist;
        parent.set(v, u);
      }
    }

    steps.push({
      nodes: baseNodes.map((n, i) => ({
        ...n,
        distance: distances[i],
        state: visited.has(i) ? 'visited' : 'idle',
      })),
      edges: baseEdges.map((e) => ({ ...e })),
      description: `After processing ${baseNodes[u].label}: distances = [${distances.map((d) => (d === Infinity ? '∞' : d)).join(', ')}]`,
      mstEdges: [],
      distances: [...distances],
      finished: false,
    });
  }

  steps.push({
    nodes: baseNodes.map((n, i) => ({
      ...n,
      distance: distances[i],
      state: visited.has(i) ? 'visited' : 'idle',
    })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: 'Dijkstra complete. Shortest distances computed.',
    mstEdges: [],
    distances: [...distances],
    finished: true,
  });

  return steps;
}

