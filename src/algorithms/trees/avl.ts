import type { TreeNode, TreeStep } from '../../types';
import { computeTreeLayout } from '../../utils/treeHelpers';

interface AVLNode {
  id: string;
  value: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
}

function nodeHeight(n: AVLNode | null): number {
  return n ? n.height : 0;
}
function balanceFactor(n: AVLNode): number {
  return nodeHeight(n.left) - nodeHeight(n.right);
}
function updateHeight(n: AVLNode) {
  n.height = 1 + Math.max(nodeHeight(n.left), nodeHeight(n.right));
}

function rotateRight(y: AVLNode): AVLNode {
  const x = y.left!;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  updateHeight(y);
  updateHeight(x);
  return x;
}

function rotateLeft(x: AVLNode): AVLNode {
  const y = x.right!;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  updateHeight(x);
  updateHeight(y);
  return y;
}

interface AVLState {
  root: AVLNode | null;
  idCounter: number;
}

function makeAVL(values: number[]): AVLState {
  const state: AVLState = { root: null, idCounter: 0 };
  const insert = (val: number): void => {
    const helper = (node: AVLNode | null): AVLNode => {
      if (!node) {
        const n: AVLNode = { id: 'n' + state.idCounter++, value: val, height: 1, left: null, right: null };
        return n;
      }
      if (val < node.value) node.left = helper(node.left);
      else if (val > node.value) node.right = helper(node.right);
      else return node;
      updateHeight(node);
      const bf = balanceFactor(node);
      if (bf > 1 && val < node.left!.value) return rotateRight(node);
      if (bf < -1 && val > node.right!.value) return rotateLeft(node);
      if (bf > 1 && val > node.left!.value) {
        node.left = rotateLeft(node.left!);
        return rotateRight(node);
      }
      if (bf < -1 && val < node.right!.value) {
        node.right = rotateRight(node.right!);
        return rotateLeft(node);
      }
      return node;
    };
    state.root = helper(state.root);
  };
  for (const v of values) insert(v);
  return state;
}

function snapshotAVL(
  state: AVLState,
  description: string,
  highlights: Map<string, TreeNode['state']> = new Map()
): TreeStep {
  const nodes: TreeNode[] = [];
  const edges: Array<{ from: string; to: string }> = [];
  const visit = (n: AVLNode | null) => {
    if (!n) return;
    nodes.push({
      id: n.id,
      value: n.value,
      x: 0,
      y: 0,
      state: highlights.get(n.id) ?? 'idle',
      parent: null,
      left: n.left?.id ?? null,
      right: n.right?.id ?? null,
    });
    if (n.left) {
      edges.push({ from: n.id, to: n.left.id });
      visit(n.left);
    }
    if (n.right) {
      edges.push({ from: n.id, to: n.right.id });
      visit(n.right);
    }
  };
  visit(state.root);
  const laid = computeTreeLayout(state.root?.id ?? null, nodes, edges);
  return { nodes: laid, edges, description, traversalOrder: [], highlightPath: [] };
}

export function avlInsert(initial: number[], toInsert: number[]): TreeStep[] {
  const state = makeAVL(initial);
  const steps: TreeStep[] = [];
  steps.push(snapshotAVL(state, 'Initial AVL tree', new Map()));

  for (const val of toInsert) {
    const highlights = new Map<string, TreeNode['state']>();
    let cur = state.root;
    while (cur) {
      highlights.set(cur.id, 'visiting');
      steps.push(snapshotAVL(state, `Insert ${val}: visiting ${cur.value}`, highlights));
      if (val === cur.value) break;
      if (val < cur.value) cur = cur.left;
      else cur = cur.right;
      if (!cur) break;
    }

    const insertHelper = (node: AVLNode | null): AVLNode => {
      if (!node) {
        const n: AVLNode = { id: 'n' + state.idCounter++, value: val, height: 1, left: null, right: null };
        return n;
      }
      if (val < node.value) node.left = insertHelper(node.left);
      else if (val > node.value) node.right = insertHelper(node.right);
      else return node;
      updateHeight(node);
      const bf = balanceFactor(node);
      if (bf > 1 && val < node.left!.value) {
        highlights.set(node.id, 'highlight');
        steps.push(snapshotAVL(state, `Imbalanced at ${node.value} (BF=${bf}) - LL rotation`, highlights));
        return rotateRight(node);
      }
      if (bf < -1 && val > node.right!.value) {
        highlights.set(node.id, 'highlight');
        steps.push(snapshotAVL(state, `Imbalanced at ${node.value} (BF=${bf}) - RR rotation`, highlights));
        return rotateLeft(node);
      }
      if (bf > 1 && val > node.left!.value) {
        highlights.set(node.id, 'highlight');
        steps.push(snapshotAVL(state, `Imbalanced at ${node.value} (BF=${bf}) - LR rotation`, highlights));
        node.left = rotateLeft(node.left!);
        return rotateRight(node);
      }
      if (bf < -1 && val < node.right!.value) {
        highlights.set(node.id, 'highlight');
        steps.push(snapshotAVL(state, `Imbalanced at ${node.value} (BF=${bf}) - RL rotation`, highlights));
        node.right = rotateRight(node.right!);
        return rotateLeft(node);
      }
      return node;
    };

    state.root = insertHelper(state.root);
    steps.push(snapshotAVL(state, `Inserted ${val} - AVL property maintained`, new Map()));
  }

  steps.push(snapshotAVL(state, 'AVL insertions complete', new Map()));
  return steps;
}

