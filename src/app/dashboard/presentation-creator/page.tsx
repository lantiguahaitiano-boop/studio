'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPresentation, CreatePresentationOutput } from '@/ai/flows/presentation-creator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Loader2, Sparkles, Presentation as PresentationIcon } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { AnimatedDiv } from '@/components/ui/animated-div';

const formSchema = z.object({
  topic: z.string().min(3, { message: 'El tema debe tener al menos 3 caracteres.' }),
  slideCount: z.number().min(3).max(15),
});

type FormValues = z.infer<typeof formSchema>;

export default function PresentationCreatorPage() {
  const [presentationPlan, setPresentationPlan] = useState<CreatePresentationOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      slideCount: 5,
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setPresentationPlan(null);
    try {
      const result = await createPresentation(values);
      setPresentationPlan(result);
      addXP(10, 'presentation-creator');
      toast({
        title: "✨ +10 XP",
        description: "¡Has ganado experiencia por usar el Creador de Exposiciones!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error al generar la presentación',
        description: 'Hubo un problema al crear el plan. Por favor, inténtalo de nuevo.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AnimatedDiv className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Creador de Exposiciones</h1>
        <p className="text-muted-foreground">Genera un guion estructurado para tus exposiciones sobre cualquier tema.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Detalles de la Exposición</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="topic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tema</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: La historia de la computación cuántica" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="slideCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Secciones Principales: {field.value}</FormLabel>
                        <FormControl>
                          <Slider
                            min={3}
                            max={15}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando Plan...</>
                    ) : (
                      <><Sparkles className="mr-2 h-4 w-4" /> Generar Guion</>
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
                    <CardTitle>Guion de la Exposición</CardTitle>
                    <CardDescription>Aquí tienes el contenido completo para tu presentación.</CardDescription>
                </CardHeader>
                <CardContent>
                {isLoading && (
                    <div className="flex flex-col items-center justify-center space-y-4 p-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-muted-foreground">La IA está estructurando la información...</p>
                    </div>
                )}
                {presentationPlan && !isLoading && (
                    <AnimatedDiv className="prose prose-invert max-w-none rounded-md border bg-muted/30 p-4">
                        <h2 className="font-headline text-2xl text-primary">{presentationPlan.title}</h2>
                        
                        <h3 className="font-headline text-lg">Introducción</h3>
                        <p>{presentationPlan.introduction}</p>

                        {presentationPlan.sections.map((section, index) => (
                            <div key={index} className="mt-4">
                                <h3 className="font-headline text-lg">{section.title}</h3>
                                <ul className="list-disc pl-5">
                                    {section.points.map((point, pointIndex) => (
                                    <li key={pointIndex}>{point}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}

                        <h3 className="font-headline text-lg mt-4">Conclusión</h3>
                        <p>{presentationPlan.conclusion}</p>
                    </AnimatedDiv>
                )}
                {!presentationPlan && !isLoading && (
                    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                        <PresentationIcon className="h-12 w-12 text-muted-foreground" />
                        <p className="mt-4 font-semibold">Tu guion está listo para ser creado</p>
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
