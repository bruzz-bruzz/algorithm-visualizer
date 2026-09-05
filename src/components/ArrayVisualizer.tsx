import type { SortStep, SearchStep } from '../types';

interface ArrayVisualizerProps {
  step: SortStep | SearchStep | null;
  algorithmName: string;
}

function isSortStep(step: SortStep | SearchStep | null): step is SortStep {
  return step !== null && 'swapping' in step;
}

function isSearchStep(step: SortStep | SearchStep | null): step is SearchStep {
  return step !== null && 'current' in step;
}

export default function ArrayVisualizer({
  step,
  algorithmName,
}: ArrayVisualizerProps) {
  if (!step) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500 text-lg">
        Click "Play" or "Generate New Array" to start
      </div>
    );
  }

  const array = step.array;
  const maxValue = Math.max(...array);
  const isSorted = isSortStep(step)
    ? step.comparing.length === 0 &&
      step.swapping.length === 0 &&
      step.sorted.length === array.length
    : false;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-2 text-sm text-slate-400">{algorithmName}</div>
      <div className="flex-1 flex items-end justify-center gap-0.5 px-2 pb-2 min-h-0">
        {array.map((value, idx) => {
          const heightPercent = (value / maxValue) * 100;
          let bgColor = 'bg-primary-500';

          if (isSortStep(step)) {
            if (step.sorted.includes(idx)) {
              bgColor = 'bg-emerald-500';
            }
            if (step.swapping.includes(idx)) {
              bgColor = 'bg-rose-500';
            } else if (step.comparing.includes(idx)) {
              bgColor = 'bg-amber-400';
            }
            if (step.pivot === idx) {
              bgColor = 'bg-fuchsia-500';
            }
          } else if (isSearchStep(step)) {
            if (step.found === idx) {
              bgColor = 'bg-emerald-500';
            } else if (step.current === idx) {
              bgColor = 'bg-amber-400';
            } else if (step.checked.includes(idx)) {
              bgColor = 'bg-slate-500';
            }
          }

          if (isSorted) bgColor = 'bg-emerald-500';

          return (
            <div
              key={idx}
              className={`${bgColor} flex-1 min-w-0 rounded-t transition-all duration-150 ease-out flex items-end justify-center text-white text-xs font-bold pb-1`}
              style={{ height: `${heightPercent}%` }}
              title={`Value: ${value}`}
            >
              {array.length <= 25 && (
                <span className="hidden sm:inline">{value}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Search range indicator */}
      {isSearchStep(step) && step.range && (
        <div className="text-center text-xs text-slate-400 py-1">
          Range: [{step.range[0]} - {step.range[1]}]
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-300 pt-2 border-t border-slate-700 mt-2">
        {isSortStep(step) ? (
          <>
            <Legend color="bg-primary-500" label="Unsorted" />
            <Legend color="bg-amber-400" label="Comparing" />
            <Legend color="bg-rose-500" label="Swapping" />
            <Legend color="bg-fuchsia-500" label="Pivot" />
            <Legend color="bg-emerald-500" label="Sorted" />
          </>
        ) : (
          <>
            <Legend color="bg-primary-500" label="Unchecked" />
            <Legend color="bg-slate-500" label="Checked" />
            <Legend color="bg-amber-400" label="Current" />
            <Legend color="bg-emerald-500" label="Found" />
          </>
        )}
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-3 h-3 rounded ${color}`} />
      <span>{label}</span>
    </div>
  );
}
