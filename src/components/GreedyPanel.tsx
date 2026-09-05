import StepPanel from './StepPanel';
import GenericVisualizer from './GenericVisualizer';
import { greedyAlgorithms } from '../algorithms/greedy';
import type { GreedyStep } from '../types';
export default function GreedyPanel() {
  const algoEntries = Object.entries(greedyAlgorithms).reduce((acc, [key, algo]) => {
    acc[key] = {
      name: algo.name,
      description: algo.description,
      complexity: algo.complexity,
      fn: () => algo.fn(),
    };
    return acc;
  }, {} as Record<string, { name: string; description: string; complexity: string; fn: () => GreedyStep[] }>);
  return (
    <StepPanel<GreedyStep>
      title="Greedy algorithm"
      algorithms={algoEntries}
      renderVisualizer={(steps, currentStep) => <GenericVisualizer steps={steps} currentStep={currentStep} />}
    />
  );
}
