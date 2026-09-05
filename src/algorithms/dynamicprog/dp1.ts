import type { DPStep } from '../../types';

function makeBlank(rows: number, cols: number, init: number = 0): DPStep['dpTable'] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({ value: init as number | string, state: 'idle' as string }))
  );
}

export function knapsack01(weights: number[], values: number[], capacity: number): DPStep[] {
  const steps: DPStep[] = [];
  const n = weights.length;
  const dp = makeBlank(n + 1, capacity + 1, 0);
  steps.push({
    dpTable: dp.map(row => row.map(c => ({ ...c }))),
    rowLabels: ['', ...weights.map((w, i) => `i${i}(w=${w},v=${values[i]})`)],
    colLabels: Array.from({ length: capacity + 1 }, (_, j) => `c=${j}`),
    description: '0/1 Knapsack DP table initialized',
    items: weights.map((w, i) => ({ id: i, weight: w, value: values[i], state: 'idle' })),
  });

  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      const cell = dp[i][w];
      cell.state = 'considering';
      steps.push({
        dpTable: dp.map(r => r.map(c => ({ ...c }))),
        rowLabels: ['', ...weights.map((w, i) => `i${i}`)],
        colLabels: Array.from({ length: capacity + 1 }, (_, j) => `${j}`),
        description: `dp[${i}][${w}]: consider item ${i - 1} (w=${weights[i - 1]}, v=${values[i - 1]})`,
      });
      if (weights[i - 1] <= w) {
        const take = values[i - 1] + (dp[i - 1][w - weights[i - 1]].value as number);
        const skip = dp[i - 1][w].value as number;
        cell.value = Math.max(take, skip);
        cell.state = take > skip ? 'accepted' : 'rejected';
        steps.push({
          dpTable: dp.map(r => r.map(c => ({ ...c }))),
          rowLabels: ['', ...weights.map((w, i) => `i${i}`)],
          colLabels: Array.from({ length: capacity + 1 }, (_, j) => `${j}`),
          description: `take=${take}, skip=${skip}, choose ${cell.state === 'accepted' ? 'take' : 'skip'}`,
        });
      } else {
        cell.value = dp[i - 1][w].value;
        cell.state = 'rejected';
        steps.push({
          dpTable: dp.map(r => r.map(c => ({ ...c }))),
          rowLabels: ['', ...weights.map((w, i) => `i${i}`)],
          colLabels: Array.from({ length: capacity + 1 }, (_, j) => `${j}`),
          description: `weight ${weights[i - 1]} > capacity ${w}, cannot take`,
        });
      }
    }
  }
  steps.push({
    dpTable: dp.map(r => r.map(c => ({ ...c, state: (c.value as number) > 0 ? 'optimal' : 'idle' }))),
    rowLabels: ['', ...weights.map((w, i) => `i${i}`)],
    colLabels: Array.from({ length: capacity + 1 }, (_, j) => `${j}`),
    description: `Max value = ${dp[n][capacity].value}`,
  });
  return steps;
}

export function lcs(s1: string, s2: string): DPStep[] {
  const steps: DPStep[] = [];
  const m = s1.length, n = s2.length;
  const dp = makeBlank(m + 1, n + 1, 0);
  steps.push({
    dpTable: dp.map(r => r.map(c => ({ ...c }))),
    rowLabels: ['', ...s1.split('')],
    colLabels: ['', ...s2.split('')],
    description: `LCS of "${s1}" and "${s2}"`,
  });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j].state = 'considering';
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j].value = (dp[i - 1][j - 1].value as number) + 1;
        dp[i][j].state = 'accepted';
      } else {
        dp[i][j].value = Math.max(dp[i - 1][j].value as number, dp[i][j - 1].value as number);
      }
    }
    steps.push({
      dpTable: dp.map(r => r.map(c => ({ ...c }))),
      rowLabels: ['', ...s1.split('')],
      colLabels: ['', ...s2.split('')],
      description: `Row ${i} done. LCS length so far: ${dp[i][n].value}`,
    });
  }
  steps.push({
    dpTable: dp.map(r => r.map(c => ({ ...c, state: (c.value as number) > 0 ? 'optimal' : 'idle' }))),
    rowLabels: ['', ...s1.split('')],
    colLabels: ['', ...s2.split('')],
    description: `LCS length = ${dp[m][n].value}`,
  });
  return steps;
}

export function editDistance(s1: string, s2: string): DPStep[] {
  const steps: DPStep[] = [];
  const m = s1.length, n = s2.length;
  const dp = makeBlank(m + 1, n + 1, 0);
  for (let i = 0; i <= m; i++) dp[i][0].value = i;
  for (let j = 0; j <= n; j++) dp[0][j].value = j;
  steps.push({
    dpTable: dp.map(r => r.map(c => ({ ...c }))),
    rowLabels: ['', ...s1.split('')],
    colLabels: ['', ...s2.split('')],
    description: 'Edit distance initialized',
  });
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j].value = dp[i - 1][j - 1].value as number;
      } else {
        dp[i][j].value = 1 + Math.min(dp[i - 1][j].value as number, dp[i][j - 1].value as number, dp[i - 1][j - 1].value as number);
      }
    }
    steps.push({
      dpTable: dp.map(r => r.map(c => ({ ...c }))),
      rowLabels: ['', ...s1.split('')],
      colLabels: ['', ...s2.split('')],
      description: `Row ${i}: ${s1[i - 1]}`,
    });
  }
  steps.push({
    dpTable: dp.map(r => r.map(c => ({ ...c }))),
    rowLabels: ['', ...s1.split('')],
    colLabels: ['', ...s2.split('')],
    description: `Edit distance = ${dp[m][n].value}`,
  });
  return steps;
}
