'use server';
/**
 * @fileOverview A presentation creator AI agent.
 *
 * - createPresentation - A function that handles the presentation creation process.
 * - CreatePresentationInput - The input type for the createPresentation function.
 * - CreatePresentationOutput - The return type for the createPresentation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreatePresentationInputSchema = z.object({
  topic: z.string().describe('The topic of the presentation.'),
  exhibitorCount: z.number().describe('The number of people who will be presenting.'),
  length: z.enum(['corta', 'media', 'larga']).describe('The desired length of the presentation.'),
  style: z.enum(['Creativo', 'Formal', 'Divertido', 'Informativo']).describe('The desired style of the presentation.'),
});
export type CreatePresentationInput = z.infer<typeof CreatePresentationInputSchema>;

const CreatePresentationOutputSchema = z.object({
  title: z.string().describe('The main title of the presentation.'),
  introduction: z.string().describe('A brief introduction to the topic. This part is for the first exhibitor.'),
  exhibitorSections: z.array(z.object({
    exhibitor: z.number().describe('The exhibitor number (e.g., 1, 2, 3).'),
    content: z.string().describe('The paragraph or content assigned to this exhibitor.'),
  })).describe('An array of content sections, one for each exhibitor.'),
  conclusion: z.string().describe('A concluding summary for the presentation. This part is for the last exhibitor.'),
});
export type CreatePresentationOutput = z.infer<typeof CreatePresentationOutputSchema>;


export async function createPresentation(input: CreatePresentationInput): Promise<CreatePresentationOutput> {
  return createPresentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createPresentationPrompt',
  input: {schema: CreatePresentationInputSchema},
  output: {schema: CreatePresentationOutputSchema},
  prompt: `Eres un experto guionista de presentaciones. Tu tarea es generar un guion claro, natural y bien estructurado sobre un tema específico, distribuyendo el contenido entre varios expositores.
  IMPORTANTE: Tu respuesta debe ser en español.

El guion debe ser coherente y el contenido de cada expositor debe fluir de manera lógica.
El estilo de la presentación debe ser: **{{style}}**. Adapta el tono, el lenguaje y la estructura a este estilo.
- 'Creativo': Usa un lenguaje más imaginativo, metáforas y un tono entusiasta.
- 'Formal': Usa un lenguaje técnico, preciso y una estructura muy ordenada. Tono serio y profesional.
- 'Divertido': Usa un lenguaje cercano, humor y ejemplos entretenidos. Tono ligero y amigable.
- 'Informativo': Céntrate en los datos, hechos y explicaciones claras. Tono neutral y directo.

El guion debe incluir:
1.  Un título principal.
2.  Una introducción GENERAL del tema, que será dicha únicamente por el Expositor 1.
3.  Párrafos de contenido para cada uno de los {{exhibitorCount}} expositores. Los expositores que no son el primero ni el último deben presentar ÚNICAMENTE la información que les corresponde, sin frases introductorias como "A continuación, yo les hablaré de...". Su contenido debe ser directo.
4.  Una conclusión para resumir los puntos clave, que será dicha por el último expositor.

La longitud de la presentación debe ser '{{length}}'. Ajusta la profundidad y el detalle del contenido de cada expositor en consecuencia:
- 'corta': Genera explicaciones detalladas y elaboradas para cada punto.
- 'media': Crea un análisis en profundidad, con más datos, ejemplos o detalles específicos.
- 'larga': Desarrolla párrafos muy extensos y un análisis exhaustivo para cada sección. El contenido debe ser significativamente más largo y profundo que en la opción 'media'.

El resultado debe ser un JSON estructurado con un título, introducción, un array de \`exhibitorSections\` y una conclusión. Cada elemento en \`exhibitorSections\` debe indicar claramente el número del expositor y el contenido que se le ha asignado. Asegúrate de que el contenido sea informativo, relevante y fácil de entender para una audiencia.

Tema: {{{topic}}}
Número de expositores: {{{exhibitorCount}}}
Longitud: {{{length}}}
Estilo: {{{style}}}

Genera el guion del contenido.`,
  model: 'googleai/gemini-1.5-flash-latest',
});

const createPresentationFlow = ai.defineFlow(
  {
    name: 'createPresentationFlow',
    inputSchema: CreatePresentationInputSchema,
    outputSchema: CreatePresentationOutputSchema,
  },
  async input => {
    const response = await prompt(input);
    return response.output!;
  }
);
