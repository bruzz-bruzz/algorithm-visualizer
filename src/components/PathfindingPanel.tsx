import { useEffect, useRef, useState } from 'react';
import GridVisualizer from './GridVisualizer';
import ControlBar from './ControlBar';
import { pathfindingAlgorithms } from '../algorithms/pathfinding';
import type {
  GridCell,
  PathStep,
  PathfindingAlgorithm,
} from '../types';
import { useAnimation } from '../hooks/useAnimation';

const ALGORITHM_KEYS = Object.keys(
  pathfindingAlgorithms
) as PathfindingAlgorithm[];

const ROWS = 20;
const COLS = 40;

function createInitialGrid(): GridCell[][] {
  const grid: GridCell[][] = [];
  for (let r = 0; r < ROWS; r++) {
    const row: GridCell[] = [];
    for (let c = 0; c < COLS; c++) {
      row.push({
        row: r,
        col: c,
        isWall: false,
        isStart: r === 10 && c === 5,
        isEnd: r === 10 && c === 35,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        fScore: Infinity,
        gScore: Infinity,
        hScore: 0,
        previousNode: null,
      });
    }
    grid.push(row);
  }
  return grid;
}
export default function PathfindingPanel() {
  const [algorithm, setAlgorithm] = useState<PathfindingAlgorithm>('dijkstra');
  const [grid, setGrid] = useState<GridCell[][]>(createInitialGrid());
  const [stats, setStats] = useState({ visited: 0, pathLength: 0 });

  const animation = useAnimation<PathStep>();
  const algoInfo = pathfindingAlgorithms[algorithm];

  const isMouseDownRef = useRef(false);
  const wallModeRef = useRef<'wall' | 'erase'>('wall');
  const movingRef = useRef<'start' | 'end' | null>(null);

  const generateGrid = () => {
    const newGrid = createInitialGrid();
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (Math.random() < 0.25) {
          if (!(newGrid[r][c].isStart || newGrid[r][c].isEnd)) {
            newGrid[r][c].isWall = true;
          }
        }
      }
    }
    setGrid(newGrid);
    animation.setStepData([]);
    setStats({ visited: 0, pathLength: 0 });
  };

  const clearPath = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        fScore: Infinity,
        gScore: Infinity,
        previousNode: null,
      }))
    );
    setGrid(newGrid);
    animation.setStepData([]);
    setStats({ visited: 0, pathLength: 0 });
  };

  const clearWalls = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isWall: false,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        fScore: Infinity,
        gScore: Infinity,
        previousNode: null,
      }))
    );
    setGrid(newGrid);
    animation.setStepData([]);
    setStats({ visited: 0, pathLength: 0 });
  };

  const runAlgorithm = () => {
    const freshGrid: GridCell[][] = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        isVisited: false,
        isPath: false,
        distance: Infinity,
        fScore: Infinity,
        gScore: Infinity,
        previousNode: null,
      }))
    );

    const startNode = freshGrid.flat().find((c) => c.isStart);
    const endNode = freshGrid.flat().find((c) => c.isEnd);
    if (!startNode || !endNode) return;

    const steps = algoInfo.fn(freshGrid, startNode, endNode);
    animation.setStepData(steps);
  };

  useEffect(() => {
    clearPath();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [algorithm]);

  useEffect(() => {
    const data = animation.currentData;
    if (!data) {
      setStats({ visited: 0, pathLength: 0 });
      return;
    }
    setStats({
      visited: data.visited.length,
      pathLength: data.path.length > 0 ? data.path.length - 1 : 0,
    });
  }, [animation.currentStep, animation.currentData]);

  const displayGrid = (() => {
    const data = animation.currentData;
    if (!data) return grid;
    return grid.map((row) =>
      row.map((cell) => {
        const inVisited = data.visited.some(
          (v) => v.row === cell.row && v.col === cell.col
        );
        const inPath = data.path.some(
          (p) => p.row === cell.row && p.col === cell.col
        );
        return {
          ...cell,
          isVisited: inVisited,
          isPath: inPath,
        };
      })
    );
  })();

  const handleCellMouseDown = (row: number, col: number) => {
    const cell = grid[row][col];
    if (cell.isStart) {
      movingRef.current = 'start';
      isMouseDownRef.current = true;
      return;
    }
    if (cell.isEnd) {
      movingRef.current = 'end';
      isMouseDownRef.current = true;
      return;
    }
    isMouseDownRef.current = true;
    wallModeRef.current = cell.isWall ? 'erase' : 'wall';
    const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
    newGrid[row][col].isWall = !newGrid[row][col].isWall;
    setGrid(newGrid);
  };

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isMouseDownRef.current) return;
    if (movingRef.current === 'start' || movingRef.current === 'end') {
      const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
      for (const r of newGrid) {
        for (const c of r) {
          if (movingRef.current === 'start' && c.isStart) c.isStart = false;
          if (movingRef.current === 'end' && c.isEnd) c.isEnd = false;
        }
      }
      if (movingRef.current === 'start' && !newGrid[row][col].isEnd) {
        newGrid[row][col].isStart = true;
      } else if (movingRef.current === 'end' && !newGrid[row][col].isStart) {
        newGrid[row][col].isEnd = true;
      }
      setGrid(newGrid);
      return;
    }
    const cell = grid[row][col];
    if (cell.isStart || cell.isEnd) return;
    const newGrid = grid.map((r) => r.map((c) => ({ ...c })));
    newGrid[row][col].isWall = wallModeRef.current === 'wall';
    setGrid(newGrid);
  };

  const handleCellMouseUp = () => {
    isMouseDownRef.current = false;
    movingRef.current = null;
  };

  return (
    <div className="space-y-4">
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs text-slate-400 mb-1">Algorithm</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as PathfindingAlgorithm)}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-md px-3 py-1.5 text-sm focus:outline-none focus:border-primary-500"
            >
              {ALGORITHM_KEYS.map((key) => (
                <option key={key} value={key}>{pathfindingAlgorithms[key].name}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={runAlgorithm} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm rounded-md transition-colors font-semibold">? Run</button>
            <button onClick={clearPath} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors">Clear Path</button>
            <button onClick={clearWalls} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors">Clear Walls</button>
            <button onClick={generateGrid} className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-md transition-colors">?? Random Grid</button>
          </div>
        </div>
        <div className="mt-3 text-xs text-slate-400 flex flex-wrap gap-4">
          <span>?? Start (drag to move)</span>
          <span>?? End (drag to move)</span>
          <span>? Wall (click/drag to toggle)</span>
          <span>?? Visited</span>
          <span>?? Path</span>
        </div>
      </div>

      <ControlBar
        isPlaying={animation.isPlaying}
        onPlay={animation.play}
        onPause={animation.pause}
        onReset={animation.reset}
        onStepForward={animation.stepForward}
        onStepBackward={animation.stepBackward}
        onSkipToEnd={animation.skipToEnd}
        onGenerateNew={generateGrid}
        speed={animation.speed}
        setSpeed={animation.setSpeed}
        progress={animation.progress}
        currentStep={animation.currentStep}
        totalSteps={animation.steps.length}
        algorithmName={algoInfo.name}
        complexity={algoInfo.complexity}
        stats={{
          comparisons: 0,
          swaps: 0,
          visited: stats.visited,
          pathLength: stats.pathLength,
        }}
        category="pathfinding"
      />

      <div className="bg-slate-800 rounded-lg border border-slate-700 shadow-lg h-[500px]">
        <GridVisualizer
          grid={displayGrid}
          step={animation.currentData ?? null}
          onCellMouseDown={handleCellMouseDown}
          onCellMouseEnter={handleCellMouseEnter}
          onCellMouseUp={handleCellMouseUp}
        />
      </div>
    </div>
  );
}
