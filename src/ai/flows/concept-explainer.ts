'use server';

/**
 * @fileOverview Implements an AI flow to explain complex concepts in a simple way.
 *
 * - explainConcept - A function that handles the concept explanation process.
 * - ExplainConceptInput - The input type for the explainConcept function.
 * - ExplainConceptOutput - The return type for the explainConcept function.
 */

import { ai, googleAI } from '@/ai/genkit';
import { z } from 'zod';

const ExplainConceptInputSchema = z.object({
  concept: z.string().describe('The complex concept to be explained.'),
});
export type ExplainConceptInput = z.infer<typeof ExplainConceptInputSchema>;

const ExplainConceptOutputSchema = z.object({
  explanation: z.string().describe('The simplified explanation of the concept.'),
});
export type ExplainConceptOutput = z.infer<typeof ExplainConceptOutputSchema>;

export async function explainConcept(input: ExplainConceptInput): Promise<ExplainConceptOutput> {
  return explainConceptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainConceptPrompt',
  input: { schema: ExplainConceptInputSchema },
  output: { schema: ExplainConceptOutputSchema },
  prompt: `You are an expert in simplifying complex topics. Your task is to explain the following concept in a clear, simple, and easy-to-understand way.

  Concept:
  {{{concept}}}
  `,
  model: googleAI.model('gemini-1.5-flash-latest'),
});

const explainConceptFlow = ai.defineFlow(
  {
    name: 'explainConceptFlow',
    inputSchema: ExplainConceptInputSchema,
    outputSchema: ExplainConceptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
