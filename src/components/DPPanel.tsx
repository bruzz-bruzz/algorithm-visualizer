import StepPanel from './StepPanel';
import GenericVisualizer from './GenericVisualizer';
import { dpAlgorithms } from '../algorithms/dynamicprog';
import type { DPStep } from '../types';
export default function DPPanel() {
  const algoEntries = Object.entries(dpAlgorithms).reduce((acc, [key, algo]) => {
    acc[key] = {
      name: algo.name,
      description: algo.description,
      complexity: algo.complexity,
      fn: () => algo.fn(),
    };
    return acc;
  }, {} as Record<string, { name: string; description: string; complexity: string; fn: () => DPStep[] }>);
  return (
    <StepPanel<DPStep>
      title="DP"
      algorithms={algoEntries}
      renderVisualizer={(steps, currentStep) => <GenericVisualizer steps={steps} currentStep={currentStep} />}
    />
  );
}
