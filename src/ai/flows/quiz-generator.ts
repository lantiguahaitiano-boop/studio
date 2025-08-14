'use server';

/**
 * @fileOverview Implements an AI flow to generate a quiz from a given text.
 *
 * - generateQuiz - A function that handles the quiz generation process.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  text: z.string().describe('The source text to generate a quiz from.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  questions: z.array(z.object({
    question: z.string().describe('The question.'),
    options: z.array(z.string()).describe('An array of 4 multiple choice options.'),
    answer: z.string().describe('The correct answer from the options.'),
  })).describe('An array of quiz questions.'),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  return generateQuizFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an AI assistant for students. Your task is to generate a multiple-choice quiz based on the provided text. Create 5 questions. Each question should have 4 options, and one of them must be the correct answer.
  IMPORTANT: Your response must be in Spanish.

  Source Text:
  {{{text}}}
  `,
  model: 'googleai/gemini-1.5-flash-latest',
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema,
    outputSchema: GenerateQuizOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    return response.output!;
  }
);
