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
  introduction: z.object({
      content: z.string().describe('A brief introduction to the topic. This part is for the first exhibitor.'),
      imagePrompt: z.string().describe('A descriptive prompt for an image that visually represents the introduction.')
  }),
  exhibitorSections: z.array(z.object({
    exhibitor: z.number().describe('The exhibitor number (e.g., 1, 2, 3).'),
    content: z.string().describe('The paragraph or content assigned to this exhibitor.'),
    imagePrompt: z.string().describe('A descriptive prompt for an image that visually represents this exhibitor\'s content.')
  })).describe('An array of content sections, one for each exhibitor.'),
  conclusion: z.object({
      content: z.string().describe('A concluding summary for the presentation. This part is for the last exhibitor.'),
      imagePrompt: z.string().describe('A descriptive prompt for an image that visually represents the conclusion.')
  }),
});
export type CreatePresentationOutput = z.infer<typeof CreatePresentationOutputSchema>;


export async function createPresentation(input: CreatePresentationInput): Promise<CreatePresentationOutput> {
  return createPresentationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'createPresentationPrompt',
  input: {schema: CreatePresentationInputSchema},
  output: {schema: CreatePresentationOutputSchema},
  prompt: `Eres un experto guionista de presentaciones y director creativo. Tu tarea es generar un guion claro, natural y bien estructurado sobre un tema específico, distribuyendo el contenido entre varios expositores. Además, para cada sección de contenido (introducción, secciones de expositores y conclusión), debes crear un prompt descriptivo para generar una imagen que represente visualmente esa parte de la presentación.

  IMPORTANTE: Tu respuesta debe ser en español.

El guion debe ser coherente y el contenido de cada expositor debe fluir de manera lógica.
El estilo de la presentación debe ser: **{{style}}**. Adapta el tono, el lenguaje y la estructura a este estilo.
- 'Creativo': Usa un lenguaje más imaginativo, metáforas y un tono entusiasta. Los prompts de imagen deben ser abstractos y artísticos.
- 'Formal': Usa un lenguaje técnico, preciso y una estructura muy ordenada. Tono serio y profesional. Los prompts de imagen deben ser fotorrealistas y directos.
- 'Divertido': Usa un lenguaje cercano, humor y ejemplos entretenidos. Tono ligero y amigable. Los prompts de imagen deben ser coloridos y caricaturescos.
- 'Informativo': Céntrate en los datos, hechos y explicaciones claras. Tono neutral y directo. Los prompts de imagen deben ser infografías o diagramas claros.

El guion debe incluir:
1.  Un título principal.
2.  Una introducción GENERAL del tema (para el Expositor 1) y un prompt para su imagen.
3.  Párrafos de contenido para cada uno de los {{exhibitorCount}} expositores, cada uno con su propio prompt de imagen. Los expositores que no son el primero ni el último deben presentar ÚNICAMENTE la información que les corresponde.
4.  Una conclusión para resumir los puntos clave (para el último expositor) y un prompt para su imagen.

La longitud de la presentación debe ser '{{length}}'. Ajusta la profundidad del contenido:
- 'corta': Genera explicaciones detalladas y elaboradas para cada punto.
- 'media': Crea un análisis en profundidad, con más datos, ejemplos o detalles.
- 'larga': Desarrolla párrafos muy extensos y un análisis exhaustivo.

El resultado debe ser un JSON estructurado con título, introducción (con content y imagePrompt), un array de \`exhibitorSections\` (cada una con content y imagePrompt), y una conclusión (con content y imagePrompt).

Tema: {{{topic}}}
Número de expositores: {{{exhibitorCount}}}
Longitud: {{{length}}}
Estilo: {{{style}}}

Genera el guion y los prompts de imagen.`,
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
