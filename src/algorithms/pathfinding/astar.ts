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

const manhattan = (a: GridCell, b: GridCell): number => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

export const aStar = (
  grid: GridCell[][],
  start: GridCell,
  end: GridCell
): PathStep[] => {
  const steps: PathStep[] = [];
  const visitedNodes: Array<{ row: number; col: number }> = [];

  start.gScore = 0;
  start.fScore = manhattan(start, end);
  start.previousNode = null;

  const openSet: GridCell[] = [start];

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.fScore - b.fScore);
    const current = openSet.shift();
    if (!current) break;
    if (current.isWall) continue;

    current.isVisited = true;
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
      const tentativeG = current.gScore + 1;
      if (tentativeG < neighbor.gScore) {
        neighbor.previousNode = current;
        neighbor.gScore = tentativeG;
        neighbor.hScore = manhattan(neighbor, end);
        neighbor.fScore = neighbor.gScore + neighbor.hScore;
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return steps;
};

