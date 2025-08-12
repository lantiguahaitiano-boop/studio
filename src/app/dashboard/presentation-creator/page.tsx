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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, Sparkles, Presentation as PresentationIcon, BookCheck, ClipboardList } from 'lucide-react';
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
        <p className="text-muted-foreground">Genera un plan estructurado para tus exposiciones sobre cualquier tema.</p>
      </div>

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
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando Plan...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generar Plan de Exposición</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Plan de Exposición</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p>La IA está estructurando la información...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {presentationPlan && !isLoading && (
        <AnimatedDiv>
        <Card>
          <CardHeader>
            <CardTitle>{presentationPlan.title}</CardTitle>
            <CardDescription>Aquí tienes una estructura sugerida para tu exposición.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible defaultValue="item-intro" className="w-full">
                <AccordionItem value="item-intro">
                    <AccordionTrigger><div className="flex items-center gap-2"><ClipboardList className="h-5 w-5"/>Introducción</div></AccordionTrigger>
                    <AccordionContent className="whitespace-pre-wrap pl-8 text-muted-foreground">{presentationPlan.introduction}</AccordionContent>
                </AccordionItem>
                {presentationPlan.sections.map((section, index) => (
                    <AccordionItem value={`item-${index}`} key={index}>
                        <AccordionTrigger><div className="flex items-center gap-2"><PresentationIcon className="h-5 w-5"/>{section.title}</div></AccordionTrigger>
                        <AccordionContent className="pl-8">
                          <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                            {section.points.map((point, pointIndex) => (
                              <li key={pointIndex}>{point}</li>
                            ))}
                          </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
                 <AccordionItem value="item-conclusion">
                    <AccordionTrigger><div className="flex items-center gap-2"><BookCheck className="h-5 w-5"/>Conclusión</div></AccordionTrigger>
                    <AccordionContent className="whitespace-pre-wrap pl-8 text-muted-foreground">{presentationPlan.conclusion}</AccordionContent>
                </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
        </AnimatedDiv>
      )}
    </AnimatedDiv>
  );
}
