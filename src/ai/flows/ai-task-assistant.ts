'use server';

/**
 * @fileOverview An AI task assistant that provides step-by-step assistance with academic problems.
 *
 * - aiTaskAssistant - A function that handles the task assistance process.
 * - AiTaskAssistantInput - The input type for the aiTaskAssistant function.
 * - AiTaskAssistantOutput - The return type for the aiTaskAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTaskAssistantInputSchema = z.object({
  problemDescription: z
    .string()
    .describe('A description of the academic problem that requires assistance.'),
});
export type AiTaskAssistantInput = z.infer<typeof AiTaskAssistantInputSchema>;

const AiTaskAssistantOutputSchema = z.object({
  stepByStepSolution: z
    .string()
    .describe('A step-by-step solution to the academic problem.'),
});
export type AiTaskAssistantOutput = z.infer<typeof AiTaskAssistantOutputSchema>;

export async function aiTaskAssistant(input: AiTaskAssistantInput): Promise<AiTaskAssistantOutput> {
  return aiTaskAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTaskAssistantPrompt',
  input: {schema: AiTaskAssistantInputSchema},
  output: {schema: AiTaskAssistantOutputSchema},
  prompt: `You are an AI assistant specialized in providing step-by-step solutions to academic problems.
  IMPORTANT: Your response must be in Spanish.

  Problem: {{{problemDescription}}}

  Provide a detailed, step-by-step solution to the problem. Explain each step clearly and concisely.
  `,
  model: 'googleai/gemini-1.5-flash-latest',
});

const aiTaskAssistantFlow = ai.defineFlow(
  {
    name: 'aiTaskAssistantFlow',
    inputSchema: AiTaskAssistantInputSchema,
    outputSchema: AiTaskAssistantOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    return response.output!;
  }
);
