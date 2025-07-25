'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateExam } from '@/ai/flows/exam-creator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Loader2, Sparkles, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  topic: z.string().min(5, {
    message: 'El tema debe tener al menos 5 caracteres.',
  }),
  numQuestions: z.number().min(1).max(20),
});

type Exam = {
    question: string;
    options: string[];
    answer: string;
}

export default function ExamCreatorPage() {
  const [exam, setExam] = useState<Exam[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { addXP } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      numQuestions: 5,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setExam(null);
    try {
      const result = await generateExam(values);
      setExam(result.questions);
      addXP(10, 'exam-creator');
      toast({
        title: "✨ +10 XP",
        description: "¡Has ganado experiencia por usar el Creador de Exámenes!",
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
        <h1 className="font-headline text-3xl font-bold tracking-tighter md:text-4xl">Creador de Exámenes</h1>
        <p className="text-muted-foreground">Crea exámenes personalizados sobre cualquier tema.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Examen</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tema del Examen</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: La Segunda Guerra Mundial, Álgebra Lineal, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numQuestions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Preguntas: {field.value}</FormLabel>
                    <FormControl>
                      <Slider
                        min={1}
                        max={20}
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
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creando Examen...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Generar Examen</>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Examen Generado</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-12">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <p>La IA está preparando tu examen...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {exam && !isLoading && (
        <Card>
          <CardHeader>
            <CardTitle>Examen Generado</CardTitle>
            <CardDescription>Revisa las preguntas y expande para ver las respuestas correctas.</CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {exam.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    <div className="flex items-start gap-3 text-left">
                        <HelpCircle className="mt-1 h-5 w-5 shrink-0 text-primary" />
                        <span>{index + 1}. {item.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 pl-8">
                        {item.options.map((option, optionIndex) => (
                            <div key={optionIndex} className={`p-2 rounded-md text-sm ${option === item.answer ? 'bg-green-500/20 text-green-200' : 'bg-muted/50'}`}>
                                {option}
                            </div>
                        ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
