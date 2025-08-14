// EducationalTranslatorFlow translates academic texts with proper context.

'use server';

import {ai, googleAI} from '@/ai/genkit';
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
  prompt: `Translate the following academic text to {{targetLanguage}}.\n\nText: {{{text}}}\n\n{% if context %}Context: {{{context}}}{% endif %}`,
  model: googleAI.model('gemini-1.5-flash-latest'),
});

const educationalTranslatorFlow = ai.defineFlow(
  {
    name: 'educationalTranslatorFlow',
    inputSchema: EducationalTranslatorInputSchema,
    outputSchema: EducationalTranslatorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
