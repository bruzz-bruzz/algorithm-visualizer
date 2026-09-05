import type { GridCell, PathStep } from '../../types';

const getNeighbors = (node: GridCell, grid: GridCell[][]): GridCell[] => {
  const neighbors: GridCell[] = [];
  const { row, col } = node;
  const directions = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];

  for (const [dr, dc] of directions) {
    const r = row + dr;
    const c = col + dc;
    if (r >= 0 && r < grid.length && c >= 0 && c < grid[0].length) {
      neighbors.push(grid[r][c]);
    }
  }
  return neighbors;
};

export const bfs = (
  grid: GridCell[][],
  start: GridCell,
  end: GridCell
): PathStep[] => {
  const steps: PathStep[] = [];
  const visitedNodes: Array<{ row: number; col: number }> = [];
  const queue: GridCell[] = [start];
  start.isVisited = true;

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    if (current.isWall) continue;

    visitedNodes.push({ row: current.row, col: current.col });

    steps.push({
      grid: grid.map((row) =>
        row.map((cell) => ({ ...cell, isVisited: cell.isVisited }))
      ),
      visited: [...visitedNodes],
      path: [],
    });

    if (current === end) {
      const path: Array<{ row: number; col: number }> = [];
      let curr: GridCell | null = current;
      while (curr) {
        path.unshift({ row: curr.row, col: curr.col });
        curr = curr.previousNode;
      }
      steps.push({
        grid,
        visited: [...visitedNodes],
        path,
      });
      return steps;
    }

    const neighbors = getNeighbors(current, grid).filter(
      (n) => !n.isVisited && !n.isWall
    );
    for (const neighbor of neighbors) {
      neighbor.isVisited = true;
      neighbor.previousNode = current;
      queue.push(neighbor);
    }
  }

  return steps;
};

