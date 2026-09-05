import type { SortStep, SearchStep, GraphStep, TreeStep, DSStep, RecursionStep, DPStep, GreedyStep, BacktrackingStep, StringStep } from '../types';

type AnyStep = SortStep | SearchStep | GraphStep | TreeStep | DSStep | RecursionStep | DPStep | GreedyStep | BacktrackingStep | StringStep;

interface GenericVisualizerProps {
  steps: AnyStep[];
  currentStep: number;
  description?: string;
}

// DSStep: Stack/Queue/Linked List
function DSVisualizer({ steps, currentStep }: { steps: DSStep[]; currentStep: number }) {
  const step = steps[currentStep];
  const stateColors: Record<string, string> = {
    idle: '#475569', active: '#fbbf24', pushed: '#22c55e', popped: '#ef4444',
    head: '#3b82f6', tail: '#8b5cf6', removed: '#ef4444',
  };
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        {step?.structure.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className="w-14 h-14 rounded-lg flex items-center justify-center text-white font-bold text-lg border-2"
              style={{ backgroundColor: stateColors[item.state] ?? '#475569', borderColor: '#fff' }}
            >
              {item.value}
            </div>
            <div className="text-xs text-slate-400 mt-1">{idx === 0 ? 'HEAD' : idx === step.structure.length - 1 ? 'TAIL' : ''}</div>
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-slate-300">{step?.description}</div>
    </div>
  );
}

// RecursionStep
function RecursionVisualizer({ steps, currentStep }: { steps: RecursionStep[]; currentStep: number }) {
  const step = steps[currentStep];
  const frameColors: Record<string, string> = {
    active: '#fbbf24', returning: '#8b5cf6', done: '#22c55e',
  };
  const stackColors: Record<string, string> = {
    idle: '#475569', active: '#fbbf24', pushed: '#22c55e', popped: '#ef4444',
    head: '#3b82f6', tail: '#8b5cf6', removed: '#ef4444',
  };
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-slate-400 mb-2">Call Stack:</div>
          <div className="space-y-1">
            {step?.callStack.map((frame, idx) => (
              <div
                key={idx}
                className="px-3 py-2 rounded-md text-sm font-mono flex justify-between"
                style={{ backgroundColor: frameColors[frame.state] ?? '#475569' }}
              >
                <span className="text-white">{frame.args}</span>
                {frame.returnValue && <span className="text-white/80 ml-2">= {frame.returnValue}</span>}
              </div>
            ))}
          </div>
        </div>
        {step?.rods && (
          <div>
            <div className="text-xs text-slate-400 mb-2">Rods:</div>
            <div className="flex gap-3 justify-center">
              {(['A', 'B', 'C'] as const).map(rod => (
                <div key={rod} className="flex flex-col items-center">
                  <div className="text-xs text-slate-400 mb-1">Rod {rod}</div>
                  <div className="flex flex-col-reverse gap-1">
                    {(step.rods as any)[rod].map((disk: number, idx: number) => (
                      <div
                        key={idx}
                        className="h-6 rounded flex items-center justify-center text-xs font-bold text-white px-2"
                        style={{ width: `${disk * 12 + 20}px`, backgroundColor: `hsl(${disk * 30}, 70%, 50%)` }}
                      >
                        {disk}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="md:col-span-2">
          <div className="text-xs text-slate-400 mb-1">Output:</div>
          <div className="space-y-0.5">
            {step?.output.map((line, idx) => (
              <div key={idx} className="text-xs text-emerald-400 font-mono pl-2 border-l-2 border-emerald-500">{line}</div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 text-sm text-slate-300 text-center">{step?.description}</div>
    </div>
  );
}

// DPStep (DP tables)
function DPVisualizer({ steps, currentStep }: { steps: DPStep[]; currentStep: number }) {
  const step = steps[currentStep];
  const cellColors: Record<string, string> = {
    idle: '#1e293b', considering: '#fbbf24', accepted: '#22c55e',
    rejected: '#ef4444', current: '#3b82f6', optimal: '#06b6d4',
  };
  if (!step || !step.dpTable || step.dpTable.length === 0) {
    return <div className="text-slate-400 text-center py-8">Run algorithm</div>;
  }
  const rows = step.dpTable.length;
  const cols = step.dpTable[0]?.length ?? 0;
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 overflow-x-auto">
      <div className="text-center text-sm text-slate-300 mb-3 font-mono">{step.description}</div>
      <div className="flex flex-col items-center">
        <div style={{ display: 'grid', gridTemplateColumns: `40px repeat(${cols}, 50px)` }}>
          <div></div>
          {step.colLabels.map((label, idx) => (
            <div key={idx} className="text-xs text-slate-400 text-center py-1 border-b border-slate-700 font-mono">{label}</div>
          ))}
          {step.rowLabels.map((label, rIdx) => (
            <>
              <div key={`row-${rIdx}`} className="text-xs text-slate-400 text-right pr-2 py-1 font-mono">{label}</div>
              {step.dpTable[rIdx]?.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className="text-xs text-white text-center py-2 border border-slate-700/50 font-mono"
                  style={{ backgroundColor: cellColors[cell.state] ?? '#1e293b' }}
                >
                  {String(cell.value)}
                </div>
              ))}
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

// GreedyStep
function GreedyVisualizer({ steps, currentStep }: { steps: GreedyStep[]; currentStep: number }) {
  const step = steps[currentStep];
  const itemColors: Record<string, string> = {
    idle: '#475569', considering: '#fbbf24', taken: '#22c55e',
    rejected: '#ef4444', merged: '#8b5cf6',
  };
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        {step?.items.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">
            <div
              className="w-16 h-16 rounded-lg flex flex-col items-center justify-center text-white font-bold border-2 border-white/20"
              style={{ backgroundColor: itemColors[item.state] ?? '#475569' }}
            >
              <span className="text-lg">{item.id}</span>
              {item.ratio !== undefined && <span className="text-xs opacity-75">{item.ratio.toFixed(1)}</span>}
              <span className="text-xs opacity-60">{item.value}/{item.weight}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center text-sm text-slate-300 mb-2">{step?.description}</div>
      {step?.result && step.result.length > 0 && (
        <div className="text-xs text-emerald-400 text-center">Result: {step.result.join(', ')}</div>
      )}
    </div>
  );
}

// BacktrackingStep
function BacktrackingVisualizer({ steps, currentStep }: { steps: BacktrackingStep[]; currentStep: number }) {
  const step = steps[currentStep];
  const cellColors: Record<string, string> = {
    idle: '#1e293b', trying: '#fbbf24', placed: '#22c55e',
    conflict: '#ef4444', backtrack: '#f97316', fixed: '#475569', empty: '#1e293b', considering: '#3b82f6',
  };
  if (!step) return <div />;
  const isNarrow = step.board.length <= 10;
  const cellSize = isNarrow ? 52 : 36;
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
      <div className="flex justify-center">
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${step.board[0]?.length ?? 0}, ${cellSize}px)` }}>
          {step.board.flat().map((cell, idx) => (
            <div
              key={idx}
              className="flex items-center justify-center text-white text-sm font-bold border border-slate-700/50"
              style={{ width: cellSize, height: cellSize, backgroundColor: cellColors[cell.state] ?? '#1e293b' }}
            >
              {cell.value}
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 text-sm text-slate-300 text-center">{step.description}</div>
      {step.solutionPath && <div className="mt-1 text-xs text-slate-400 text-center">Path: {step.solutionPath}</div>}
    </div>
  );
}

// StringStep
function StringVisualizer({ steps, currentStep }: { steps: StringStep[]; currentStep: number }) {
  const step = steps[currentStep];
  const textColors: Record<string, string> = {
    idle: '#1e293b', matching: '#fbbf24', matched: '#22c55e', mismatch: '#ef4444', lps: '#8b5cf6',
  };
  const patColors: Record<string, string> = {
    idle: '#334155', matching: '#fbbf24', matched: '#22c55e', mismatch: '#ef4444', lps: '#8b5cf6',
  };
  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
      <div className="flex justify-center gap-1 mb-2">
        {step?.textIndices.map((ti, idx) => (
          <div key={idx} className="w-8 h-8 flex items-center justify-center text-white text-sm font-mono border border-slate-700/50" style={{ backgroundColor: textColors[ti.state] ?? '#1e293b' }}>
            {step.text[idx]}
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1 mb-2">
        {step?.patternIndices.map((pi, idx) => (
          <div key={idx} className="w-8 h-8 flex items-center justify-center text-white text-sm font-mono border border-slate-700/50" style={{ backgroundColor: patColors[pi.state] ?? '#334155' }}>
            {step.pattern[idx]}
          </div>
        ))}
      </div>
      {step?.lpsTable && (
        <div className="flex justify-center gap-1 mb-2">
          <span className="text-xs text-slate-400 mr-1">LPS:</span>
          {step.lpsTable.map((v, idx) => (
            <div key={idx} className="w-8 h-6 flex items-center justify-center text-slate-300 text-xs font-mono">
              {v}
            </div>
          ))}
        </div>
      )}
      <div className="text-center text-sm text-slate-300">{step?.description}</div>
      {step?.matches && step.matches.length > 0 && (
        <div className="mt-1 text-center text-xs text-emerald-400">Match at positions: {step.matches.map(m => `${m.start}-${m.end}`).join(', ')}</div>
      )}
    </div>
  );
}

export default function GenericVisualizer({ steps, currentStep }: GenericVisualizerProps) {
  if (!steps || steps.length === 0) {
    return <div className="text-slate-400 text-center py-8">Run algorithm to see visualization</div>;
  }
  const step = steps[currentStep];
  if (!step) return <div className="text-slate-400 text-center py-8">Run algorithm to see visualization</div>;
  if ('structure' in step) return <DSVisualizer steps={steps as DSStep[]} currentStep={currentStep} />;
  if ('callStack' in step) return <RecursionVisualizer steps={steps as RecursionStep[]} currentStep={currentStep} />;
  if ('dpTable' in step) return <DPVisualizer steps={steps as DPStep[]} currentStep={currentStep} />;
  if ('items' in step && 'result' in step) return <GreedyVisualizer steps={steps as GreedyStep[]} currentStep={currentStep} />;
  if ('board' in step) return <BacktrackingVisualizer steps={steps as BacktrackingStep[]} currentStep={currentStep} />;
  if ('text' in step && 'pattern' in step) return <StringVisualizer steps={steps as StringStep[]} currentStep={currentStep} />;
  return <div className="text-slate-400 text-center py-8">Select a step to see visualization</div>;
}
