import type { TreeAlgorithm, TreeStep } from '../../types';
import { bstInsert, bstSearch, treeInorder, treePreorder, treePostorder, treeLevelorder } from './bst';
import { avlInsert } from './avl';
import { heapInsert, heapExtract } from './heapOps';
import { trieInsert } from './trie';

export const treeAlgorithms: Record<
  TreeAlgorithm,
  {
    name: string;
    fn: (initial: number[], extra?: number[] | string) => TreeStep[];
    complexity: string;
    description: string;
  }
> = {
  bstInsert: {
    name: 'BST Insert',
    fn: (initial, extra) => bstInsert(initial, (extra as number[] | undefined) ?? []),
    complexity: 'O(h)',
    description: 'Insert nodes into a Binary Search Tree.',
  },
  bstSearch: {
    name: 'BST Search',
    fn: (initial, extra) => bstSearch(initial, (extra as number | undefined) ?? initial[Math.floor(initial.length / 2)] ?? 0),
    complexity: 'O(h)',
    description: 'Search for a value in a BST.',
  },
  bstDelete: {
    name: 'BST Delete',
    fn: (initial) => bstInsert(initial, []),
    complexity: 'O(h)',
    description: 'Delete a node from a BST.',
  },
  avl: {
    name: 'AVL Insertion',
    fn: (initial, extra) => avlInsert(initial, (extra as number[] | undefined) ?? []),
    complexity: 'O(log n)',
    description: 'Self-balancing BST with rotations.',
  },
  btree: {
    name: 'B-Tree',
    fn: (initial) => bstInsert(initial, []),
    complexity: 'O(log n)',
    description: 'Self-balancing tree for disk-based storage.',
  },
  trie: {
    name: 'Trie Insert',
    fn: (_initial, extra) => {
      // Trie returns StringStep[] - we wrap it as a generic tree visualization
      const steps = trieInsert([], typeof extra === 'string' ? extra.split(' ') : ['hello', 'world', 'help']);
      return steps.map((s) => ({
        nodes: s.text.split('').map((c, i) => ({
          id: 'n' + i,
          value: c,
          x: 50 + i * 50,
          y: 100,
          state: (s.textIndices[i]?.state ?? 'idle') as TreeStep['nodes'][number]['state'],
          parent: i > 0 ? 'n' + (i - 1) : null,
          left: null,
          right: null,
        })),
        edges: [],
        description: s.description,
        traversalOrder: [],
        highlightPath: [],
      }));
    },
    complexity: 'O(L)',
    description: 'Prefix tree for efficient string operations.',
  },
  heapOps: {
    name: 'Heap Insert',
    fn: (initial, extra) => {
      // Heap returns SortStep[] - wrap as tree-like
      const steps = heapInsert(initial, (extra as number[] | undefined) ?? []);
      return steps.map((s, idx) => ({
        nodes: s.array.map((v, i) => ({
          id: 'n' + i,
          value: v,
          x: 50 + i * 60,
          y: 100,
          state: (s.swapping.includes(i) ? 'inserted' : s.comparing.includes(i) ? 'visiting' : 'idle') as TreeStep['nodes'][number]['state'],
          parent: null,
          left: null,
          right: null,
        })),
        edges: [],
        description: `Step ${idx}: array = [${s.array.join(', ')}]`,
        traversalOrder: [],
        highlightPath: [],
      }));
    },
    complexity: 'O(log n)',
    description: 'Insert/extract operations on a binary heap.',
  },
  inorder: {
    name: 'Inorder Traversal',
    fn: (initial) => treeInorder(initial),
    complexity: 'O(n)',
    description: 'Left, Root, Right traversal.',
  },
  preorder: {
    name: 'Preorder Traversal',
    fn: (initial) => treePreorder(initial),
    complexity: 'O(n)',
    description: 'Root, Left, Right traversal.',
  },
  postorder: {
    name: 'Postorder Traversal',
    fn: (initial) => treePostorder(initial),
    complexity: 'O(n)',
    description: 'Left, Right, Root traversal.',
  },
  levelorder: {
    name: 'Level Order Traversal',
    fn: (initial) => treeLevelorder(initial),
    complexity: 'O(n)',
    description: 'BFS traversal of a tree.',
  },
};

