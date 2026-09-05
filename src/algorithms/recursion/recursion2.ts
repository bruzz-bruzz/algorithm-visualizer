import type { RecursionStep } from '../../types';

export function towerOfHanoi(n: number): RecursionStep[] {
  const steps: RecursionStep[] = [];
  const rods: { A: number[]; B: number[]; C: number[] } = { A: [], B: [], C: [] };
  for (let i = n; i >= 1; i--) rods.A.push(i);

  steps.push({
    callStack: [{ id: 0, args: `hanoi(${n}, A, C, B)`, returnValue: '', state: 'active' }],
    description: `Tower of Hanoi with ${n} disks: move from A to C using B`,
    output: [],
    rods: { A: [...rods.A], B: [...rods.B], C: [...rods.C] },
  });

  const move = (disk: number, from: 'A' | 'B' | 'C', to: 'A' | 'B' | 'C', via: 'A' | 'B' | 'C') => {
    if (disk === 1) {
      rods[from].pop();
      rods[to].push(1);
      steps.push({
        callStack: [],
        description: `Move disk 1 from ${from} to ${to}`,
        output: [`Move 1: ${from} -> ${to}`],
        rods: { A: [...rods.A], B: [...rods.B], C: [...rods.C] },
        currentMove: { from, to },
      });
      return;
    }
    move(disk - 1, from, via, to);
    rods[from].pop();
    rods[to].push(disk);
    steps.push({
      callStack: [],
      description: `Move disk ${disk} from ${from} to ${to}`,
      output: [`Move ${disk}: ${from} -> ${to}`],
      rods: { A: [...rods.A], B: [...rods.B], C: [...rods.C] },
      currentMove: { from, to },
    });
    move(disk - 1, via, to, from);
  };

  move(n, 'A', 'C', 'B');
  steps.push({
    callStack: [],
    description: `Complete! All disks on C`,
    output: [`Total moves: ${steps.length - 1}`],
    rods: { A: [...rods.A], B: [...rods.B], C: [...rods.C] },
  });
  return steps;
}

export function josephus(n: number, k: number): RecursionStep[] {
  const steps: RecursionStep[] = [];
  const callStack = [] as RecursionStep['callStack'];
  const output: string[] = [];
  const people: number[] = Array.from({ length: n }, (_, i) => i + 1);

  const helper = (arr: number[], start: number): number => {
    const frame = { id: callStack.length, args: `josephus(${arr.length}, ${k}, start=${start})`, state: 'active' as string, returnValue: '' };
    callStack.push(frame);
    steps.push({ callStack: [...callStack], description: `Call josephus on [${arr.join(',')}] starting at ${start}`, output: [...output] });
    if (arr.length === 1) {
      frame.state = 'returning';
      frame.returnValue = `${arr[0]}`;
      output.push(`Winner: ${arr[0]}`);
      steps.push({ callStack: [...callStack], description: `Base case: winner is ${arr[0]}`, output: [...output] });
      return arr[0];
    }
    const idx = (start + k - 1) % arr.length;
    const removed = arr[idx];
    output.push(`Eliminate ${removed} at index ${idx}`);
    const next = [...arr.slice(0, idx), ...arr.slice(idx + 1)];
    return helper(next, idx % Math.max(1, next.length));
  };
  helper(people, 0);
  return steps;
}





