import type { RecursionStep } from '../../types';

export function factorial(n: number): RecursionStep[] {
  const steps: RecursionStep[] = [];
  const callStack = [] as RecursionStep['callStack'];
  const output: string[] = [];

  const helper = (k: number): number => {
    const frame = { id: callStack.length, args: `factorial(${k})`, state: 'active' as string, returnValue: '' };
    callStack.push(frame);
    steps.push({ callStack: [...callStack], description: `Call factorial(${k})`, output: [...output] });
    if (k <= 1) {
      frame.state = 'returning';
      frame.returnValue = '1';
      output.push(`factorial(${k}) = 1`);
      steps.push({ callStack: [...callStack], description: `Base case: factorial(${k}) = 1`, output: [...output] });
      return 1;
    }
    const sub = helper(k - 1);
    const result = k * sub;
    frame.state = 'returning';
    frame.returnValue = `${result}`;
    output.push(`factorial(${k}) = ${k} * factorial(${k - 1}) = ${result}`);
    steps.push({ callStack: [...callStack], description: `Return factorial(${k}) = ${result}`, output: [...output] });
    return result;
  };
  helper(n);
  steps.push({ callStack: [], description: `Final: factorial(${n}) = ${output[output.length - 1]?.split(' = ').pop()}`, output: [...output] });
  return steps;
}

export function fibonacci(n: number): RecursionStep[] {
  const steps: RecursionStep[] = [];
  const callStack = [] as RecursionStep['callStack'];
  const output: string[] = [];

  const helper = (k: number): number => {
    const frame = { id: callStack.length, args: `fib(${k})`, state: 'active' as string, returnValue: '' };
    callStack.push(frame);
    steps.push({ callStack: [...callStack], description: `Call fib(${k})`, output: [...output] });
    if (k <= 1) {
      frame.state = 'returning';
      frame.returnValue = `${k}`;
      output.push(`fib(${k}) = ${k}`);
      steps.push({ callStack: [...callStack], description: `Base case: fib(${k}) = ${k}`, output: [...output] });
      return k;
    }
    const a = helper(k - 1);
    const b = helper(k - 2);
    const result = a + b;
    frame.state = 'returning';
    frame.returnValue = `${result}`;
    output.push(`fib(${k}) = fib(${k - 1}) + fib(${k - 2}) = ${a} + ${b} = ${result}`);
    steps.push({ callStack: [...callStack], description: `Return fib(${k}) = ${result}`, output: [...output] });
    return result;
  };
  helper(n);
  return steps;
}






