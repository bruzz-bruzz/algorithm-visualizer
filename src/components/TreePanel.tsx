import StepPanel from './StepPanel';
import TreeVisualizer from './TreeVisualizer';
import { treeAlgorithms } from '../algorithms/trees';
import type { TreeAlgorithm, TreeStep } from '../types';

export default function TreePanel() {
  const algoEntries = Object.entries(treeAlgorithms).reduce((acc, [key, algo]) => {
    acc[key] = {
      name: algo.name,
      description: algo.description,
      complexity: algo.complexity,
      fn: () => algo.fn([50, 30, 70, 20, 40, 60, 80, 35], key === 'bstInsert' || key === 'avl' ? [25, 55, 75, 65] : undefined),
    };
    return acc;
  }, {} as Record<string, { name: string; description: string; complexity: string; fn: () => TreeStep[] }>);

  return (
    <StepPanel<TreeStep>
      title="Tree algorithm"
      algorithms={algoEntries}
      renderVisualizer={(steps, currentStep) => <TreeVisualizer step={steps[currentStep] ?? null} />}
    />
  );
}
