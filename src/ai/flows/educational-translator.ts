'use server';

/**
 * @fileOverview Translates academic texts with proper context.
 *
 * - educationalTranslator - A function that handles the translation process.
 * - EducationalTranslatorInput - The input type for the educationalTranslator function.
 * - EducationalTranslatorOutput - The return type for the educationalTranslator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EducationalTranslatorInputSchema = z.object({
  text: z.string().describe('The academic text to translate.'),
  targetLanguage: z.string().describe('The target language for the translation.'),
  context: z.string().optional().describe('Additional context to improve translation accuracy.'),
});
export type EducationalTranslatorInput = z.infer<typeof EducationalTranslatorInputSchema>;

const EducationalTranslatorOutputSchema = z.object({
  translatedText: z.string().describe('The translated academic text.'),
});
export type EducationalTranslatorOutput = z.infer<typeof EducationalTranslatorOutputSchema>;

export async function educationalTranslator(input: EducationalTranslatorInput): Promise<EducationalTranslatorOutput> {
  return educationalTranslatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'educationalTranslatorPrompt',
  input: {schema: EducationalTranslatorInputSchema},
  output: {schema: EducationalTranslatorOutputSchema},
  prompt: `You are an expert academic translator. Your task is to translate the following academic text to {{targetLanguage}}. Use the provided context to ensure accuracy.
  IMPORTANT: Your response must be in the target language.

  Text to translate:
  {{{text}}}
  
  {{#if context}}
  Context: {{{context}}}
  {{/if}}
  `,
  model: 'googleai/gemini-1.5-flash-latest',
});

const educationalTranslatorFlow = ai.defineFlow(
  {
    name: 'educationalTranslatorFlow',
    inputSchema: EducationalTranslatorInputSchema,
    outputSchema: EducationalTranslatorOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    return response.output!;
  }
);
