'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateImage } from '@/ai/flows/image-generator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Image as ImageIcon, Download } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { AnimatedDiv } from '@/components/ui/animated-div';
import NextImage from 'next/image';

const formSchema = z.object({
  prompt: z.string().min(10, {
    message: 'El prompt debe tener al menos 10 caracteres.',
  }),
});

export default function ImageGeneratorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setImageUrl(null);
    try {
      const result = await generateImage(values);
      setImageUrl(result.imageDataUri);
      addXP(20, 'image-generator');
      toast({
        title: "✨ +20 XP",
        description: "¡Has ganado experiencia por usar el Generador de Imágenes!",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error al generar imagen",
        description: "No se pudo crear la imagen. El modelo puede estar ocupado. Inténtalo de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'skillico-generated-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <AnimatedDiv className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Generador de Imágenes</h1>
        <p className="text-muted-foreground">Crea imágenes únicas a partir de una descripción de texto.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Crea tu Imagen</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prompt de la Imagen</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Ej: Un astronauta leyendo un libro en la luna, estilo acuarela."
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
                        Crear Imagen
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
                    <CardTitle>Imagen Generada</CardTitle>
                    <CardDescription>La imagen creada por la IA aparecerá aquí.</CardDescription>
                </CardHeader>
                <CardContent className="overflow-hidden">
                    {isLoading && (
                        <div className="flex aspect-video flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            <p className="text-muted-foreground">La IA está dibujando tu idea...</p>
                        </div>
                    )}
                    {imageUrl && !isLoading && (
                        <AnimatedDiv className="space-y-4">
                            <NextImage 
                                src={imageUrl} 
                                alt={form.getValues('prompt')} 
                                width={1024} 
                                height={576} 
                                className="aspect-video w-full rounded-lg object-contain border bg-muted"
                            />
                            <Button onClick={handleDownload} className="w-full">
                                <Download className="mr-2 h-4 w-4" />
                                Descargar Imagen
                            </Button>
                        </AnimatedDiv>
                    )}
                     {!imageUrl && !isLoading && (
                        <div className="flex aspect-video min-h-[300px] flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                             <ImageIcon className="h-12 w-12 text-muted-foreground" />
                            <p className="mt-4 font-semibold">Tu lienzo está en blanco</p>
                            <p className="text-sm text-muted-foreground">Escribe un prompt para empezar a crear</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </AnimatedDiv>
  );
}
