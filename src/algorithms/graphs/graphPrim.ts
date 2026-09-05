import type { GraphNode, GraphEdge, GraphStep, AdjacencyList } from '../../types';
import { buildAdjList, initGraphEdges, initGraphNodes } from '../../utils/graphHelpers';

export function graphPrim(
  adj: AdjacencyList,
  startId: number
): GraphStep[] {
  const adjList = buildAdjList(adj);
  const baseNodes = initGraphNodes(adj);
  const baseEdges = initGraphEdges(adj);
  const steps: GraphStep[] = [];

  const inMST = new Set<number>([startId]);
  const mstEdges: GraphEdge[] = [];

  steps.push({
    nodes: baseNodes.map((n, i) => ({
      ...n,
      state: i === startId ? 'start' : 'idle',
    })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: `Start Prim's MST from ${baseNodes[startId].label}`,
    mstEdges: [...mstEdges],
    distances: baseNodes.map(() => Infinity),
    finished: false,
  });

  while (inMST.size < baseNodes.length) {
    let bestU = -1;
    let bestV = -1;
    let bestW = Infinity;

    for (const u of inMST) {
      for (const { to: v, weight } of adjList.get(u) || []) {
        if (!inMST.has(v) && weight < bestW) {
          bestW = weight;
          bestU = u;
          bestV = v;
        }
      }
    }

    if (bestU === -1) break;
    inMST.add(bestV);

    const newEdge: GraphEdge = {
      from: bestU,
      to: bestV,
      weight: bestW,
      state: 'tree',
    };
    mstEdges.push(newEdge);

    const updatedEdges = baseEdges.map((e) => {
      if ((e.from === bestU && e.to === bestV) || (e.from === bestV && e.to === bestU)) {
        return { ...e, state: 'accepted' as string };
      }
      return { ...e };
    });

    steps.push({
      nodes: baseNodes.map((n, i) => ({
        ...n,
        state: inMST.has(i) ? 'mst' : 'idle',
      })),
      edges: updatedEdges,
      description: `Add edge ${baseNodes[bestU].label} - ${baseNodes[bestV].label} (weight ${bestW}) to MST`,
      mstEdges: [...mstEdges],
      distances: baseNodes.map(() => Infinity),
      finished: false,
    });
  }

  steps.push({
    nodes: baseNodes.map((n) => ({ ...n, state: 'mst' })),
    edges: baseEdges.map((e) => ({ ...e })),
    description: `Prim's MST complete. Total weight: ${mstEdges.reduce((s, e) => s + e.weight, 0)}`,
    mstEdges: [...mstEdges],
    distances: baseNodes.map(() => Infinity),
    finished: true,
  });

  return steps;
}

