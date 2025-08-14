'use server';

/**
 * @fileOverview Implements an AI flow to generate an exam based on a topic.
 *
 * - generateExam - A function that handles the exam generation process.
 * - GenerateExamInput - The input type for the generateExam function.
 * - GenerateExamOutput - The return type for the generateExam function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateExamInputSchema = z.object({
  topic: z.string().describe('The topic of the exam.'),
  numQuestions: z.number().describe('The number of questions for the exam.'),
});
export type GenerateExamInput = z.infer<typeof GenerateExamInputSchema>;

const GenerateExamOutputSchema = z.object({
  questions: z.array(z.object({
    question: z.string().describe('The question.'),
    options: z.array(z.string()).describe('An array of 4 multiple choice options.'),
    answer: z.string().describe('The correct answer from the options.'),
  })).describe('An array of exam questions.'),
});
export type GenerateExamOutput = z.infer<typeof GenerateExamOutputSchema>;

export async function generateExam(input: GenerateExamInput): Promise<GenerateExamOutput> {
  return generateExamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExamPrompt',
  input: { schema: GenerateExamInputSchema },
  output: { schema: GenerateExamOutputSchema },
  prompt: `You are an AI assistant for creating exams. Your task is to generate a multiple-choice exam based on the provided topic. Create {{numQuestions}} questions. Each question should have 4 options, and one of them must be the correct answer.
  IMPORTANT: Your response must be in Spanish.

  Topic:
  {{{topic}}}
  `,
  model: 'googleai/gemini-1.5-flash-latest',
});

const generateExamFlow = ai.defineFlow(
  {
    name: 'generateExamFlow',
    inputSchema: GenerateExamInputSchema,
    outputSchema: GenerateExamOutputSchema,
  },
  async (input) => {
    const response = await prompt(input);
    return response.output!;
  }
);
