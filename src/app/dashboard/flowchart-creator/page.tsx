'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateFlowchart, GenerateFlowchartOutput } from '@/ai/flows/flowchart-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, GitFork, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { AnimatedDiv } from '@/components/ui/animated-div';
import { FlowchartVisualizer } from '@/components/flowchart/FlowchartVisualizer';

const formSchema = z.object({
  process: z.string().min(10, {
    message: 'La descripción del proceso debe tener al menos 10 caracteres.',
  }),
});

export default function FlowchartCreatorPage() {
  const [flowchart, setFlowchart] = useState<GenerateFlowchartOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      process: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setFlowchart(null);
    try {
      const result = await generateFlowchart(values);
      setFlowchart(result);
      addXP(15, 'flowchart-creator');
      toast({
        title: "✨ +15 XP",
        description: "¡Has ganado experiencia por usar el Creador de Diagramas de Flujo!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error al generar",
        description: "No se pudo crear el diagrama de flujo. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatedDiv className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Creador de Diagramas de Flujo</h1>
        <p className="text-muted-foreground">Describe un proceso y la IA lo convertirá en un diagrama de flujo.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Generar Diagrama</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="process"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción del Proceso</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ej: Proceso para hacer café por la mañana, desde moler los granos hasta servirlo."
                            className="min-h-[150px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Crear Diagrama
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
            <Card className="min-h-[400px]">
                <CardHeader>
                    <CardTitle>Visualización</CardTitle>
                    <CardDescription>El diagrama de flujo generado aparecerá aquí.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center space-y-4 p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">La IA está esquematizando el proceso...</p>
                        </div>
                    )}
                    {flowchart && !isLoading && (
                        <AnimatedDiv>
                            <FlowchartVisualizer data={flowchart} />
                        </AnimatedDiv>
                    )}
                     {!flowchart && !isLoading && (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                             <GitFork className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 font-semibold">Tu diagrama está listo para ser creado</p>
                            <p className="text-sm text-muted-foreground">Describe un proceso para empezar</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AnimatedDiv>
  );
}
