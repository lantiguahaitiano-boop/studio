'use server';

/**
 * @fileOverview Implements an AI flow to generate a flowchart from a process description.
 *
 * - generateFlowchart - A function that handles the flowchart generation.
 * - GenerateFlowchartInput - The input type for the generateFlowchart function.
 * - GenerateFlowchartOutput - The return type for the generateFlowchart function.
 */

import { ai, googleAI } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateFlowchartInputSchema = z.object({
  process: z.string().describe('A description of the process to be turned into a flowchart.'),
});
export type GenerateFlowchartInput = z.infer<typeof GenerateFlowchartInputSchema>;

const FlowchartNodeSchema = z.object({
  id: z.string().describe('A unique identifier for the node.'),
  label: z.string().describe('The text content of the node.'),
  type: z.enum(['start', 'end', 'process', 'decision', 'io']).describe('The shape/type of the node.'),
});

const FlowchartEdgeSchema = z.object({
  from: z.string().describe('The ID of the source node.'),
  to: z.string().describe('The ID of the target node.'),
  label: z.string().optional().describe('An optional label for the connection (e.g., "Yes" or "No" for decisions).'),
});

const GenerateFlowchartOutputSchema = z.object({
  nodes: z.array(FlowchartNodeSchema).describe('An array of all the nodes in the flowchart.'),
  edges: z.array(FlowchartEdgeSchema).describe('An array of all the connections between nodes.'),
});
export type GenerateFlowchartOutput = z.infer<typeof GenerateFlowchartOutputSchema>;
export type FlowchartNode = z.infer<typeof FlowchartNodeSchema>;
export type FlowchartEdge = z.infer<typeof FlowchartEdgeSchema>;


export async function generateFlowchart(input: GenerateFlowchartInput): Promise<GenerateFlowchartOutput> {
  return generateFlowchartFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateFlowchartPrompt',
  input: { schema: GenerateFlowchartInputSchema },
  output: { schema: GenerateFlowchartOutputSchema },
  prompt: `You are an expert in creating structured diagrams. Your task is to convert a user's description of a process into a flowchart.

  Analyze the process and break it down into logical steps. Create nodes for each step and define the connections (edges) between them.
  
  - Start with a 'start' node and end with one or more 'end' nodes.
  - Use 'process' nodes for actions.
  - Use 'decision' nodes for conditional logic (if/else). These should typically have two outgoing edges (e.g., Yes/No).
  - Use 'io' nodes for inputs or outputs.
  - Ensure all nodes are connected. The 'id' for each node must be unique. Make the ids simple like 'node1', 'node2', etc.

  Process description:
  {{{process}}}
  
  IMPORTANT: If the user's input does not describe a clear, step-by-step process (e.g., it's just a topic, a question, or a statement), you MUST generate a flowchart that explains the error to the user. This "error" flowchart should have a 'start' node, an 'io' node explaining that the input was not a process, a 'process' node suggesting an example of a good process, and an 'end' node.
  For example, if the input is "the solar system", create an error flowchart instructing the user to provide a process like "how a bill becomes a law".
  `,
  model: googleAI.model('gemini-1.5-flash-latest'),
});

const generateFlowchartFlow = ai.defineFlow(
  {
    name: 'generateFlowchartFlow',
    inputSchema: GenerateFlowchartInputSchema,
    outputSchema: GenerateFlowchartOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
