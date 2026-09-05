import StepPanel from './StepPanel';
import GraphVisualizer from './GraphVisualizer';
import { graphAlgorithms } from '../algorithms/graphs';
import { sampleGraphs } from '../utils/graphHelpers';
import type { GraphAlgorithm, GraphStep } from '../types';

export default function GraphPanel() {
  const algoEntries = Object.entries(graphAlgorithms).reduce((acc, [key, algo]) => {
    acc[key] = {
      name: algo.name,
      description: algo.description,
      complexity: algo.complexity,
      fn: () => {
        const graphKey = algo.weighted ? 'weighted' : algo.directed ? 'directed' : 'small';
        const sample = sampleGraphs[graphKey] ?? sampleGraphs.small;
        return algo.fn(sample, 0);
      },
    };
    return acc;
  }, {} as Record<string, { name: string; description: string; complexity: string; fn: () => GraphStep[] }>);

  return (
    <StepPanel<GraphStep>
      title="Graph algorithm"
      algorithms={algoEntries}
      renderVisualizer={(steps, currentStep) => <GraphVisualizer step={steps[currentStep] ?? null} />}
    />
  );
}
