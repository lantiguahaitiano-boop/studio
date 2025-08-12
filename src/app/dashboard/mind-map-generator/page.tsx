'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateMindMap, MindMapNode } from '@/ai/flows/mind-map-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { AnimatedDiv } from '@/components/ui/animated-div';
import { MindMapVisualizer } from '@/components/mind-map/MindMapVisualizer';

const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'El tema debe tener al menos 3 caracteres.',
  }),
});

export default function MindMapGeneratorPage() {
  const [mindMap, setMindMap] = useState<MindMapNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMindMap(null);
    try {
      const result = await generateMindMap(values);
      setMindMap(result.root);
      addXP(15, 'mind-map-generator');
      toast({
        title: "✨ +15 XP",
        description: "¡Has ganado experiencia por usar el Generador de Mapas Mentales!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error al generar",
        description: "No se pudo crear el mapa mental. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatedDiv className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Herramienta de Mapas Mentales</h1>
        <p className="text-muted-foreground">Transforma cualquier tema en un mapa mental claro y estructurado.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Generar Mapa Mental</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tema Central</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ej: El Sistema Solar, La Revolución Francesa..."
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
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Crear Mapa Mental
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
                    <CardDescription>El mapa mental generado aparecerá aquí.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center space-y-4 p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">La IA está conectando las ideas...</p>
                        </div>
                    )}
                    {mindMap && !isLoading && (
                        <AnimatedDiv>
                            <MindMapVisualizer node={mindMap} />
                        </AnimatedDiv>
                    )}
                     {!mindMap && !isLoading && (
                        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                             <BrainCircuit className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 font-semibold">Tu mapa mental está listo para ser creado</p>
                            <p className="text-sm text-muted-foreground">Introduce un tema para empezar</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AnimatedDiv>
  );
}
