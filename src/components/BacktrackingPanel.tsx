import StepPanel from './StepPanel';
import GenericVisualizer from './GenericVisualizer';
import { backtrackingAlgorithms } from '../algorithms/backtracking';
import type { BacktrackingStep } from '../types';
export default function BacktrackingPanel() {
  const algoEntries = Object.entries(backtrackingAlgorithms).reduce((acc, [key, algo]) => {
    acc[key] = {
      name: algo.name,
      description: algo.description,
      complexity: algo.complexity,
      fn: () => algo.fn(),
    };
    return acc;
  }, {} as Record<string, { name: string; description: string; complexity: string; fn: () => BacktrackingStep[] }>);
  return (
    <StepPanel<BacktrackingStep>
      title="Backtracking"
      algorithms={algoEntries}
      renderVisualizer={(steps, currentStep) => <GenericVisualizer steps={steps} currentStep={currentStep} />}
    />
  );
}
