// src/ai/flows/presentation-creator.ts
'use server';
/**
 * @fileOverview A presentation creator AI agent.
 *
 * - createPresentation - A function that handles the presentation creation process.
 * - CreatePresentationInput - The input type for the createPresentation function.
 * - CreatePresentationOutput - The return type for the createPresentation function.
 */

import {ai, googleAI} from '@/ai/genkit';
import {z} from 'genkit';

const CreatePresentationInputSchema = z.object({
  topic: z.string().describe('The topic of the presentation.'),
  slideCount: z.number().describe('The number of slides in the presentation.'),
});
export type CreatePresentationInput = z.infer<typeof CreatePresentationInputSchema>;

const CreatePresentationOutputSchema = z.object({
  slides: z.array(z.string()).describe('The content for each slide in the presentation.'),
});
export type CreatePresentationOutput = z.infer<typeof CreatePresentationOutputSchema>;

export async function createPresentation(input: CreatePresentationInput): Promise<CreatePresentationOutput> {
  return createPresentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createPresentationPrompt',
  input: {schema: CreatePresentationInputSchema},
  output: {schema: CreatePresentationOutputSchema},
  prompt: `You are an expert presentation creator. You will generate content for a presentation on the given topic, with the specified number of slides.

Topic: {{{topic}}}
Number of slides: {{{slideCount}}}

Generate the content for each slide. The content should be concise and informative.

Output the slides as a JSON array of strings.`,
  model: googleAI.model('gemini-1.5-flash-latest'),
});

const createPresentationFlow = ai.defineFlow(
  {
    name: 'createPresentationFlow',
    inputSchema: CreatePresentationInputSchema,
    outputSchema: CreatePresentationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
