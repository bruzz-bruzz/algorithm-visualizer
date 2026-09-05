import type { DPStep } from '../../types';

export function matrixChain(dims: number[]): DPStep[] {
  const steps: DPStep[] = [];
  const n = dims.length - 1;
  const dp = Array.from({ length: n }, () =>
    Array.from({ length: n }, () => ({ value: 0, state: 'idle' as string }))
  );
  steps.push({
    dpTable: dp.map(r => r.map(c => ({ ...c }))),
    rowLabels: dims.slice(0, -1).map((d, i) => `M${i}(${d}x${dims[i + 1]})`),
    colLabels: dims.slice(1).map((d, i) => `M${i}(${dims[i]}x${d})`),
    description: `Matrix chain multiplication: ${dims.length - 1} matrices`,
  });
  for (let len = 2; len <= n; len++) {
    for (let i = 0; i < n - len + 1; i++) {
      const j = i + len - 1;
      let minCost = Infinity;
      for (let k = i; k < j; k++) {
        const cost = (dp[i][k].value as number) + (dp[k + 1][j].value as number) + dims[i] * dims[k + 1] * dims[j + 1];
        if (cost < minCost) minCost = cost;
      }
      dp[i][j].value = minCost === Infinity ? 0 : minCost;
      dp[i][j].state = 'accepted';
    }
    steps.push({
      dpTable: dp.map(r => r.map(c => ({ ...c }))),
      rowLabels: dims.slice(0, -1).map((d, i) => `M${i}`),
      colLabels: dims.slice(1).map((d, i) => `M${i}`),
      description: `After chain length ${len}`,
    });
  }
  return steps;
}

