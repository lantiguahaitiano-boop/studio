'use client';

import * as React from 'react';
import { GenerateFlowchartOutput, FlowchartNode, FlowchartEdge } from '@/ai/flows/flowchart-generator';
import { cn } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';

const getNodeClasses = (type: FlowchartNode['type']) => {
  const baseClasses = "flex items-center justify-center text-center p-4 min-h-[80px] w-full shadow-md border-2 text-sm";
  switch (type) {
    case 'start':
    case 'end':
      return cn(baseClasses, "rounded-full bg-accent/30 border-accent text-accent-foreground font-bold");
    case 'process':
      return cn(baseClasses, "rounded-lg bg-primary/20 border-primary text-primary-foreground");
    case 'decision':
      return cn(baseClasses, "transform -rotate-45 bg-secondary border-secondary-foreground w-[140px] h-[140px] mx-auto");
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
  <div className="relative my-4 flex h-12 flex-col items-center justify-center text-muted-foreground">
    <ArrowDown className="h-8 w-8 text-primary" />
    {label && (
        <span className="absolute -right-4 top-1/2 -translate-y-1/2 rounded bg-background px-2 py-0.5 text-xs font-semibold shadow-md">
            {label}
        </span>
    )}
  </div>
);


const RenderedTree: React.FC<{
  nodeId: string;
  nodeMap: Map<string, FlowchartNode>;
  edgeMap: Map<string, FlowchartEdge[]>;
  renderedNodeIds: Set<string>;
}> = ({ nodeId, nodeMap, edgeMap, renderedNodeIds }) => {
  if (renderedNodeIds.has(nodeId)) return null;

  const node = nodeMap.get(nodeId);
  if (!node) return null;

  renderedNodeIds.add(nodeId);
  const outgoingEdges = edgeMap.get(nodeId) || [];

  return (
    <div className="flex flex-col items-center">
      <Node node={node} />
      {outgoingEdges.length > 0 && node.type !== 'decision' && <Edge label={outgoingEdges[0].label} />}
      
      {outgoingEdges.length > 0 && (
         <div className={cn("flex w-full", outgoingEdges.length > 1 ? "items-start justify-around gap-4" : "flex-col items-center")}>
            {outgoingEdges.map(edge => (
                <div key={edge.to} className="flex flex-1 flex-col items-center gap-2">
                {node.type === 'decision' && (
                    <>
                        <div className="rounded-md bg-muted px-3 py-1 text-xs font-bold">{edge.label}</div>
                        <Edge />
                    </>
                )}
                <RenderedTree
                    nodeId={edge.to}
                    nodeMap={nodeMap}
                    edgeMap={edgeMap}
                    renderedNodeIds={renderedNodeIds}
                />
                </div>
            ))}
        </div>
      )}
    </div>
  );
};


export const FlowchartVisualizer: React.FC<{ data: GenerateFlowchartOutput }> = ({ data }) => {
  if (!data || !data.nodes || data.nodes.length === 0) {
    return <p>No se pudo generar el diagrama.</p>;
  }

  const { nodes, edges } = data;
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const edgeMap = new Map<string, FlowchartEdge[]>();
  edges.forEach(edge => {
    if (!edgeMap.has(edge.from)) {
      edgeMap.set(edge.from, []);
    }
    edgeMap.get(edge.from)!.push(edge);
  });
  
  const startNode = nodes.find(n => n.type === 'start');
  if (!startNode) {
      return <p>Diagrama inválido: no se encontró un nodo de inicio.</p>;
  }

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
       <RenderedTree
        nodeId={startNode.id}
        nodeMap={nodeMap}
        edgeMap={edgeMap}
        renderedNodeIds={new Set<string>()}
      />
    </div>
  );
};
