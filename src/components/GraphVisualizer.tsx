import type { GraphStep } from '../types';

interface GraphVisualizerProps {
  step: GraphStep | null;
  width?: number;
  height?: number;
}

const STATE_COLORS: Record<string, string> = {
  idle: '#475569',
  visiting: '#fbbf24',
  visited: '#22c55e',
  inQueue: '#3b82f6',
  inStack: '#8b5cf6',
  start: '#10b981',
  end: '#ef4444',
  mst: '#06b6d4',
  active: '#f59e0b',
  cycle: '#ec4899',
};

const EDGE_COLORS: Record<string, string> = {
  idle: '#334155',
  considering: '#fbbf24',
  accepted: '#22c55e',
  rejected: '#ef4444',
  tree: '#10b981',
  back: '#ec4899',
};

export default function GraphVisualizer({ step, width = 700, height = 400 }: GraphVisualizerProps) {
  if (!step) {
    return <div className="text-slate-400 text-center py-8">Run algorithm to see visualization</div>;
  }

  const nodeMap = new Map(step.nodes.map(n => [n.id, n]));

  return (
    <div className="bg-slate-900 rounded-lg p-2 border border-slate-700 overflow-auto">
      <svg width={width} height={height} className="block mx-auto">
        {step.edges.map((edge, idx) => {
          const from = nodeMap.get(edge.from);
          const to = nodeMap.get(edge.to);
          if (!from || !to) return null;
          const isInMST = step.mstEdges.some(e => (e.from === edge.from && e.to === edge.to) || (e.from === edge.to && e.to === edge.from));
          const stroke = isInMST ? '#10b981' : (EDGE_COLORS[edge.state] ?? EDGE_COLORS.idle);
          const strokeWidth = isInMST ? 3 : 2;
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2;
          return (
            <g key={idx}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={stroke}
                strokeWidth={strokeWidth}
                opacity={edge.state === 'idle' && !isInMST ? 0.3 : 0.9}
              />
              {edge.weight !== 0 && (
                <text
                  x={midX}
                  y={midY - 4}
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="10"
                  fontWeight="600"
                >
                  {edge.weight}
                </text>
              )}
            </g>
          );
        })}
        {step.nodes.map(node => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r={20}
              fill={STATE_COLORS[node.state] ?? STATE_COLORS.idle}
              stroke="#fff"
              strokeWidth={2}
            />
            <text
              x={node.x}
              y={node.y + 4}
              textAnchor="middle"
              fill="#fff"
              fontSize="13"
              fontWeight="700"
            >
              {node.label}
            </text>
            {node.distance !== Infinity && node.distance !== undefined && (
              <text
                x={node.x}
                y={node.y + 36}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize="10"
              >
                d={node.distance === Infinity ? '8' : node.distance}
              </text>
            )}
          </g>
        ))}
      </svg>
      <div className="mt-2 text-xs text-slate-400 px-2">{step.description}</div>
      {step.queue && step.queue.length > 0 && (
        <div className="mt-1 text-xs text-slate-400 px-2">Queue: [{step.queue.map(i => step.nodes[i]?.label ?? i).join(', ')}]</div>
      )}
      {step.stack && step.stack.length > 0 && (
        <div className="mt-1 text-xs text-slate-400 px-2">Stack: [{step.stack.map(i => step.nodes[i]?.label ?? i).join(', ')}]</div>
      )}
    </div>
  );
}
