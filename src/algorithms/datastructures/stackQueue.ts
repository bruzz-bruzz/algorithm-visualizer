import type { DSStep } from '../../types';

export function stackOps(values: number[]): DSStep[] {
  const steps: DSStep[] = [];
  const stack: number[] = [];

  steps.push({ structure: stack.map((v, i) => ({ id: i, value: v, state: 'idle' })), description: 'Empty stack' });

  for (const val of values) {
    stack.push(val);
    steps.push({ structure: stack.map((v, i) => ({ id: i, value: v, state: i === stack.length - 1 ? 'pushed' : 'idle' })), description: `Push ${val} -> stack: [${stack.join(', ')}]` });
  }

  steps.push({ structure: stack.map((v, i) => ({ id: i, value: v, state: 'idle' })), description: 'Now pop all' });
  while (stack.length > 0) {
    const v = stack.pop()!;
    steps.push({ structure: stack.map((v, i) => ({ id: i, value: v, state: 'idle' })), description: `Popped ${v} -> stack: [${stack.join(', ')}]` });
  }
  return steps;
}

export function queueOps(values: number[]): DSStep[] {
  const steps: DSStep[] = [];
  const queue: number[] = [];

  steps.push({ structure: queue.map((v, i) => ({ id: i, value: v, state: 'idle' })), description: 'Empty queue' });

  for (const val of values) {
    queue.push(val);
    steps.push({ structure: queue.map((v, i) => ({ id: i, value: v, state: i === queue.length - 1 ? 'pushed' : 'idle' })), description: `Enqueue ${val} -> queue: [${queue.join(', ')}]` });
  }

  while (queue.length > 0) {
    const v = queue.shift()!;
    steps.push({ structure: queue.map((v, i) => ({ id: i, value: v, state: 'idle' })), description: `Dequeued ${v} -> queue: [${queue.join(', ')}]` });
  }
  return steps;
}

