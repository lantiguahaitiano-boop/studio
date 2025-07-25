'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { aiTaskAssistant } from '@/ai/flows/ai-task-assistant';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  problemDescription: z.string().min(10, {
    message: 'La descripción del problema debe tener al menos 10 caracteres.',
  }),
});

export default function TaskAssistantPage() {
  const [solution, setSolution] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      problemDescription: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSolution(null);
    try {
      const result = await aiTaskAssistant(values);
      setSolution(result.stepByStepSolution);
      addXP(10);
      toast({
        title: "✨ +10 XP",
        description: "¡Has ganado experiencia por usar el Asistente de Tareas!",
      });
    } catch (error) {
      console.error(error);
      setSolution('Se produjo un error al generar la solución. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Asistente de Tareas IA</h1>
        <p className="text-muted-foreground">Describe cualquier problema académico y obtén una solución paso a paso.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Describe tu Problema</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="problemDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Problema Académico</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ej: ¿Cómo se balancea la ecuación química H2 + O2 -> H2O?"
                        className="min-h-[120px]"
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
                    Generando...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Obtener Solución
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
                <CardTitle>Solución Paso a Paso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p>El asistente IA está pensando...</p>
                </div>
                <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                    <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted"></div>
                    <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                </div>
            </CardContent>
        </Card>
      )}

      {solution && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Solución Paso a Paso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted/50 p-4 font-mono text-sm">
                {solution}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
