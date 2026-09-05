import StepPanel from './StepPanel';
import GenericVisualizer from './GenericVisualizer';
import { dsAlgorithms } from '../algorithms/datastructures';
import type { DSStep } from '../types';
export default function DSPanel() {
  const algoEntries = Object.entries(dsAlgorithms).reduce((acc, [key, algo]) => {
    acc[key] = {
      name: algo.name,
      description: algo.description,
      complexity: algo.complexity,
      fn: () => algo.fn([5, 12, 8, 3, 15, 7]),
    };
    return acc;
  }, {} as Record<string, { name: string; description: string; complexity: string; fn: () => DSStep[] }>);

  return (
    <StepPanel<DSStep>
      title="Data structure"
      algorithms={algoEntries}
      renderVisualizer={(steps, currentStep) => <GenericVisualizer steps={steps} currentStep={currentStep} />}
    />
  );
}
