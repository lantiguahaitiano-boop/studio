'use server';

/**
 * @fileOverview Implements an AI flow to explain a mathematical operation.
 *
 * - explainMath - A function that handles the math explanation process.
 * - ExplainMathInput - The input type for the explainMath function.
 * - ExplainMathOutput - The return type for the explainMath function.
 */

import { ai, googleAI } from '@/ai/genkit';
import { z } from 'genkit';

const ExplainMathInputSchema = z.object({
  operation: z.string().describe('The mathematical operation to be explained.'),
  result: z.string().describe('The result of the operation.'),
});
export type ExplainMathInput = z.infer<typeof ExplainMathInputSchema>;

const ExplainMathOutputSchema = z.object({
  explanation: z.string().describe('The step-by-step explanation of the mathematical operation.'),
});
export type ExplainMathOutput = z.infer<typeof ExplainMathOutputSchema>;

export async function explainMath(input: ExplainMathInput): Promise<ExplainMathOutput> {
  return explainMathFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainMathPrompt',
  input: { schema: ExplainMathInputSchema },
  output: { schema: ExplainMathOutputSchema },
  prompt: `You are an expert math teacher. Your task is to explain the following mathematical operation and its result in a clear, step-by-step manner.
  IMPORTANT: Your response must be in Spanish.

  Operation: {{{operation}}}
  Result: {{{result}}}

  Provide a detailed explanation of how to arrive at the result.
  `,
  model: googleAI.model('gemini-1.5-flash-latest'),
});

const explainMathFlow = ai.defineFlow(
  {
    name: 'explainMathFlow',
    inputSchema: ExplainMathInputSchema,
    outputSchema: ExplainMathOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
