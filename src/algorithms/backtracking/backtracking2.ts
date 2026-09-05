import type { BacktrackingStep } from '../../types';

export function sudokuSolver(board: number[][]): BacktrackingStep[] {
  const steps: BacktrackingStep[] = [];
  const N = 9;
  const grid: BacktrackingStep['board'] = board.map(row => row.map(v => ({ value: v === 0 ? '.' : `${v}`, state: v === 0 ? 'empty' as string : 'fixed' as string })));
  steps.push({ board: grid.map(r => r.map(c => ({ ...c }))), description: 'Sudoku solver. 0 = empty, fill so each row/col/3x3 has 1-9.', solutionPath: '' });

  const isValid = (r: number, c: number, num: number): boolean => {
    for (let i = 0; i < N; i++) {
      if (grid[r][i].value === `${num}`) return false;
      if (grid[i][c].value === `${num}`) return false;
      const br = 3 * Math.floor(r / 3) + Math.floor(i / 3);
      const bc = 3 * Math.floor(c / 3) + (i % 3);
      if (grid[br][bc].value === `${num}`) return false;
    }
    return true;
  };

  const solve = (r: number, c: number): boolean => {
    if (r === N) return true;
    const nr = c === N - 1 ? r + 1 : r;
    const nc = (c + 1) % N;
    if (grid[r][c].state === 'fixed') return solve(nr, nc);
    for (let num = 1; num <= 9; num++) {
      grid[r][c].state = 'trying';
      steps.push({ board: grid.map(row => row.map(c => ({ ...c }))), description: `Try ${num} at (${r}, ${c})`, solutionPath: '' });
      if (isValid(r, c, num)) {
        grid[r][c].value = `${num}`;
        grid[r][c].state = 'placed';
        steps.push({ board: grid.map(row => row.map(c => ({ ...c }))), description: `Place ${num} at (${r}, ${c})`, solutionPath: '' });
        if (solve(nr, nc)) return true;
        grid[r][c].value = '.';
        grid[r][c].state = 'backtrack';
        steps.push({ board: grid.map(row => row.map(c => ({ ...c }))), description: `Backtrack from (${r}, ${c})`, solutionPath: '' });
      }
    }
    grid[r][c].state = 'empty';
    return false;
  };

  solve(0, 0);
  steps.push({ board: grid.map(r => r.map(c => ({ ...c }))), description: 'Sudoku solved!', solutionPath: '' });
  return steps;
}

export function subsetSumBT(nums: number[], target: number): BacktrackingStep[] {
  const steps: BacktrackingStep[] = [];
  const board: BacktrackingStep['board'] = [nums.map(n => ({ value: `${n}`, state: 'empty' as string }))];
  steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `Subset sum: find subset of [${nums.join(', ')}] summing to ${target}`, solutionPath: '' });

  const current: number[] = [];
  const path: string[] = [];

  const solve = (idx: number, sum: number) => {
    if (sum === target) {
      path.push(`[${current.join(', ')}]`);
      steps.push({ board: board.map(r => r.map((c, i) => ({ ...c, state: current.includes(nums[i]) ? 'placed' as string : 'rejected' as string }))), description: `Found subset: [${current.join(', ')}]`, solutionPath: path.join(', ') });
      return true;
    }
    if (idx === nums.length || sum > target) return false;
    current.push(nums[idx]);
    board[0][idx].state = 'trying';
    steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `Try including ${nums[idx]}, sum = ${sum + nums[idx]}`, solutionPath: '' });
    if (solve(idx + 1, sum + nums[idx])) return true;
    current.pop();
    board[0][idx].state = 'rejected';
    steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `Skip ${nums[idx]}`, solutionPath: '' });
    return solve(idx + 1, sum);
  };

  solve(0, 0);
  steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: 'Search complete', solutionPath: path.join('; ') });
  return steps;
}

export function permutationsBT(nums: number[]): BacktrackingStep[] {
  const steps: BacktrackingStep[] = [];
  const board: BacktrackingStep['board'] = [nums.map(n => ({ value: `${n}`, state: 'empty' as string }))];
  steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `Generate all permutations of [${nums.join(', ')}]`, solutionPath: '' });
  const result: string[] = [];
  const used = new Array(nums.length).fill(false);
  const current: number[] = [];

  const solve = () => {
    if (current.length === nums.length) {
      result.push(`[${current.join(', ')}]`);
      steps.push({ board: board.map(r => r.map((c, i) => ({ ...c, state: used[i] ? 'placed' as string : 'idle' as string }))), description: `Permutation: [${current.join(', ')}]`, solutionPath: result.join('; ') });
      return;
    }
    for (let i = 0; i < nums.length; i++) {
      if (used[i]) continue;
      used[i] = true;
      current.push(nums[i]);
      board[0][i].state = 'trying';
      steps.push({ board: board.map(r => r.map((c, idx) => ({ ...c, state: used[idx] ? 'placed' as string : 'idle' as string }))), description: `Place ${nums[i]} at position ${current.length - 1}`, solutionPath: '' });
      solve();
      current.pop();
      used[i] = false;
      board[0][i].state = 'backtrack';
      steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `Backtrack from position ${current.length}`, solutionPath: '' });
    }
  };

  solve();
  steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `Total permutations: ${result.length}`, solutionPath: result.join('; ') });
  return steps;
}

