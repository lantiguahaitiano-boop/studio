'use server';

/**
 * @fileOverview Implements an AI flow to generate a project plan for a research topic.
 *
 * - planProject - A function that handles the project planning process.
 * - PlanProjectInput - The input type for the planProject function.
 * - PlanProjectOutput - The return type for the planProject function.
 */

import { ai, googleAI } from '@/ai/genkit';
import { z } from 'genkit';

const PlanProjectInputSchema = z.object({
  topic: z.string().describe('The research topic for the project.'),
});
export type PlanProjectInput = z.infer<typeof PlanProjectInputSchema>;

const PlanProjectOutputSchema = z.object({
  title: z.string().describe('A suggested title for the project.'),
  introduction: z.string().describe('An introduction for the project.'),
  sections: z.array(z.object({
    title: z.string().describe('The title of the project section.'),
    content: z.string().describe('The detailed content or points to cover in this section.'),
  })).describe('An array of sections for the project structure.'),
  conclusion: z.string().describe('A conclusion for the project.'),
  bibliography: z.array(z.string()).describe('A list of suggested bibliographic resources.'),
});
export type PlanProjectOutput = z.infer<typeof PlanProjectOutputSchema>;

export async function planProject(input: PlanProjectInput): Promise<PlanProjectOutput> {
  return planProjectFlow(input);
}

const prompt = ai.definePrompt({
  name: 'planProjectPrompt',
  input: { schema: PlanProjectInputSchema },
  output: { schema: PlanProjectOutputSchema },
  prompt: `You are an expert academic advisor. Your task is to generate a detailed project plan for a given research topic. The plan should include a title, introduction, structured sections with content points, a conclusion, and suggested bibliographic resources.

  Topic:
  {{{topic}}}
  `,
  model: googleAI.model('gemini-1.5-flash-latest'),
});

const planProjectFlow = ai.defineFlow(
  {
    name: 'planProjectFlow',
    inputSchema: PlanProjectInputSchema,
    outputSchema: PlanProjectOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
