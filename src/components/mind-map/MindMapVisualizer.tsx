'use client';

import * as React from 'react';
import { MindMapNode } from '@/ai/flows/mind-map-generator';
import { GitBranch } from 'lucide-react';

interface MindMapVisualizerProps {
  node: MindMapNode;
  level?: number;
}

export const MindMapVisualizer: React.FC<MindMapVisualizerProps> = ({ node, level = 0 }) => {
  const levelColors = [
    'text-primary',
    'text-accent',
    'text-secondary-foreground',
    'text-muted-foreground',
  ];

  return (
    <div style={{ marginLeft: level > 0 ? '20px' : '0' }}>
      <div className="flex items-center gap-2">
        {level > 0 && <GitBranch className="h-4 w-4 text-muted-foreground/70" />}
        <span
          className={`font-medium ${levelColors[level % levelColors.length]}`}
          style={{ fontSize: `${Math.max(1, 1.25 - level * 0.15)}rem` }}
        >
          {node.label}
        </span>
      </div>
      {node.children && node.children.length > 0 && (
        <div className="mt-2 flex flex-col gap-2 border-l-2 border-border/50 pl-4">
          {node.children.map((child, index) => (
            <MindMapVisualizer key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};
