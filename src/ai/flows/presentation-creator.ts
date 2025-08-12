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
  speakerCount: z.number().describe('The number of people who will be presenting.'),
  length: z.enum(['corta', 'media', 'larga']).describe('The desired length of the presentation.'),
});
export type CreatePresentationInput = z.infer<typeof CreatePresentationInputSchema>;

const CreatePresentationOutputSchema = z.object({
  title: z.string().describe('The main title of the presentation.'),
  introduction: z.string().describe('A brief introduction to the topic. This part is for the first speaker.'),
  speakerSections: z.array(z.object({
    speaker: z.number().describe('The speaker number (e.g., 1, 2, 3).'),
    content: z.string().describe('The paragraph or content assigned to this speaker.'),
  })).describe('An array of content sections, one for each speaker.'),
  conclusion: z.string().describe('A concluding summary for the presentation. This part is for the last speaker.'),
});
export type CreatePresentationOutput = z.infer<typeof CreatePresentationOutputSchema>;


export async function createPresentation(input: CreatePresentationInput): Promise<CreatePresentationOutput> {
  return createPresentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createPresentationPrompt',
  input: {schema: CreatePresentationInputSchema},
  output: {schema: CreatePresentationOutputSchema},
  prompt: `You are an expert presentation creator. You will generate a structured script for a presentation on a given topic for a specific number of speakers.
  IMPORTANT: Your response must be in Spanish.

The script should include a main title, an introduction (for Speaker 1), a dedicated content paragraph for each of the {{speakerCount}} speakers, and a conclusion (for the last speaker).

The length of the presentation should be '{{length}}'. Adjust the depth and detail of each speaker's content accordingly.
- 'corta': Brief and concise points.
- 'media': More detailed explanations.
- 'larga': In-depth analysis with more data or examples.

The output must be structured with a title, introduction, an array of speakerSections, and a conclusion. Each element in the speakerSections array must clearly indicate the speaker number and their assigned content.

Topic: {{{topic}}}
Number of speakers: {{{speakerCount}}}
Length: {{{length}}}

Generate the content script. The content should be informative and well-organized.`,
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
