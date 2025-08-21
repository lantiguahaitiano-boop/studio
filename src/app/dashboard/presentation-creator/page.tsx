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
import { Loader2, Sparkles, Presentation as PresentationIcon, Users, Image as ImageIcon, Copy, Download } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { AnimatedDiv } from '@/components/ui/animated-div';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const formSchema = z.object({
  topic: z.string().min(3, { message: 'El tema debe tener al menos 3 caracteres.' }),
  exhibitorCount: z.number().min(1).max(10),
  length: z.enum(['corta', 'media', 'larga']),
  style: z.enum(['Creativo', 'Formal', 'Divertido', 'Informativo']),
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
      exhibitorCount: 1,
      length: 'media',
      style: 'Informativo',
    },
  });

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    toast({
      title: "Prompt Copiado",
      description: "Puedes pegarlo en el Generador de Imágenes.",
    });
  };

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

  const handleDownload = () => {
    if (!presentationPlan) return;
    let content = `Título: ${presentationPlan.title}\n\n`;
    content += `====================\n`;
    content += `Introducción (Expositor 1):\n${presentationPlan.introduction.content}\n`;
    content += `Prompt de imagen: ${presentationPlan.introduction.imagePrompt}\n\n`;
    
    presentationPlan.exhibitorSections.forEach(section => {
      content += `====================\n`;
      content += `Expositor ${section.exhibitor}:\n${section.content}\n`;
      content += `Prompt de imagen: ${section.imagePrompt}\n\n`;
    });

    content += `====================\n`;
    content += `Conclusión (Último Expositor):\n${presentationPlan.conclusion.content}\n`;
    content += `Prompt de imagen: ${presentationPlan.conclusion.imagePrompt}\n\n`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'guion-exposicion-skillico.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const SectionContent = ({ title, content, imagePrompt }: { title: string, content: string, imagePrompt: string }) => (
     <div className="space-y-4">
        <Separator />
        <h3 className="font-headline text-lg">{title}</h3>
        <p>{content}</p>
        <div className="rounded-md border border-dashed bg-muted/50 p-3">
          <div className="flex items-center justify-between gap-2">
              <div className="flex items-start gap-2">
                  <ImageIcon className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <p className="text-sm text-muted-foreground italic">
                    <span className="font-semibold text-foreground">Sugerencia de imagen:</span> "{imagePrompt}"
                  </p>
              </div>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                         <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCopyPrompt(imagePrompt)}>
                            <Copy className="h-4 w-4" />
                            <span className="sr-only">Copiar prompt</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Copiar prompt</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
  );

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
                    name="exhibitorCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Expositores: {field.value}</FormLabel>
                        <FormControl>
                          <Slider
                            min={1}
                            max={10}
                            step={1}
                            defaultValue={[field.value]}
                            onValueChange={(vals) => field.onChange(vals[0])}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="style"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estilo de la Exposición</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un estilo" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Informativo">Informativo</SelectItem>
                                <SelectItem value="Creativo">Creativo</SelectItem>
                                <SelectItem value="Formal">Formal</SelectItem>
                                <SelectItem value="Divertido">Divertido</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Longitud del Contenido</FormLabel>
                        <FormControl>
                          <ToggleGroup
                            type="single"
                            defaultValue={field.value}
                            onValueChange={(value) => {
                                if (value) field.onChange(value as 'corta' | 'media' | 'larga')
                            }}
                            className="grid grid-cols-3"
                          >
                            <ToggleGroupItem value="corta" aria-label="Corta">Corta</ToggleGroupItem>
                            <ToggleGroupItem value="media" aria-label="Media">Media</ToggleGroupItem>
                            <ToggleGroupItem value="larga" aria-label="Larga">Larga</ToggleGroupItem>
                          </ToggleGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando Guion...</>
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
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Guion de la Exposición</CardTitle>
                            <CardDescription>El contenido y sugerencias de imágenes para tu presentación.</CardDescription>
                        </div>
                        {presentationPlan && !isLoading && (
                            <Button onClick={handleDownload} variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" />
                                Descargar Guion
                            </Button>
                        )}
                    </div>
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
                        
                        <SectionContent 
                            title="Introducción (Expositor 1)"
                            content={presentationPlan.introduction.content}
                            imagePrompt={presentationPlan.introduction.imagePrompt}
                        />

                        {presentationPlan.exhibitorSections.map((section, index) => (
                            <SectionContent 
                                key={index}
                                title={`Expositor ${section.exhibitor}`}
                                content={section.content}
                                imagePrompt={section.imagePrompt}
                            />
                        ))}
                        
                        <SectionContent 
                            title="Conclusión (Último Expositor)"
                            content={presentationPlan.conclusion.content}
                            imagePrompt={presentationPlan.conclusion.imagePrompt}
                        />
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
