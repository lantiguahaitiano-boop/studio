'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { summarizeText } from '@/ai/flows/text-summarizer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, Download } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { AnimatedDiv } from '@/components/ui/animated-div';

const formSchema = z.object({
  text: z.string().min(100, {
    message: 'El texto debe tener al menos 100 caracteres para ser resumido.',
  }),
});

export default function TextSummarizerPage() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await summarizeText(values);
      setSummary(result.summary);
      addXP(10, 'text-summarizer');
       toast({
        title: "✨ +10 XP",
        description: "¡Has ganado experiencia por usar el Resumidor de Texto!",
      });
    } catch (error) {
      console.error(error);
      setSummary('Se produjo un error al generar el resumen. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleDownload = () => {
    if (!summary) return;
    const blob = new Blob([summary], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'resumen-skillico.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatedDiv className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Resumen de Texto</h1>
        <p className="text-muted-foreground">Pega un texto largo y obtén un resumen conciso y claro.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Texto Original</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Pega aquí el texto que quieres resumir..."
                          className="min-h-[300px]"
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
                      Resumiendo...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generar Resumen
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Resumen Generado</CardTitle>
                <CardDescription>El resultado de la IA aparecerá aquí.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading && (
                  <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <p>La IA está generando el resumen...</p>
                      </div>
                      <div className="space-y-2">
                          <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                          <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted"></div>
                          <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                          <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
                      </div>
                  </div>
              )}
              {summary && !isLoading && (
                  <AnimatedDiv className="space-y-4">
                    <div className="prose prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted/50 p-4 font-mono text-sm h-[300px] overflow-auto">
                        {summary}
                    </div>
                     <Button onClick={handleDownload} variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Descargar Resumen
                    </Button>
                  </AnimatedDiv>
              )}
              {!summary && !isLoading && (
                <div className="flex h-[300px] items-center justify-center rounded-md border-2 border-dashed bg-muted/50">
                    <p className="text-muted-foreground">El resumen aparecerá aquí.</p>
                </div>
              )}
            </CardContent>
        </Card>
      </div>
    </AnimatedDiv>
  );
}
