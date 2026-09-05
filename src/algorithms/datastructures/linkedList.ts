import type { DSStep } from '../../types';

export function linkedListOps(values: number[]): DSStep[] {
  const steps: DSStep[] = [];
  const ll: number[] = [];
  steps.push({ structure: ll.map((v, i) => ({ id: i, value: v, state: 'idle' })), description: 'Empty linked list' });

  for (const val of values) {
    ll.push(val);
    steps.push({
      structure: ll.map((v, i) => ({ id: i, value: v, state: i === ll.length - 1 ? 'pushed' : 'idle' })),
      description: `Append ${val} -> list: ${ll.join(' -> ')}`,
    });
  }

  steps.push({ structure: ll.map((v, i) => ({ id: i, value: v, state: 'idle' })), description: 'Reverse the list' });
  ll.reverse();
  steps.push({ structure: ll.map((v, i) => ({ id: i, value: v, state: 'idle' })), description: `Reversed: ${ll.join(' -> ')}` });

  if (ll.length > 0) {
    const removed = ll.shift()!;
    steps.push({ structure: ll.map((v, i) => ({ id: i, value: v, state: 'idle' })), description: `Remove head ${removed} -> list: ${ll.join(' -> ')}` });
  }

  return steps;
}

