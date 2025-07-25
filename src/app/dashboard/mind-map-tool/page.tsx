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
import { MindMapVisualizer } from '@/components/mind-map/MindMapVisualizer';

const formSchema = z.object({
  topic: z.string().min(3, {
    message: 'El tema debe tener al menos 3 caracteres.',
  }),
});

export default function MindMapToolPage() {
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
      addXP(15, 'mind-map-tool');
      toast({
        title: "✨ +15 XP",
        description: "¡Has ganado experiencia por crear un mapa mental!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo generar el mapa mental. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Generador de Mapas Mentales</h1>
        <p className="text-muted-foreground">Introduce un tema y la IA creará un mapa mental para organizar las ideas clave.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tema Central</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>¿Sobre qué quieres crear tu mapa mental?</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: La Revolución Industrial, El sistema solar..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generando...</>
                ) : (
                  <><BrainCircuit className="mr-2 h-4 w-4" /> Generar Mapa Mental</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
         <Card>
            <CardHeader>
                <CardTitle>Mapa Mental</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-12">
                <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <p>La IA está visualizando tus ideas...</p>
                </div>
            </CardContent>
        </Card>
      )}

      {mindMap && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Mapa Mental sobre &quot;{mindMap.label}&quot;</CardTitle>
            <CardDescription>Explora la estructura generada por la IA.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border bg-muted/20 p-4">
              <MindMapVisualizer node={mindMap} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
