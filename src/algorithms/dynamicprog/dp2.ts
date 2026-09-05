import type { DPStep } from '../../types';

export function fibDP(n: number): DPStep[] {
  const steps: DPStep[] = [];
  const dp = Array.from({ length: n + 1 }, () => ({ value: 0, state: 'idle' as string }));
  dp[0].value = 0;
  dp[1].value = 1;
  steps.push({
    dpTable: [dp.map(c => ({ ...c }))],
    rowLabels: ['fib'],
    colLabels: Array.from({ length: n + 1 }, (_, i) => `${i}`),
    description: `Fibonacci DP up to fib(${n})`,
  });
  for (let i = 2; i <= n; i++) {
    dp[i].value = dp[i - 1].value + dp[i - 2].value;
    dp[i].state = 'accepted';
    steps.push({
      dpTable: [dp.map(c => ({ ...c }))],
      rowLabels: ['fib'],
      colLabels: Array.from({ length: n + 1 }, (_, i) => `${i}`),
      description: `fib(${i}) = fib(${i - 1}) + fib(${i - 2}) = ${dp[i].value}`,
    });
  }
  return steps;
}

export function coinChange(coins: number[], amount: number): DPStep[] {
  const steps: DPStep[] = [];
  const dp = Array.from({ length: amount + 1 }, () => ({ value: Infinity, state: 'idle' as string }));
  dp[0].value = 0;
  steps.push({
    dpTable: [dp.map(c => ({ ...c, value: c.value === Infinity ? 'INF' : c.value }))],
    rowLabels: ['min coins'],
    colLabels: Array.from({ length: amount + 1 }, (_, i) => `${i}`),
    description: `Coin change for amount ${amount} with coins [${coins.join(', ')}]`,
  });
  for (let i = 1; i <= amount; i++) {
    for (const c of coins) {
      if (c <= i && dp[i - c].value !== Infinity) {
        dp[i].value = Math.min(dp[i].value, dp[i - c].value + 1);
        dp[i].state = 'considering';
      }
    }
    dp[i].state = dp[i].value === Infinity ? 'rejected' : 'accepted';
    steps.push({
      dpTable: [dp.map(c => ({ ...c, value: c.value === Infinity ? 'INF' : c.value }))],
      rowLabels: ['min coins'],
      colLabels: Array.from({ length: amount + 1 }, (_, i) => `${i}`),
      description: `dp[${i}] = ${dp[i].value === Infinity ? 'INF' : dp[i].value}`,
    });
  }
  return steps;
}

export function subsetSum(nums: number[], target: number): DPStep[] {
  const steps: DPStep[] = [];
  const n = nums.length;
  const dp = Array.from({ length: n + 1 }, () =>
    Array.from({ length: target + 1 }, () => false)
  );
  for (let i = 0; i <= n; i++) dp[i][0] = true;
  steps.push({
    dpTable: dp.map(row => row.map(v => ({ value: v ? 'T' : 'F', state: 'idle' as string }))),
    rowLabels: ['', ...nums.map(n => `${n}`)],
    colLabels: Array.from({ length: target + 1 }, (_, j) => `${j}`),
    description: `Subset sum: target = ${target}`,
  });
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= target; j++) {
      if (nums[i - 1] <= j) {
        dp[i][j] = dp[i - 1][j] || dp[i - 1][j - nums[i - 1]];
      } else {
        dp[i][j] = dp[i - 1][j];
      }
    }
    steps.push({
      dpTable: dp.map(row => row.map(v => ({ value: v ? 'T' : 'F', state: v ? 'accepted' as string : 'idle' as string }))),
      rowLabels: ['', ...nums.map(n => `${n}`)],
      colLabels: Array.from({ length: target + 1 }, (_, j) => `${j}`),
      description: `After considering ${nums[i - 1]}: ${dp[n][target] ? 'achievable' : 'not achievable'}`,
    });
  }
  return steps;
}

