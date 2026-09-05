import type { GraphNode, GraphEdge, GraphStep, AdjacencyList } from '../../types';
import { buildAdjList, initGraphEdges, initGraphNodes } from '../../utils/graphHelpers';

export function graphBFS(
  adj: AdjacencyList,
  startId: number
): GraphStep[] {
  const adjList = buildAdjList(adj);
  const baseNodes = initGraphNodes(adj);
  const baseEdges = initGraphEdges(adj);
  const steps: GraphStep[] = [];

  const cloneNodes = (extra: Partial<GraphNode>[] = []): GraphNode[] =>
    baseNodes.map((n, i) => ({ ...n, ...(extra[i] || {}) }));

  const cloneEdges = (): GraphEdge[] => baseEdges.map((e) => ({ ...e }));

  const setEdge = (edges: GraphEdge[], from: number, to: number, state: GraphEdge['state']) => {
    for (const e of edges) {
      if ((e.from === from && e.to === to) || (e.from === to && e.to === from)) {
        e.state = state;
        e.highlight = true;
      }
    }
  };

  steps.push({
    nodes: cloneNodes(),
    edges: cloneEdges(),
    description: `Starting BFS from node ${baseNodes[startId].label}`,
    queue: [startId],
    mstEdges: [],
    distances: baseNodes.map(() => Infinity),
    finished: false,
  });

  const visited = new Set<number>();
  visited.add(startId);
  const distances = baseNodes.map(() => Infinity);
  distances[startId] = 0;
  const parent = new Map<number, number | null>();
  parent.set(startId, null);
  const queue: number[] = [startId];

  steps.push({
    nodes: cloneNodes([{ id: startId, state: 'visiting', distance: 0 }]),
    edges: cloneEdges(),
    description: `Visit ${baseNodes[startId].label}, distance = 0`,
    queue: [...queue],
    mstEdges: [],
    distances: [...distances],
    finished: false,
  });

  while (queue.length > 0) {
    const u = queue.shift()!;
    const uLabel = baseNodes[u].label;

    const neighbors = adjList.get(u) || [];
    for (const { to: v } of neighbors) {
      if (!visited.has(v)) {
        visited.add(v);
        parent.set(v, u);
        distances[v] = distances[u] + 1;
        queue.push(v);

        const updatedEdges = cloneEdges();
        setEdge(updatedEdges, u, v, 'tree');

        steps.push({
          nodes: cloneNodes([
            { id: u, state: 'visited' },
            { id: v, state: 'inQueue', distance: distances[v], parent: u },
          ]),
          edges: updatedEdges,
          description: `Discover ${baseNodes[v].label} from ${uLabel}, distance = ${distances[v]}`,
          queue: [...queue],
          mstEdges: [],
          distances: [...distances],
          finished: false,
        });
      }
    }

    steps.push({
      nodes: cloneNodes([{ id: u, state: 'visited' }]),
      edges: cloneEdges(),
      description: `Finished processing ${uLabel}`,
      queue: [...queue],
      mstEdges: [],
      distances: [...distances],
      finished: false,
    });
  }

  steps.push({
    nodes: cloneNodes(baseNodes.map((n) => ({ ...n, state: visited.has(n.id) ? 'visited' : 'idle' }))),
    edges: cloneEdges(),
    description: 'BFS traversal complete',
    queue: [],
    mstEdges: [],
    distances: [...distances],
    finished: true,
  });

  return steps;
}

