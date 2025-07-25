'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { educationalTranslator } from '@/ai/flows/educational-translator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, ArrowRightLeft } from 'lucide-react';

const formSchema = z.object({
  text: z.string().min(5, { message: 'El texto debe tener al menos 5 caracteres.' }),
  targetLanguage: z.string({ required_error: 'Por favor, selecciona un idioma.' }),
  context: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const languages = [
  { value: 'English', label: 'Inglés' },
  { value: 'Spanish', label: 'Español' },
  { value: 'French', label: 'Francés' },
  { value: 'German', label: 'Alemán' },
  { value: 'Portuguese', label: 'Portugués' },
  { value: 'Italian', label: 'Italiano' },
  { value: 'Chinese', label: 'Chino' },
];

export default function TranslatorPage() {
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      targetLanguage: 'English',
      context: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setTranslatedText('');
    try {
      const result = await educationalTranslator(values);
      setTranslatedText(result.translatedText);
    } catch (error) {
      console.error(error);
      setTranslatedText('Se produjo un error al traducir. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Traductor Educativo</h1>
        <p className="text-muted-foreground">Traduce textos académicos con contexto para mayor precisión.</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="targetLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Traducir a</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          {languages.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="context"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contexto (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Es un artículo sobre biología molecular." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="text"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Texto a Traducir</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Escribe o pega tu texto aquí..." className="min-h-[200px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Traducción</FormLabel>
                  <Textarea
                    readOnly
                    placeholder={isLoading ? "Traduciendo..." : "La traducción aparecerá aquí..."}
                    className="min-h-[200px] bg-muted/50"
                    value={translatedText}
                  />
                </FormItem>
              </div>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Traduciendo...</>
                ) : (
                  <><ArrowRightLeft className="mr-2 h-4 w-4" /> Traducir</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
