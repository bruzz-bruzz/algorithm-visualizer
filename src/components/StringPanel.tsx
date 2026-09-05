import StepPanel from './StepPanel';
import GenericVisualizer from './GenericVisualizer';
import { stringAlgorithms } from '../algorithms/strings';
import type { StringStep } from '../types';
export default function StringPanel() {
  const algoEntries = Object.entries(stringAlgorithms).reduce((acc, [key, algo]) => {
    acc[key] = {
      name: algo.name,
      description: algo.description,
      complexity: algo.complexity,
      fn: () => algo.fn(),
    };
    return acc;
  }, {} as Record<string, { name: string; description: string; complexity: string; fn: () => StringStep[] }>);
  return (
    <StepPanel<StringStep>
      title="String algorithm"
      algorithms={algoEntries}
      renderVisualizer={(steps, currentStep) => <GenericVisualizer steps={steps} currentStep={currentStep} />}
    />
  );
}
