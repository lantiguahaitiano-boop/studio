'use client';

import * as React from 'react';
import { MindMapNode } from '@/ai/flows/mind-map-generator';
import { cn } from '@/lib/utils';

interface MindMapVisualizerProps {
  node: MindMapNode;
  level?: number;
  isLast?: boolean;
}

export const MindMapVisualizer: React.FC<MindMapVisualizerProps> = ({ node, level = 0, isLast = true }) => {
  const levelColors = [
    'text-primary font-bold',
    'text-accent font-semibold',
    'text-foreground',
    'text-muted-foreground',
  ];

  return (
    <div className={cn("relative", level > 0 && "pl-8")}>
        {level > 0 && (
            <div 
                className={cn(
                    "absolute left-2.5 top-0 w-px bg-border", 
                    isLast ? "h-5" : "h-full"
                )}
            />
        )}
        {level > 0 && (
             <div className="absolute left-2.5 top-5 h-px w-3 bg-border" />
        )}

      <div className="flex items-center gap-3 py-1">
         <div className={cn(
             "flex h-5 w-5 items-center justify-center rounded-full",
             level === 0 && "bg-primary text-primary-foreground",
             level === 1 && "bg-accent text-accent-foreground",
             level > 1 && "bg-muted text-muted-foreground",
         )}>
             <span className="text-xs font-bold">{node.label.charAt(0)}</span>
         </div>
        <span
          className={cn('font-medium', levelColors[level % levelColors.length])}
          style={{ fontSize: `${Math.max(0.8, 1.4 - level * 0.15)}rem` }}
        >
          {node.label}
        </span>
      </div>

      {node.children && node.children.length > 0 && (
        <div className="relative mt-2 flex flex-col gap-1">
          {node.children.map((child, index) => (
            <MindMapVisualizer 
                key={index} 
                node={child} 
                level={level + 1} 
                isLast={index === (node.children || []).length - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};
