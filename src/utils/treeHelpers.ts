import type { TreeNode } from '../types';

// Compute tree layout positions given root and children
export function computeTreeLayout(
  rootId: string | null,
  nodes: TreeNode[],
  edges: Array<{ from: string; to: string }>
): TreeNode[] {
  if (!rootId) return nodes;

  const childrenMap = new Map<string, string[]>();
  for (const e of edges) {
    if (!childrenMap.has(e.from)) childrenMap.set(e.from, []);
    childrenMap.get(e.from)!.push(e.to);
  }

  // Compute subtree widths (in leaves)
  const widthCache = new Map<string, number>();
  const computeWidth = (id: string): number => {
    if (widthCache.has(id)) return widthCache.get(id)!;
    const children = childrenMap.get(id) || [];
    if (children.length === 0) {
      widthCache.set(id, 1);
      return 1;
    }
    const w = children.reduce((sum, c) => sum + computeWidth(c), 0);
    widthCache.set(id, w);
    return w;
  };

  const xs = new Map<string, number>();
  const placeNodes = (
    id: string,
    leftEdge: number,
    depth: number,
    xSpacing: number,
    ySpacing: number
  ) => {
    const width = computeWidth(id);
    const centerX = leftEdge + (width * xSpacing) / 2;
    xs.set(id, centerX);
    const children = childrenMap.get(id) || [];
    let childLeft = leftEdge;
    for (const child of children) {
      placeNodes(child, childLeft, depth + 1, xSpacing, ySpacing);
      childLeft += computeWidth(child) * xSpacing;
    }
  };

  placeNodes(rootId, 0, 0, 60, 80);

  return nodes.map((n) => ({
    ...n,
    x: xs.get(n.id) ?? 0,
    y: depthOf(n.id, rootId, childrenMap) * 80 + 40,
  }));
}

function depthOf(
  id: string,
  rootId: string | null,
  childrenMap: Map<string, string[]>
): number {
  // BFS from root
  if (rootId === id) return 0;
  const visited = new Set([rootId!]);
  const queue: Array<[string, number]> = [[rootId!, 0]];
  while (queue.length) {
    const [cur, depth] = queue.shift()!;
    const children = childrenMap.get(cur) || [];
    for (const c of children) {
      if (c === id) return depth + 1;
      if (!visited.has(c)) {
        visited.add(c);
        queue.push([c, depth + 1]);
      }
    }
  }
  return 0;
}
