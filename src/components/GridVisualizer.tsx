import type { GridCell, PathStep } from '../types';

interface GridVisualizerProps {
  grid: GridCell[][];
  step: PathStep | null;
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onCellMouseUp: () => void;
}

export default function GridVisualizer({
  grid,
  step,
  onCellMouseDown,
  onCellMouseEnter,
  onCellMouseUp,
}: GridVisualizerProps) {
  const visitedSet = new Set(
    step?.visited.map((c) => `${c.row},${c.col}`) ?? []
  );
  const pathSet = new Set(step?.path.map((c) => `${c.row},${c.col}`) ?? []);

  return (
    <div className="w-full h-full overflow-auto flex items-center justify-center p-4">
      <div
        className="grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${grid[0]?.length ?? 1}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isVisited = visitedSet.has(`${r},${c}`);
            const isPath = pathSet.has(`${r},${c}`);
            const showStart = cell.isStart;
            const showEnd = cell.isEnd;
            const isWall = cell.isWall;

            let bg = 'bg-slate-700';
            if (isWall) bg = 'bg-slate-900';
            if (isVisited) bg = 'bg-cyan-500 animate-fade-in';
            if (isPath) bg = 'bg-amber-400 animate-fade-in';
            if (showStart) bg = 'bg-emerald-500';
            if (showEnd) bg = 'bg-rose-500';

            return (
              <div
                key={`${r}-${c}`}
                onMouseDown={() => onCellMouseDown(r, c)}
                onMouseEnter={() => onCellMouseEnter(r, c)}
                onMouseUp={onCellMouseUp}
                className={`${bg} aspect-square rounded-sm cursor-pointer hover:opacity-80 transition-colors`}
                style={{ minWidth: '14px', minHeight: '14px' }}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
