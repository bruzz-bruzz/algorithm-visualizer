import type { BacktrackingStep } from '../../types';

function makeBoard(n: number, fill: string = '.'): BacktrackingStep['board'] {
  return Array.from({ length: n }, () =>
    Array.from({ length: n }, () => ({ value: fill, state: 'empty' as string }))
  );
}

export function nQueens(n: number): BacktrackingStep[] {
  const steps: BacktrackingStep[] = [];
  const board = makeBoard(n);
  steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `N-Queens problem with N=${n}. Place ${n} queens so none attack each other.`, solutionPath: '' });

  const isSafe = (row: number, col: number): boolean => {
    for (let i = 0; i < row; i++) {
      if (board[i][col].value === 'Q') return false;
      if (col - (row - i) >= 0 && board[i][col - (row - i)].value === 'Q') return false;
      if (col + (row - i) < n && board[i][col + (row - i)].value === 'Q') return false;
    }
    return true;
  };

  const solve = (row: number): boolean => {
    if (row === n) return true;
    for (let col = 0; col < n; col++) {
      board[row][col].state = 'trying';
      steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `Try queen at (${row}, ${col})`, solutionPath: '' });
      if (isSafe(row, col)) {
        board[row][col].value = 'Q';
        board[row][col].state = 'placed';
        steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `Place queen at (${row}, ${col}) - safe!`, solutionPath: '' });
        if (solve(row + 1)) return true;
        board[row][col].value = '.';
        board[row][col].state = 'backtrack';
        steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `Backtrack from (${row}, ${col})`, solutionPath: '' });
      } else {
        board[row][col].state = 'conflict';
        steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `Conflict at (${row}, ${col}) - under attack`, solutionPath: '' });
        board[row][col].state = 'empty';
      }
    }
    return false;
  };

  solve(0);
  steps.push({ board: board.map(r => r.map(c => ({ ...c, state: c.value === 'Q' ? 'placed' : 'empty' }))), description: 'N-Queens solution complete!', solutionPath: '' });
  return steps;
}

export function ratInMaze(maze: number[][]): BacktrackingStep[] {
  const steps: BacktrackingStep[] = [];
  const n = maze.length;
  const board: BacktrackingStep['board'] = maze.map(row => row.map(v => ({ value: v ? '.' : 'X', state: v ? 'empty' as string : 'fixed' as string })));
  steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: `Rat in maze (1=open, 0=wall). Find path from (0,0) to (${n-1},${n-1}).`, solutionPath: '' });

  const solve = (r: number, c: number): boolean => {
    if (r === n - 1 && c === n - 1) {
      board[r][c].value = 'P';
      board[r][c].state = 'placed';
      steps.push({ board: board.map(row => row.map(cell => ({ ...cell }))), description: `Reached destination!`, solutionPath: `${steps.length}` });
      return true;
    }
    if (r < 0 || c < 0 || r >= n || c >= n) return false;
    if (board[r][c].value === 'X' || board[r][c].state === 'placed' || board[r][c].state === 'backtrack') return false;
    board[r][c].value = 'P';
    board[r][c].state = 'placed';
    steps.push({ board: board.map(row => row.map(cell => ({ ...cell }))), description: `Mark path at (${r}, ${c})`, solutionPath: '' });
    if (solve(r + 1, c) || solve(r, c + 1)) return true;
    board[r][c].state = 'backtrack';
    board[r][c].value = '.';
    steps.push({ board: board.map(row => row.map(cell => ({ ...cell }))), description: `Backtrack from (${r}, ${c})`, solutionPath: '' });
    return false;
  };

  solve(0, 0);
  steps.push({ board: board.map(r => r.map(c => ({ ...c }))), description: 'Maze solving complete', solutionPath: '' });
  return steps;
}

