'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { explainConcept } from '@/ai/flows/concept-explainer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Lightbulb } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  concept: z.string().min(5, {
    message: 'El concepto debe tener al menos 5 caracteres.',
  }),
});

export default function InteractiveAssistantPage() {
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      concept: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setExplanation(null);
    try {
      const result = await explainConcept(values);
      setExplanation(result.explanation);
      addXP(10);
      toast({
        title: "✨ +10 XP",
        description: "¡Has ganado experiencia por usar el Asistente Interactivo!",
      });
    } catch (error) {
      console.error(error);
      setExplanation('Se produjo un error al generar la explicación. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Explicador Interactivo</h1>
        <p className="text-muted-foreground">¿Qué te gustaría entender? La IA te lo explica en detalle.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Concepto a Explicar</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="concept"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Escribe una palabra, frase o pregunta</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: ¿Por qué el cielo es azul?"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Explicando...
                  </>
                ) : (
                  <>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Explicar
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
            <CardHeader>
                <CardTitle>Generando Explicación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p>La IA está preparando una explicación detallada...</p>
                </div>
                <div className="space-y-2 pt-4">
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                    <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted"></div>
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                     <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
                </div>
            </CardContent>
        </Card>
      )}

      {explanation && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Explicación Detallada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted/50 p-4 font-mono text-sm">
                {explanation}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
