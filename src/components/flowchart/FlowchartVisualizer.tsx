'use client';

import * as React from 'react';
import { GenerateFlowchartOutput, FlowchartNode } from '@/ai/flows/flowchart-generator';
import { cn } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';

const getNodeClasses = (type: FlowchartNode['type']) => {
  const baseClasses = "flex items-center justify-center text-center p-4 min-h-[80px] w-full shadow-md border-2";
  switch (type) {
    case 'start':
    case 'end':
      return cn(baseClasses, "rounded-full bg-accent/30 border-accent text-accent-foreground font-bold");
    case 'process':
      return cn(baseClasses, "rounded-lg bg-primary/20 border-primary text-primary-foreground");
    case 'decision':
      return cn(baseClasses, "transform -rotate-45 bg-secondary border-secondary-foreground w-[120px] h-[120px] mx-auto");
    case 'io':
      return cn(baseClasses, "transform skew-x-[-20deg] bg-muted border-muted-foreground");
    default:
      return cn(baseClasses, "rounded-lg bg-muted");
  }
};

const Node: React.FC<{ node: FlowchartNode }> = ({ node }) => {
    const wrapperClasses = getNodeClasses(node.type);
    const textClasses = node.type === 'decision' ? "transform rotate-45" : "";

    return (
        <div className="flex flex-col items-center">
            <div className={wrapperClasses}>
                <span className={textClasses}>{node.label}</span>
            </div>
        </div>
    );
};

const Edge: React.FC<{ label?: string }> = ({ label }) => (
  <div className="relative my-4 flex flex-col items-center justify-center text-muted-foreground">
    <ArrowDown className="h-8 w-8 text-primary" />
    {label && (
        <span className="absolute -right-8 top-1/2 -translate-y-1/2 rounded bg-background px-2 py-1 text-xs font-semibold shadow">
            {label}
        </span>
    )}
  </div>
);

export const FlowchartVisualizer: React.FC<{ data: GenerateFlowchartOutput }> = ({ data }) => {
  if (!data || !data.nodes || data.nodes.length === 0) {
    return <p>No se pudo generar el diagrama.</p>;
  }

  const { nodes, edges } = data;
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  
  const startNodeId = nodes.find(n => n.type === 'start')?.id;
  if (!startNodeId) {
      return <p>Diagrama inválido: no se encontró un nodo de inicio.</p>;
  }

  const renderedElements: JSX.Element[] = [];
  const renderedNodeIds = new Set<string>();

  const renderNodeAndChildren = (nodeId: string) => {
    if (renderedNodeIds.has(nodeId)) return;
    
    const node = nodeMap.get(nodeId);
    if (!node) return;

    renderedElements.push(<Node key={node.id} node={node} />);
    renderedNodeIds.add(node.id);

    const outgoingEdges = edges.filter(e => e.from === nodeId);

    if (outgoingEdges.length > 1) { // Typically a decision node
      renderedElements.push(<Edge key={`${nodeId}-arrow`} />);
      const decisionWrapper: JSX.Element[] = [];
      outgoingEdges.forEach(edge => {
        const nextNode = nodeMap.get(edge.to);
        if (nextNode) {
          decisionWrapper.push(
            <div key={edge.to} className="flex flex-col items-center">
                <div className="text-center font-bold mb-2 p-2 bg-muted rounded-md">{edge.label || ''}</div>
                <Node node={nextNode} />
                {edges.some(e => e.from === nextNode.id) && <Edge key={`${nextNode.id}-arrow`} />}
                {/* This part is simplified and might not render deep trees correctly */}
            </div>
          );
        }
      });
      renderedElements.push(
        <div key={`${nodeId}-decision-group`} className="flex w-full justify-around gap-4 mt-4">
            {decisionWrapper}
        </div>
      );
      // For simplicity, stop deep rendering after a multi-path branch
    } else if (outgoingEdges.length === 1) {
      const edge = outgoingEdges[0];
      renderedElements.push(<Edge key={edge.from + '-' + edge.to} label={edge.label} />);
      renderNodeAndChildren(edge.to);
    }
  };

  renderNodeAndChildren(startNodeId);

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      {renderedElements}
    </div>
  );
};
