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
  slideCount: z.number().describe('The approximate number of sections or key points the presentation should have.'),
});
export type CreatePresentationInput = z.infer<typeof CreatePresentationInputSchema>;

const CreatePresentationOutputSchema = z.object({
  title: z.string().describe('The main title of the presentation.'),
  introduction: z.string().describe('A brief introduction to the topic.'),
  sections: z.array(z.object({
    title: z.string().describe('The title of this section of the presentation.'),
    points: z.array(z.string()).describe('An array of key points or content for this section.'),
  })).describe('The main sections of the presentation.'),
  conclusion: z.string().describe('A concluding summary for the presentation.'),
});
export type CreatePresentationOutput = z.infer<typeof CreatePresentationOutputSchema>;


export async function createPresentation(input: CreatePresentationInput): Promise<CreatePresentationOutput> {
  return createPresentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createPresentationPrompt',
  input: {schema: CreatePresentationInputSchema},
  output: {schema: CreatePresentationOutputSchema},
  prompt: `You are an expert presentation creator. You will generate a structured plan for a presentation on a given topic. The user will specify a number of slides, which you should interpret as the number of main sections or key ideas to develop.

The plan should include a main title, a brief introduction, several sections with a title and key points, and a conclusion.

Topic: {{{topic}}}
Number of sections/ideas: {{{slideCount}}}

Generate the content plan. The content should be concise and informative.`,
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
