import type { DSAlgorithm, DSStep } from '../../types';
import { stackOps } from './stackQueue';
import { queueOps } from './stackQueue';
import { linkedListOps } from './linkedList';

export const dsAlgorithms: Record<
  DSAlgorithm,
  { name: string; fn: (values: number[]) => DSStep[]; description: string; complexity: string }
> = {
  stackPush: {
    name: 'Stack Operations',
    fn: (values) => stackOps(values),
    description: 'LIFO: push and pop operations on a stack.',
    complexity: 'O(1) per op',
  },
  stackPop: {
    name: 'Stack Pop',
    fn: (values) => stackOps(values.slice().reverse()),
    description: 'Pop all elements from a stack.',
    complexity: 'O(1) per op',
  },
  queueEnqueue: {
    name: 'Queue Operations',
    fn: (values) => queueOps(values),
    description: 'FIFO: enqueue and dequeue operations.',
    complexity: 'O(1) per op',
  },
  queueDequeue: {
    name: 'Queue Dequeue',
    fn: (values) => queueOps(values),
    description: 'Dequeue elements from a queue.',
    complexity: 'O(1) per op',
  },
  llInsert: {
    name: 'Linked List Insert',
    fn: (values) => linkedListOps(values),
    description: 'Append, reverse, and remove operations on a singly linked list.',
    complexity: 'O(n) reverse',
  },
  llDelete: {
    name: 'Linked List Delete',
    fn: (values) => linkedListOps(values),
    description: 'Delete a node from a linked list.',
    complexity: 'O(n)',
  },
  llReverse: {
    name: 'Linked List Reverse',
    fn: (values) => linkedListOps(values),
    description: 'Reverse a linked list in-place.',
    complexity: 'O(n)',
  },
};

