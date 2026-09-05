import type { GreedyStep } from '../../types';

export function activitySelection(starts: number[], ends: number[]): GreedyStep[] {
  const steps: GreedyStep[] = [];
  const n = starts.length;
  const indices = Array.from({ length: n }, (_, i) => i);
  indices.sort((a, b) => ends[a] - ends[b]);
  const sortedItems = indices.map(i => ({ id: i, value: ends[i] - starts[i], weight: starts[i], state: 'idle' as string }));
  const result: string[] = [];

  steps.push({
    items: sortedItems,
    description: `Sort activities by end time. Activities: ${indices.map(i => `(${starts[i]},${ends[i]})`).join(', ')}`,
    result: [],
  });

  let lastEnd = -1;
  for (const idx of indices) {
    sortedItems[idx].state = 'considering';
    steps.push({
      items: sortedItems.map(s => ({ ...s })),
      description: `Consider activity ${idx} (${starts[idx]}, ${ends[idx]})`,
      result: [...result],
    });
    if (starts[idx] >= lastEnd) {
      result.push(`(${starts[idx]},${ends[idx]})`);
      lastEnd = ends[idx];
      sortedItems[idx].state = 'taken';
      steps.push({ items: sortedItems.map(s => ({ ...s })), description: `Select activity ${idx} (${starts[idx]}, ${ends[idx]})`, result: [...result] });
    } else {
      sortedItems[idx].state = 'rejected';
      steps.push({ items: sortedItems.map(s => ({ ...s })), description: `Skip activity ${idx} (overlaps)`, result: [...result] });
    }
  }
  steps.push({ items: sortedItems.map(s => ({ ...s, state: s.state === 'taken' ? 'taken' : 'idle' })), description: `Selected ${result.length} activities: ${result.join(', ')}`, result });
  return steps;
}

export function fractionalKnapsack(values: number[], weights: number[], capacity: number): GreedyStep[] {
  const steps: GreedyStep[] = [];
  const n = values.length;
  const items = values.map((v, i) => ({ id: i, value: v, weight: weights[i], ratio: v / weights[i], state: 'idle' as string }));
  items.sort((a, b) => (b.ratio ?? 0) - (a.ratio ?? 0));
  steps.push({ items: items.map(i => ({ ...i })), description: `Sort by value/weight ratio: ${items.map(i => i.ratio?.toFixed(2)).join(', ')}`, result: [] });

  const result: string[] = [];
  let remaining = capacity;
  let total = 0;
  for (const item of items) {
    item.state = 'considering';
    steps.push({ items: items.map(i => ({ ...i })), description: `Consider item ${item.id} (ratio=${item.ratio?.toFixed(2)})`, result: [`Value so far: ${total}`] });
    if (item.weight <= remaining) {
      remaining -= item.weight;
      total += item.value;
      item.state = 'taken';
      result.push(`Take full item ${item.id}`);
      steps.push({ items: items.map(i => ({ ...i })), description: `Take full item ${item.id}. Total value: ${total}`, result: [`Value: ${total}`] });
    } else if (remaining > 0) {
      const fraction = remaining / item.weight;
      total += item.value * fraction;
      item.state = 'taken';
      steps.push({ items: items.map(i => ({ ...i })), description: `Take ${(fraction * 100).toFixed(0)}% of item ${item.id}. Total: ${total.toFixed(2)}`, result: [`Value: ${total.toFixed(2)}`] });
      remaining = 0;
    } else {
      item.state = 'rejected';
      steps.push({ items: items.map(i => ({ ...i })), description: `Skip item ${item.id} (no capacity)`, result: [`Value: ${total}`] });
    }
  }
  return steps;
}





