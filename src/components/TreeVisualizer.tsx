import type { TreeStep } from '../types';

interface TreeVisualizerProps {
  step: TreeStep | null;
  width?: number;
  height?: number;
}

const STATE_COLORS: Record<string, string> = {
  idle: '#475569',
  visiting: '#fbbf24',
  visited: '#22c55e',
  found: '#10b981',
  highlight: '#f59e0b',
  inserted: '#22c55e',
  deleted: '#ef4444',
};

export default function TreeVisualizer({ step, width = 700, height = 350 }: TreeVisualizerProps) {
  if (!step) {
    return <div className="text-slate-400 text-center py-8">Run algorithm to see visualization</div>;
  }

  const nodeMap = new Map(step.nodes.map(n => [n.id, n]));

  return (
    <div className="bg-slate-900 rounded-lg p-4 border border-slate-700 overflow-auto">
      <svg width={width} height={height} className="block mx-auto">
        {step.edges.map((edge, idx) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          return (
            <line
              key={idx}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="#334155"
              strokeWidth={2}
            />
          );
        })}
        {step.nodes.map(node => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={22}
              fill={STATE_COLORS[node.state] ?? STATE_COLORS.idle}
              stroke="#fff"
              strokeWidth={2}
            />
            <text
              x={node.x}
              y={node.y + 5}
              textAnchor="middle"
              fill="#fff"
              fontSize="14"
              fontWeight="700"
            >
              {String(node.value)}
            </text>
          </g>
        ))}
      </svg>
      <div className="mt-3 text-sm text-slate-300 px-2 text-center font-mono">{step.description}</div>
      {step.traversalOrder.length > 0 && (
        <div className="mt-2 text-xs text-slate-400 px-2">
          Order: <span className="text-emerald-400">{step.traversalOrder.map(i => {
            const node = step.nodes.find(n => n.id === i);
            return node ? String(node.value) : i;
          }).join(' ? ')}</span>
        </div>
      )}
    </div>
  );
}
