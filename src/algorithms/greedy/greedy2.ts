import type { GreedyStep } from '../../types';

interface HNode { id: number; freq: number; left: HNode | null; right: HNode | null; }

export function huffman(freqs: number[]): GreedyStep[] {
  const steps: GreedyStep[] = [];
  let nodes: HNode[] = freqs.map((f, i) => ({ id: i, freq: f, left: null, right: null }));
  const result: string[] = [];

  steps.push({
    items: nodes.map(n => ({ id: n.id, value: n.freq, weight: 0, state: 'idle' as string })),
    description: `Huffman coding for frequencies: [${freqs.join(', ')}]`,
    result: [],
  });

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);
    const left = nodes[0];
    const right = nodes[1];
    const merged: HNode = { id: nodes.length, freq: left.freq + right.freq, left, right };
    nodes = [merged, ...nodes.slice(2)];

    steps.push({
      items: nodes.map(n => ({ id: n.id, value: n.freq, weight: 0, state: 'merged' as string })),
      description: `Merge ${left.freq} and ${right.freq} -> ${merged.freq}`,
      result: [...result],
    });
    result.push(`${left.freq}+${right.freq}=${merged.freq}`);
  }

  return steps;
}

export function jobSequencing(jobs: Array<{ id: number; deadline: number; profit: number }>, maxSlots: number): GreedyStep[] {
  const steps: GreedyStep[] = [];
  const sorted = [...jobs].sort((a, b) => b.profit - a.profit);
  const items = sorted.map(j => ({ id: j.id, value: j.profit, weight: j.deadline, state: 'idle' as string }));
  const slots: Array<typeof sorted[0] | null> = Array(maxSlots).fill(null);
  const result: string[] = [];

  steps.push({ items: items.map(i => ({ ...i })), description: `Sort jobs by profit (desc): [${sorted.map(j => j.profit).join(', ')}]`, result });

  let totalProfit = 0;
  for (const job of sorted) {
    items[job.id].state = 'considering';
    steps.push({ items: items.map(i => ({ ...i })), description: `Consider job ${job.id} (deadline=${job.deadline}, profit=${job.profit})`, result });
    for (let s = Math.min(maxSlots, job.deadline) - 1; s >= 0; s--) {
      if (slots[s] === null) {
        slots[s] = job;
        items[job.id].state = 'taken';
        totalProfit += job.profit;
        result.push(`Slot ${s + 1}: job ${job.id} (profit ${job.profit})`);
        steps.push({ items: items.map(i => ({ ...i })), description: `Schedule job ${job.id} in slot ${s + 1}. Total profit: ${totalProfit}`, result });
        break;
      }
    }
    if (items[job.id].state === 'considering') {
      items[job.id].state = 'rejected';
      steps.push({ items: items.map(i => ({ ...i })), description: `Cannot schedule job ${job.id}`, result });
    }
  }
  return steps;
}

