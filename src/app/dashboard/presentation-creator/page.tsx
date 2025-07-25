'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createPresentation } from '@/ai/flows/presentation-creator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(3, { message: 'El tema debe tener al menos 3 caracteres.' }),
  slideCount: z.number().min(3).max(15),
});

type FormValues = z.infer<typeof formSchema>;

export default function PresentationCreatorPage() {
  const [slides, setSlides] = useState<string[] | null>(null);
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
    setSlides(null);
    try {
      const result = await createPresentation(values);
      setSlides(result.slides);
      addXP(10, 'presentation-creator');
      toast({
        title: "✨ +10 XP",
        description: "¡Has ganado experiencia por usar el Creador de Exposiciones!",
      });
    } catch (error) {
      console.error(error);
      // Handle error display
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Creador de Exposiciones</h1>
        <p className="text-muted-foreground">Genera contenido para tus diapositivas sobre cualquier tema.</p>
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
                    <FormLabel>Número de Diapositivas: {field.value}</FormLabel>
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
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generar Exposición</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Diapositivas Generadas</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p>Generando diapositivas...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {slides && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Diapositivas Generadas</CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full">
              <CarouselContent>
                {slides.map((slideContent, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card className="h-80 bg-muted/50">
                        <CardHeader>
                          <CardTitle className="font-headline">Diapositiva {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex h-full items-center justify-center p-6 text-center">
                          <p className="whitespace-pre-wrap">{slideContent}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
