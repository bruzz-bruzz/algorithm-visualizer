import type { RecursionStep } from '../../types';

export function powerSet(nums: number[]): RecursionStep[] {
  const steps: RecursionStep[] = [];
  const callStack = [] as RecursionStep['callStack'];
  const output: string[] = [];
  const result: number[][] = [];

  const helper = (idx: number, current: number[]) => {
    const frame = { id: callStack.length, args: `powerset(idx=${idx}, [${current.join(',')}])`, state: 'active' as string, returnValue: '' };
    callStack.push(frame);
    steps.push({ callStack: [...callStack], description: `powerset(idx=${idx}, [${current.join(',')}])`, output: [...output] });
    if (idx === nums.length) {
      result.push([...current]);
      output.push(`{ ${current.join(', ')} }`);
      frame.state = 'returning';
      frame.returnValue = `{${current.join(',')}}`;
      steps.push({ callStack: [...callStack], description: `Add subset {${current.join(', ')}}`, output: [...output] });
      return;
    }
    helper(idx + 1, [...current]);
    helper(idx + 1, [...current, nums[idx]]);
  };
  helper(0, []);
  steps.push({ callStack: [], description: `Total subsets: ${result.length}`, output: [...output, `Result: ${result.map(s => '{' + s.join(',') + '}').join(', ')}`] });
  return steps;
}





