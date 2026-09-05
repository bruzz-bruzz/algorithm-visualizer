import StepPanel from './StepPanel';
import GenericVisualizer from './GenericVisualizer';
import { recursionAlgorithms } from '../algorithms/recursion';
import type { RecursionStep } from '../types';
export default function RecursionPanel() {
  const algoEntries = Object.entries(recursionAlgorithms).reduce((acc, [key, algo]) => {
    acc[key] = {
      name: algo.name,
      description: algo.description,
      complexity: algo.complexity,
      fn: () => algo.fn(5),
    };
    return acc;
  }, {} as Record<string, { name: string; description: string; complexity: string; fn: () => RecursionStep[] }>);
  return (
    <StepPanel<RecursionStep>
      title="Recursion"
      algorithms={algoEntries}
      renderVisualizer={(steps, currentStep) => <GenericVisualizer steps={steps} currentStep={currentStep} />}
    />
  );
}
