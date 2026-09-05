import type { AlgorithmCategory } from '../types';

interface ControlBarProps {
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onSkipToEnd: () => void;
  onGenerateNew: () => void;
  speed: number; // delay in seconds between each step
  setSpeed: (s: number) => void;
  progress: number;
  currentStep: number;
  totalSteps: number;
  algorithmName: string;
  complexity: string;
  stats: {
    comparisons: number;
    swaps: number;
    visited?: number;
    pathLength?: number;
  };
  category: AlgorithmCategory;
}

export default function ControlBar({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onStepBackward,
  onSkipToEnd,
  onGenerateNew,
  speed,
  setSpeed,
  progress,
  currentStep,
  totalSteps,
  algorithmName,
  complexity,
  stats,
  category,
}: ControlBarProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-lg space-y-3">
      {/* Algorithm info */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <div className="text-lg font-bold text-white">{algorithmName}</div>
          <div className="text-xs text-slate-400">Complexity: {complexity}</div>
        </div>
        <button
          onClick={onGenerateNew}
          className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-md transition-colors"
        >
          {category === 'pathfinding' ? 'New Grid' : 'New Array'}
        </button>
      </div>

      {/* Playback controls */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={onReset}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition-colors"
          title="Reset"
        >
          ⏮
        </button>
        <button
          onClick={onStepBackward}
          disabled={currentStep === 0}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm rounded-md transition-colors"
          title="Previous Step"
        >
          ◀
        </button>
        {isPlaying ? (
          <button
            onClick={onPause}
            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm rounded-md transition-colors font-semibold"
          >
            ⏸ Pause
          </button>
        ) : (
          <button
            onClick={onPlay}
            className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm rounded-md transition-colors font-semibold"
          >
            ▶ Play
          </button>
        )}
        <button
          onClick={onStepForward}
          disabled={currentStep >= totalSteps - 1}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm rounded-md transition-colors"
          title="Next Step"
        >
          ▶
        </button>
        <button
          onClick={onSkipToEnd}
          disabled={currentStep >= totalSteps - 1}
          className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-600 text-white text-sm rounded-md transition-colors"
          title="Skip to End"
        >
          ⏭
        </button>
      </div>

      {/* Speed (delay in seconds per step) */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 w-16">Step delay:</span>
        <input
          type="range"
          min="0.01"
          max="2"
          step="0.01"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="flex-1 accent-primary-500"
        />
        <span className="text-xs text-slate-400 w-16 text-right">
          {speed.toFixed(2)}s
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
          <span>
            Step {currentStep + 1} / {totalSteps}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-700">
        {category === 'pathfinding' ? (
          <>
            <StatBox label="Visited" value={stats.visited ?? 0} />
            <StatBox label="Path Length" value={stats.pathLength ?? 0} />
            <StatBox
              label="Step"
              value={`${currentStep + 1}/${totalSteps}`}
            />
            <StatBox label="Step delay" value={`${speed.toFixed(2)}s`} />
          </>
        ) : category === 'searching' ? (
          <>
            <StatBox label="Comparisons" value={stats.comparisons} />
            <StatBox
              label="Step"
              value={`${currentStep + 1}/${totalSteps}`}
            />
            <StatBox label="Found" value={stats.pathLength ?? '—'} />
            <StatBox label="Step delay" value={`${speed.toFixed(2)}s`} />
          </>
        ) : (
          <>
            <StatBox label="Comparisons" value={stats.comparisons} />
            <StatBox label="Swaps" value={stats.swaps} />
            <StatBox
              label="Step"
              value={`${currentStep + 1}/${totalSteps}`}
            />
            <StatBox label="Step delay" value={`${speed.toFixed(2)}s`} />
          </>
        )}
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-slate-900 rounded-md px-3 py-2 text-center">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="text-sm font-semibold text-white">{value}</div>
    </div>
  );
}
