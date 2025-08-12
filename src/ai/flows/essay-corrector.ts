'use server';

/**
 * @fileOverview Implements an AI flow to correct grammar and style in essays and texts.
 *
 * - correctEssay - A function that handles the essay correction process.
 * - CorrectEssayInput - The input type for the correctEssay function.
 * - CorrectEssayOutput - The return type for the correctEssay function.
 */

import { ai, googleAI } from '@/ai/genkit';
import { z } from 'zod';

const CorrectEssayInputSchema = z.object({
  text: z.string().describe('The essay or text to be corrected.'),
});
export type CorrectEssayInput = z.infer<typeof CorrectEssayInputSchema>;

const CorrectEssayOutputSchema = z.object({
  correctedText: z.string().describe('The corrected version of the text with grammar and style improvements.'),
});
export type CorrectEssayOutput = z.infer<typeof CorrectEssayOutputSchema>;

export async function correctEssay(input: CorrectEssayInput): Promise<CorrectEssayOutput> {
  return correctEssayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'correctEssayPrompt',
  input: { schema: CorrectEssayInputSchema },
  output: { schema: CorrectEssayOutputSchema },
  prompt: `You are an expert essay corrector. Your task is to review the following text for grammatical errors and style improvements. Provide a corrected version of the text.
  IMPORTANT: Your response must be in Spanish.

  Original Text:
  {{{text}}}
  `,
  model: googleAI.model('gemini-1.5-flash-latest'),
});

const correctEssayFlow = ai.defineFlow(
  {
    name: 'correctEssayFlow',
    inputSchema: CorrectEssayInputSchema,
    outputSchema: CorrectEssayOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
