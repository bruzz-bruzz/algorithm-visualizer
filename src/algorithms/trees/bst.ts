import type { TreeNode, TreeStep } from '../../types';
import { computeTreeLayout } from '../../utils/treeHelpers';

interface BSTNode {
  id: string;
  value: number;
  x: number;
  y: number;
  state: TreeNode['state'];
  parent: string | null;
  left: string | null;
  right: string | null;
}

function makeState(values: number[]): { nodes: Map<string, BSTNode>; root: string | null } {
  const nodes = new Map<string, BSTNode>();
  let root: string | null = null;

  const add = (id: string, val: number, parentId: string | null, dir: 'left' | 'right') => {
    const node: BSTNode = {
      id, value: val, x: 300, y: 40, state: 'idle',
      parent: parentId, left: null, right: null,
    };
    nodes.set(id, node);
    if (parentId) {
      const p = nodes.get(parentId)!;
      if (dir === 'left') p.left = id; else p.right = id;
    }
    return id;
  };

  for (const v of values) {
    if (root === null) { root = add('n0', v, null, 'left'); continue; }
    let cur = root;
    while (true) {
      const cv = nodes.get(cur)!.value;
      if (v < cv) {
        if (nodes.get(cur)!.left === null) { add('n' + nodes.size, v, cur, 'left'); break; }
        cur = nodes.get(cur)!.left!;
      } else if (v > cv) {
        if (nodes.get(cur)!.right === null) { add('n' + nodes.size, v, cur, 'right'); break; }
        cur = nodes.get(cur)!.right!;
      } else break;
    }
  }
  return { nodes, root };
}

function snapshot(
  nodes: Map<string, BSTNode>, root: string | null,
  description: string,
  highlights: Map<string, TreeNode['state']> = new Map(),
  traversalOrder: string[] = [],
  highlightPath: string[] = []
): TreeStep {
  const nodeArr = Array.from(nodes.values()).map((n) => ({
    ...n, state: highlights.get(n.id) ?? 'idle',
  }));
  const edges: Array<{ from: string; to: string }> = [];
  nodes.forEach((n) => {
    if (n.left) edges.push({ from: n.id, to: n.left });
    if (n.right) edges.push({ from: n.id, to: n.right });
  });
  const laid = computeTreeLayout(root, nodeArr, edges);
  return { nodes: laid, edges, description, traversalOrder, highlightPath };
}

export function bstInsert(initial: number[], toInsert: number[]): TreeStep[] {
  const { nodes, root } = makeState(initial);
  const steps: TreeStep[] = [];
  steps.push(snapshot(nodes, root, 'Initial BST', new Map()));

  for (const val of toInsert) {
    const path: string[] = [];
    let cur: string | null = root;

    while (cur !== null) {
      path.push(cur);
      const curVal = nodes.get(cur)!.value;
      const hl = new Map<string, TreeNode['state']>();
      path.forEach((id) => hl.set(id, 'visiting'));
      steps.push(snapshot(nodes, root, `Searching for ${val}: compare with ${curVal}`, hl, [], path));

      if (val === curVal) break;
      if (val < curVal) {
        if (nodes.get(cur)!.left === null) {
          const newId = 'n' + nodes.size;
          nodes.set(newId, { id: newId, value: val, x: 0, y: 0, state: 'idle', parent: cur, left: null, right: null });
          nodes.get(cur)!.left = newId;
          const insHl = new Map<string, TreeNode['state']>();
          insHl.set(newId, 'inserted');
          steps.push(snapshot(nodes, root, `Inserted ${val}`, insHl, [], [...path, newId]));
          break;
        }
        cur = nodes.get(cur)!.left;
      } else {
        if (nodes.get(cur)!.right === null) {
          const newId = 'n' + nodes.size;
          nodes.set(newId, { id: newId, value: val, x: 0, y: 0, state: 'idle', parent: cur, left: null, right: null });
          nodes.get(cur)!.right = newId;
          const insHl = new Map<string, TreeNode['state']>();
          insHl.set(newId, 'inserted');
          steps.push(snapshot(nodes, root, `Inserted ${val}`, insHl, [], [...path, newId]));
          break;
        }
        cur = nodes.get(cur)!.right;
      }
    }
  }

  steps.push(snapshot(nodes, root, 'Insertion complete', new Map()));
  return steps;
}

export function bstSearch(initial: number[], target: number): TreeStep[] {
  const { nodes, root } = makeState(initial);
  const steps: TreeStep[] = [];
  steps.push(snapshot(nodes, root, `Searching for ${target}`, new Map()));

  let cur: string | null = root;
  const path: string[] = [];

  while (cur !== null) {
    path.push(cur);
    const curVal = nodes.get(cur)!.value;
    const hl = new Map<string, TreeNode['state']>();
    path.forEach((id) => hl.set(id, 'visiting'));
    steps.push(snapshot(nodes, root, `Compare ${target} with ${curVal}`, hl, [], path));

    if (curVal === target) {
      const foundHl = new Map<string, TreeNode['state']>();
      foundHl.set(cur, 'found');
      steps.push(snapshot(nodes, root, `Found ${target}!`, foundHl, [], path));
      return steps;
    }
    cur = curVal < target ? nodes.get(cur)!.right : nodes.get(cur)!.left;
  }

  steps.push(snapshot(nodes, root, `${target} not found`, new Map(), [], path));
  return steps;
}

export function treeInorder(initial: number[]): TreeStep[] {
  const { nodes, root } = makeState(initial);
  const steps: TreeStep[] = [];
  const order: string[] = [];
  const visit = (id: string) => {
    const node = nodes.get(id)!;
    if (node.left) visit(node.left);
    order.push(id);
    const hl = new Map<string, TreeNode['state']>();
    hl.set(id, 'visited');
    steps.push(snapshot(nodes, root, `Visit ${node.value} (inorder: ${order.map((i) => nodes.get(i)!.value).join(', ')})`, hl, [], [...order]));
    if (node.right) visit(node.right);
  };
  steps.push(snapshot(nodes, root, 'Inorder: Left, Root, Right', new Map()));
  if (root) visit(root);
  steps.push(snapshot(nodes, root, `Inorder: ${order.map((i) => nodes.get(i)!.value).join(' -> ')}`, new Map(), [], order));
  return steps;
}

export function treePreorder(initial: number[]): TreeStep[] {
  const { nodes, root } = makeState(initial);
  const steps: TreeStep[] = [];
  const order: string[] = [];
  const visit = (id: string) => {
    const node = nodes.get(id)!;
    order.push(id);
    const hl = new Map<string, TreeNode['state']>();
    hl.set(id, 'visited');
    steps.push(snapshot(nodes, root, `Visit ${node.value} (preorder: ${order.map((i) => nodes.get(i)!.value).join(', ')})`, hl, [], [...order]));
    if (node.left) visit(node.left);
    if (node.right) visit(node.right);
  };
  steps.push(snapshot(nodes, root, 'Preorder: Root, Left, Right', new Map()));
  if (root) visit(root);
  steps.push(snapshot(nodes, root, `Preorder: ${order.map((i) => nodes.get(i)!.value).join(' -> ')}`, new Map(), [], order));
  return steps;
}

export function treePostorder(initial: number[]): TreeStep[] {
  const { nodes, root } = makeState(initial);
  const steps: TreeStep[] = [];
  const order: string[] = [];
  const visit = (id: string) => {
    const node = nodes.get(id)!;
    if (node.left) visit(node.left);
    if (node.right) visit(node.right);
    order.push(id);
    const hl = new Map<string, TreeNode['state']>();
    hl.set(id, 'visited');
    steps.push(snapshot(nodes, root, `Visit ${node.value} (postorder: ${order.map((i) => nodes.get(i)!.value).join(', ')})`, hl, [], [...order]));
  };
  steps.push(snapshot(nodes, root, 'Postorder: Left, Right, Root', new Map()));
  if (root) visit(root);
  steps.push(snapshot(nodes, root, `Postorder: ${order.map((i) => nodes.get(i)!.value).join(' -> ')}`, new Map(), [], order));
  return steps;
}

export function treeLevelorder(initial: number[]): TreeStep[] {
  const { nodes, root } = makeState(initial);
  const steps: TreeStep[] = [];
  if (!root) return steps;
  const order: string[] = [];
  const queue: string[] = [root];
  steps.push(snapshot(nodes, root, 'Level-order (BFS) traversal', new Map()));
  while (queue.length > 0) {
    const id = queue.shift()!;
    order.push(id);
    const node = nodes.get(id)!;
    const hl = new Map<string, TreeNode['state']>();
    hl.set(id, 'visited');
    steps.push(snapshot(nodes, root, `Visit ${node.value} (level-order: ${order.map((i) => nodes.get(i)!.value).join(', ')})`, hl, [], [...order]));
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }
  steps.push(snapshot(nodes, root, `Level-order: ${order.map((i) => nodes.get(i)!.value).join(' -> ')}`, new Map(), [], order));
  return steps;
}

