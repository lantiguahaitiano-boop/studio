'use server';

/**
 * @fileOverview Implements an AI flow to generate a mind map from a topic.
 *
 * - generateMindMap - A function that handles the mind map generation.
 * - GenerateMindMapInput - The input type for the generateMindMap function.
 * - GenerateMindMapOutput - The return type for the generateMindMap function.
 * - MindMapNode - The recursive type for a node in the mind map.
 */

import { ai, googleAI } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateMindMapInputSchema = z.object({
  topic: z.string().describe('The central topic for the mind map.'),
});
export type GenerateMindMapInput = z.infer<typeof GenerateMindMapInputSchema>;

// We need a recursive schema for the mind map nodes.
const MindMapNodeSchema: z.ZodType<MindMapNode> = z.lazy(() =>
  z.object({
    label: z.string().describe('The label for this node in the mind map.'),
    children: z.array(MindMapNodeSchema).optional().describe('An array of child nodes.'),
  })
);

export type MindMapNode = {
    label: string;
    children?: MindMapNode[];
};

const GenerateMindMapOutputSchema = z.object({
  root: MindMapNodeSchema.describe('The root node of the generated mind map structure.'),
});
export type GenerateMindMapOutput = z.infer<typeof GenerateMindMapOutputSchema>;

export async function generateMindMap(input: GenerateMindMapInput): Promise<GenerateMindMapOutput> {
  return generateMindMapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateMindMapPrompt',
  input: { schema: GenerateMindMapInputSchema },
  output: { schema: GenerateMindMapOutputSchema },
  prompt: `You are an expert in structuring information. Your task is to generate a hierarchical mind map structure for a given topic. 
  IMPORTANT: Your response must be in Spanish.
  
  The structure should start with a single root node representing the main topic. This root node should have several child nodes for the main ideas or sub-topics. Each of these can have their own children, creating a tree-like structure. Keep the hierarchy logical and the labels concise. Aim for 3-4 levels of depth.

  Topic:
  {{{topic}}}
  `,
  model: googleAI.model('gemini-1.5-flash-latest'),
});

const generateMindMapFlow = ai.defineFlow(
  {
    name: 'generateMindMapFlow',
    inputSchema: GenerateMindMapInputSchema,
    outputSchema: GenerateMindMapOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
