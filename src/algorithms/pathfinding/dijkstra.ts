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

export const dijkstra = (
  grid: GridCell[][],
  start: GridCell,
  end: GridCell
): PathStep[] => {
  const steps: PathStep[] = [];
  const visitedNodes: Array<{ row: number; col: number }> = [];

  start.distance = 0;
  const unvisitedNodes: GridCell[] = grid.flat();

  while (unvisitedNodes.length) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift();
    if (!closestNode) break;

    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) break;

    closestNode.isVisited = true;
    visitedNodes.push({ row: closestNode.row, col: closestNode.col });

    steps.push({
      grid: grid.map((row) =>
        row.map((cell) => ({
          ...cell,
          isVisited: cell.isVisited,
        }))
      ),
      visited: [...visitedNodes],
      path: [],
    });

    if (closestNode === end) {
      // Build path
      const path: Array<{ row: number; col: number }> = [];
      let curr: GridCell | null = closestNode;
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

    const neighbors = getNeighbors(closestNode, grid).filter(
      (n) => !n.isVisited && !n.isWall
    );
    for (const neighbor of neighbors) {
      const tentativeDistance = closestNode.distance + 1;
      if (tentativeDistance < neighbor.distance) {
        neighbor.distance = tentativeDistance;
        neighbor.previousNode = closestNode;
      }
    }
  }

  return steps;
};

