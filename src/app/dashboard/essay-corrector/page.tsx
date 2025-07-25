'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { correctEssay } from '@/ai/flows/essay-corrector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles, PenSquare } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  text: z.string().min(50, {
    message: 'El texto debe tener al menos 50 caracteres para ser corregido.',
  }),
});

export default function EssayCorrectorPage() {
  const [correctedText, setCorrectedText] = useState<string | null>(null);
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
    setCorrectedText(null);
    try {
      const result = await correctEssay(values);
      setCorrectedText(result.correctedText);
      addXP(10, 'essay-corrector');
      toast({
        title: "✨ +10 XP",
        description: "¡Has ganado experiencia por usar el Corrector de Ensayos!",
      });
    } catch (error) {
      console.error(error);
      setCorrectedText('Se produjo un error al corregir el texto. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Corrector de Ensayos</h1>
        <p className="text-muted-foreground">Pega tu ensayo o texto y la IA lo corregirá por ti.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tu Texto</CardTitle>
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
                          placeholder="Pega aquí tu ensayo o cualquier texto que quieras corregir..."
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
                      Corrigiendo...
                    </>
                  ) : (
                    <>
                      <PenSquare className="mr-2 h-4 w-4" />
                      Corregir Texto
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Texto Corregido</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading && (
                  <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                          <Loader2 className="h-5 w-5 animate-spin text-primary" />
                          <p>La IA está revisando tu texto...</p>
                      </div>
                      <div className="space-y-2">
                          <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                          <div className="h-4 w-5/6 animate-pulse rounded-md bg-muted"></div>
                          <div className="h-4 w-full animate-pulse rounded-md bg-muted"></div>
                          <div className="h-4 w-3/4 animate-pulse rounded-md bg-muted"></div>
                      </div>
                  </div>
              )}
              {correctedText && !isLoading && (
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap rounded-md bg-muted/50 p-4 font-mono text-sm">
                      {correctedText}
                  </div>
              )}
              {!correctedText && !isLoading && (
                <div className="flex h-[300px] items-center justify-center rounded-md border-2 border-dashed bg-muted/50">
                    <p className="text-muted-foreground">La corrección aparecerá aquí.</p>
                </div>
              )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
